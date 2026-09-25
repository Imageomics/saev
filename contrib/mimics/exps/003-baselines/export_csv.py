"""Export baseline classifier stats to a readable CSV.

Reads every baseline_cls_*.parquet from DEFAULT_OUT_DPATH and writes a single
CSV with one row per (shard, task) and a short model label.
"""

import pathlib

import beartype
import polars as pl
from mimics.baselines import DEFAULT_OUT_DPATH

MODEL_LABELS = {
    "clip": "bioclip2.5-vith14",
    "dinov3": "dinov3-vitl16",
}


@beartype.beartype
def get_model_label(family: str) -> str:
    """Short human-readable model name for a family."""
    return MODEL_LABELS.get(family, family)


@beartype.beartype
def main(out_fpath: pathlib.Path) -> None:
    dfs = []
    for pq_fpath in sorted(DEFAULT_OUT_DPATH.glob("baseline_cls_*.parquet")):
        df = pl.read_parquet(pq_fpath).with_columns(
            pl.col("family").map_elements(get_model_label).alias("model")
        )
        dfs.append(df)
    assert dfs, f"No baseline parquets found in '{DEFAULT_OUT_DPATH}'."
    cols = [
        "model",
        "shard_id",
        "task_name",
        "n_erato",
        "n_melpomene",
        "bal_acc_mean",
        "bal_acc_std",
        "auc_mean",
        "auc_std",
    ]
    padded = []
    for df in dfs:
        df = df.select(c for c in cols if c in df.columns)
        for c in cols:
            if c not in df.columns:
                df = df.with_columns(pl.lit(None, dtype=pl.Float64).alias(c))
        padded.append(df)
    result = pl.concat(padded).select(cols)
    result.write_csv(out_fpath)
    print(f"Wrote {result.height} rows to '{out_fpath}'.")


if __name__ == "__main__":
    main(pathlib.Path("baselines.csv"))
