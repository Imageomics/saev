"""Tests for MiniBatchNMF, including agreement with sklearn's NMF on full data."""

import itertools

import torch
import torch.nn.functional as F
from sklearn.decomposition import NMF as SklearnNMF
from tdiscovery.baselines import MiniBatchNMF, TrainConfig, dump, load

import saev.data
import saev.disk


def _generate_nmf_data(
    *,
    n_samples: int = 256,
    n_features: int = 8,
    n_concepts: int = 4,
    seed: int = 0,
) -> torch.Tensor:
    torch.manual_seed(seed)
    z = torch.rand(n_samples, n_concepts)
    D = torch.rand(n_concepts, n_features)
    return (z @ D).to(torch.float32)


def _fit_full_batch(
    acts: torch.Tensor,
    *,
    n_concepts: int,
    epochs: int,
    seed: int,
) -> MiniBatchNMF:
    torch.manual_seed(seed)
    model = MiniBatchNMF(
        n_concepts=n_concepts,
        device="cpu",
        z_iters=10,
        encode_iters=200,
        d_iters=10,
        d_update_every=1,
    )
    for _ in range(epochs):
        model.partial_fit(acts)
    return model


def _best_permutation_similarity(a: torch.Tensor, b: torch.Tensor) -> float:
    assert a.shape == b.shape
    n = a.shape[0]
    a_norm = F.normalize(a, dim=1)
    b_norm = F.normalize(b, dim=1)
    similarity = torch.abs(a_norm @ b_norm.mT)
    best = max(
        sum(similarity[i, perm[i]].item() for i in range(n))
        for perm in itertools.permutations(range(n))
    )
    return best / n


def test_minibatch_nmf_matches_sklearn_nmf_on_full_data() -> None:
    acts = _generate_nmf_data()
    n_concepts = 4
    epochs = 100

    model = _fit_full_batch(acts, n_concepts=n_concepts, epochs=epochs, seed=0)
    assert model.D_ is not None
    assert model.n_samples_seen_ == acts.shape[0] * epochs
    assert torch.all(model.D_ >= 0)

    codes = model.transform(acts)
    assert codes.shape == (acts.shape[0], n_concepts)
    assert torch.all(codes >= 0)

    ours_mse = float(((acts - codes @ model.D_) ** 2).mean().item())
    assert ours_mse < 1e-3, f"MiniBatchNMF did not converge: mse={ours_mse:.3e}"

    reference = SklearnNMF(
        n_components=n_concepts, init="random", random_state=0, max_iter=500
    )
    ref_codes = torch.tensor(reference.fit_transform(acts.numpy()))
    ref_dict = torch.tensor(reference.components_)
    assert torch.all(ref_codes >= 0)
    assert torch.all(ref_dict >= 0)
    ref_mse = float(((acts - ref_codes @ ref_dict) ** 2).mean().item())
    assert ref_mse < 1e-3, f"sklearn NMF did not converge: mse={ref_mse:.3e}"

    assert ours_mse < 100 * ref_mse, (
        f"Recon gap too large: ours={ours_mse:.3e} vs sklearn={ref_mse:.3e}"
    )
    similarity = _best_permutation_similarity(ref_dict, model.D_)
    assert similarity > 0.8, f"Dictionaries disagree: cosine sim={similarity:.3f}"


def test_minibatch_nmf_round_trip(tmp_path) -> None:
    train_shards = tmp_path / "train-shards"
    val_shards = tmp_path / "val-shards"
    train_shards.mkdir(parents=True, exist_ok=True)
    val_shards.mkdir(parents=True, exist_ok=True)
    runs_root = tmp_path / "saev" / "runs"
    runs_root.mkdir(parents=True, exist_ok=True)

    cfg = TrainConfig(
        method="nmf",
        k=3,
        device="cpu",
        runs_root=runs_root,
        train_data=saev.data.ShuffledConfig(shards=train_shards),
        val_data=saev.data.ShuffledConfig(shards=val_shards),
        z_iters=7,
        encode_iters=11,
        d_iters=5,
        ridge=1e-5,
        eps=1e-6,
        forget_factor=0.5,
        d_update_every=2,
    )
    run = saev.disk.Run.new(
        "nmf-round-trip",
        train_shards_dir=train_shards,
        val_shards_dir=val_shards,
        runs_root=cfg.runs_root,
    )

    model = MiniBatchNMF(
        n_concepts=cfg.k,
        device="cpu",
        z_iters=cfg.z_iters,
        encode_iters=cfg.encode_iters,
        d_iters=cfg.d_iters,
        batch_size=cfg.train_data.batch_size,
        ridge=cfg.ridge,
        eps=cfg.eps,
        forget_factor=cfg.forget_factor,
        d_update_every=cfg.d_update_every,
    )
    model.D_ = torch.rand(cfg.k, 5)
    model.n_features_in_ = 5
    model.n_samples_seen_ = 128
    model.n_steps_ = 7

    dump(run, cfg, model=model)
    loaded = load(run, device="cpu")

    assert isinstance(loaded, MiniBatchNMF)
    assert loaded.D_ is not None
    assert torch.allclose(loaded.D_, model.D_)
    assert loaded.n_features_in_ == model.n_features_in_
    assert loaded.n_samples_seen_ == model.n_samples_seen_
    assert loaded.n_steps_ == model.n_steps_
    assert loaded.z_iters == cfg.z_iters
    assert loaded.encode_iters == cfg.encode_iters
    assert loaded.d_iters == cfg.d_iters
    assert loaded.ridge == cfg.ridge
    assert loaded.eps == cfg.eps
    assert loaded.forget_factor == cfg.forget_factor
    assert loaded.d_update_every == cfg.d_update_every
