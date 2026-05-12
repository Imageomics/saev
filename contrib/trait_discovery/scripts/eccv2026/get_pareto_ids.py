"""Print copy-pasteable Pareto run IDs for ECCV 2026 figures.

Usage:
    uv run python contrib/trait_discovery/scripts/eccv2026/get_pareto_ids.py

Selection defaults are tailored to the Figure 2 setting:
- tag: in1k-v0.4.1
- model: DINOv3 ViT-L/16
- layer: 23 (0-indexed final layer)
- val shard: 3e27794f (IN1K val)

Pareto rule per bucket:
1. sort by summary/eval/l0 (ascending),
2. keep points where inference metrics.json metric is cumulative-minimum.
"""

import dataclasses
import json
import math
import pathlib

import beartype
import tyro
import wandb

BUCKET_ORDER = ("sae_relu", "matryoshka_relu", "matryoshka_topk")


@beartype.beartype
@dataclasses.dataclass(frozen=True)
class Config:
    project: str = "samuelstevens/saev"
    tag: str = "in1k-v0.4.1"
    layer: int = 23
    model_family: str = "dinov3"
    model_ckpt_substr: str = "vitl"
    val_shard_substr: str = "3e27794f"
    runs_root: pathlib.Path = pathlib.Path("/fs/ess/PAS2136/samuelstevens/saev/runs")
    metrics_shard: str = "3e27794f"
    metric_key: str = "mse_per_dim"
    use_tags_fallback: bool = True


@beartype.beartype
@dataclasses.dataclass(frozen=True)
class RunPoint:
    run_id: str
    bucket: str
    l0: float
    metric: float


@beartype.beartype
def get_bucket(run: wandb.apis.public.Run) -> str:
    objective = run.config.get("objective", {})
    sae = run.config.get("sae", {})
    activation = sae.get("activation", {})

    has_prefixes = isinstance(objective, dict) and isinstance(
        objective.get("n_prefixes"), int
    )
    is_topk = isinstance(activation, dict) and (
        activation.get("key") in {"top-k", "batch-top-k"} or "top_k" in activation
    )

    if is_topk:
        return "matryoshka_topk"
    if has_prefixes:
        return "matryoshka_relu"
    return "sae_relu"


@beartype.beartype
def is_target_run(run: wandb.apis.public.Run, cfg: Config) -> bool:
    train_data = run.config.get("train_data", {})
    val_data = run.config.get("val_data", {})
    metadata = train_data.get("metadata", {})

    layer = train_data.get("layer")
    if layer != cfg.layer:
        return False

    val_shards = val_data.get("shards", "")
    if cfg.val_shard_substr not in str(val_shards):
        return False

    family = (
        metadata.get("family")
        or metadata.get("vit_family")
        or metadata.get("model_family")
    )
    if family != cfg.model_family:
        return False

    ckpt = (
        metadata.get("ckpt") or metadata.get("vit_ckpt") or metadata.get("model_ckpt")
    )
    if cfg.model_ckpt_substr not in str(ckpt):
        return False

    return True


@beartype.beartype
def make_target_runs(cfg: Config) -> list[wandb.apis.public.Run]:
    api = wandb.Api()

    by_id: dict[str, wandb.apis.public.Run] = {}
    for run in api.runs(path=cfg.project, filters={"config.tag": cfg.tag}):
        by_id[run.id] = run

    if cfg.use_tags_fallback:
        for run in api.runs(path=cfg.project, filters={"tags": {"$in": [cfg.tag]}}):
            by_id[run.id] = run

    return [run for run in by_id.values() if is_target_run(run, cfg)]


@beartype.beartype
def get_metric(run_id: str, cfg: Config) -> float | None:
    metrics_fpath = (
        cfg.runs_root / run_id / "inference" / cfg.metrics_shard / "metrics.json"
    )
    if not metrics_fpath.exists():
        return None

    with open(metrics_fpath) as fd:
        metrics = json.load(fd)

    value = metrics.get(cfg.metric_key)
    if not isinstance(value, int | float):
        return None
    metric = float(value)
    if not math.isfinite(metric):
        return None
    return metric


@beartype.beartype
def get_l0(run: wandb.apis.public.Run) -> float | None:
    l0 = run.summary.get("eval/l0")
    if isinstance(l0, int | float):
        return float(l0)

    activation = run.config.get("sae", {}).get("activation", {})
    top_k = activation.get("top_k") if isinstance(activation, dict) else None
    if isinstance(top_k, int | float):
        return float(top_k)

    return None


@beartype.beartype
def make_points(runs: list[wandb.apis.public.Run], cfg: Config) -> list[RunPoint]:
    points: list[RunPoint] = []
    for run in runs:
        l0 = get_l0(run)
        if l0 is None:
            continue

        metric = get_metric(run.id, cfg)
        if metric is None:
            continue

        points.append(
            RunPoint(
                run_id=run.id,
                bucket=get_bucket(run),
                l0=l0,
                metric=metric,
            )
        )
    return points


@beartype.beartype
def make_frontier(points: list[RunPoint]) -> list[RunPoint]:
    points = sorted(points, key=lambda p: (p.l0, p.metric, p.run_id))
    frontier: list[RunPoint] = []
    best_metric = float("inf")
    for point in points:
        if point.metric <= best_metric:
            frontier.append(point)
            best_metric = point.metric
    return frontier


@beartype.beartype
def print_python(frontier_by_bucket: dict[str, list[RunPoint]], cfg: Config) -> None:
    print("# Generated by contrib/trait_discovery/scripts/eccv2026/get_pareto_ids.py")
    print(
        f'# Selection: tag="{cfg.tag}", family="{cfg.model_family}", '
        f'ckpt~"{cfg.model_ckpt_substr}", layer={cfg.layer}, '
        f'val_shard~"{cfg.val_shard_substr}"'
    )
    print(
        f'# Pareto rule: sort by summary/eval/l0, keep cumulative-min inference/{cfg.metrics_shard}/metrics.json["{cfg.metric_key}"] per bucket.'
    )
    print("SAE_FRONTIER_RUN_IDS = {")
    for bucket in BUCKET_ORDER:
        print(f'    "{bucket}": [')
        for point in frontier_by_bucket.get(bucket, []):
            print(
                f'        "{point.run_id}",'
                f"  # l0={point.l0:.4f}, {cfg.metric_key}={point.metric:.6f}"
            )
        print("    ],")
    print("}")


@beartype.beartype
def main(cfg: Config) -> int:
    runs = make_target_runs(cfg)
    points = make_points(runs, cfg)

    points_by_bucket: dict[str, list[RunPoint]] = {}
    for point in points:
        if point.bucket not in BUCKET_ORDER:
            continue
        points_by_bucket.setdefault(point.bucket, []).append(point)

    frontier_by_bucket = {
        bucket: make_frontier(points_by_bucket.get(bucket, []))
        for bucket in BUCKET_ORDER
    }
    print_python(frontier_by_bucket, cfg)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(tyro.cli(Config)))
