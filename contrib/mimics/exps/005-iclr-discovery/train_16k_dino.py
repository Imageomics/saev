"""Training sweep for 16K-latent SAEs on Cambridge butterflies (384p, v1.6)."""


def make_cfgs() -> list[dict]:
    n_train = 100_000_000
    batch_size = 1024 * 8


    # Cambridge butterfly v1.6 shards, DINOv3 ViT-L/16, 384 patches, prefer-fg
    shards_384 = "/fs/scratch/PAS2136/jbeattie/saev/shards/93a3db75"

    cfgs = []
    for layer in [21, 23]:
        for k in [16, 32, 64, 128]:
            for lr in [3e-4, 1e-3, 3e-3]:
                cfgs.append({
                    "tags": ["mimics-16k-dino-384p-v1.6"],
                    # "slurm_acct": "PAS2136",
                    # "slurm_partition": "nextgen",
                    # "n_hours": 8.0,
                    "lr": lr,
                    "n_lr_warmup": 500,
                    "n_sparsity_warmup": n_train // batch_size,
                    "runs_root": "/fs/ess/PAS2136/jbeattie/saev/runs",
                    "n_train": n_train,
                    "sae": {
                        "d_model": 1024,
                        "d_sae": 1024 * 16,
                        "normalize_w_dec": True,
                        "remove_parallel_grads": True,
                        "activation": {"top_k": k},
                        "reinit_blend": 0.8,
                    },
                    "train_data": {
                        "layer": layer,
                        "shards": shards_384,
                        "batch_size": batch_size,
                        "min_buffer_fill": 0.2,
                        "ignore_labels": [0],
                        "use_tmpdir": True,
                    },
                    "val_data": {
                        "layer": layer,
                        "shards": shards_384,
                        "batch_size": batch_size,
                        "ignore_labels": [0],
                        "use_tmpdir": True,
                    },
                })
    return cfgs
