# ECCV 2026 Experiment Plan

This document is the long-term execution plan for camera-ready experiments in `eccv2026/main.tex`.

## Current status

- `TopK` row is already in `main.tex` (run `s3pqewz1`).
- `Semi-NMF` row is already in `main.tex` (run `rv1wfbws`).
- `PE-core` row is still pending (no runs yet).

## Primary TODO sequence

- [x] Record PE-core activations on ImageNet-1K train/val and ADE20K train/val.
  - Deliverables:
    - IN1K train shard hash.
    - IN1K val shard hash.
    - ADE20K train shard hash.
    - ADE20K val shard hash.
  - Commands (run once per split):
    ```sh
    uv run python launch.py shards \
      --family pe-core \
      --ckpt vit_pe_core_large_patch14_336.fb \
      --layers 13 15 17 19 21 23 \
      --d-model 1024 \
      --content-tokens-per-example 576 \
      --cls-token \
      --batch-size 384 \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 24 \
      data:imagenet --data.split train
    ```
    ```sh
    uv run python launch.py shards \
      --family pe-core \
      --ckpt vit_pe_core_large_patch14_336.fb \
      --layers 13 15 17 19 21 23 \
      --d-model 1024 \
      --content-tokens-per-example 576 \
      --cls-token \
      --batch-size 256 \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 24 \
      data:imagenet --data.split validation
    ```
    ```sh
    uv run python launch.py shards \
      --family pe-core \
      --ckpt vit_pe_core_large_patch14_336.fb \
      --layers 13 15 17 19 21 23 \
      --d-model 1024 \
      --content-tokens-per-example 576 \
      --cls-token \
      --batch-size 256 \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 24 \
      data:img-seg-folder --data.root /fs/ess/PAS2136/samuelstevens/datasets/ADEChallengeData2016 --data.split training --data.labels-csv labels.csv --data.bg-label 0
    ```
    ```sh
    uv run python launch.py shards \
      --family pe-core \
      --ckpt vit_pe_core_large_patch14_336.fb \
      --layers 13 15 17 19 21 23 \
      --d-model 1024 \
      --content-tokens-per-example 576 \
      --cls-token \
      --batch-size 256 \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 24 \
      data:img-seg-folder --data.root /fs/ess/PAS2136/samuelstevens/datasets/ADEChallengeData2016 --data.split validation --data.labels-csv labels.csv --data.bg-label 0
    ```
  - Validation checks:
    - `metadata.json` has `family: "pe-core"`.
    - `d_model == 1024`.
    - `content_tokens_per_example == 576` (if this differs, update downstream sweep configs).

- [x] Create PE-core training sweep and launch TopK SAE training on IN1K activations.
  - Implementation:
    - Copy `contrib/trait_discovery/sweeps/008_pe/train.py` to `contrib/trait_discovery/sweeps/009_pe_core/train.py`.
    - Replace shard hashes with PE-core IN1K train/val hashes.
    - Keep initial grid aligned with 008:
      - layers: `{21, 23}`
      - k: `{16, 32, 64, 128, 256}`
      - lr: `{1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 3e-2}`
  - Command:
    ```sh
    uv run python launch.py train \
      --sweep contrib/trait_discovery/sweeps/009_pe_core/train.py \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 12 \
      --mem-gb 128 \
      --max-parallel 3 \
      sae.activation:top-k
    ```
  - Deliverables:
    - Candidate PE-core run IDs (Pareto/frontier).
    - Short list of run IDs to evaluate on ADE20K.

- [x] Create PE-core inference sweep and run SAE inference on ADE20K train/val.
  - Implementation:
    - Copy `contrib/trait_discovery/sweeps/008_pe/inference.py` to `contrib/trait_discovery/sweeps/009_pe_core/inference.py`.
    - Swap shard hashes and run IDs.
  - Command:
    ```sh
    uv run python launch.py inference \
      --sweep contrib/trait_discovery/sweeps/009_pe_core/inference.py \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 4 \
      --mem-gb 80
    ```
  - Deliverables:
    - `inference/<ade20k_train_hash>/` and `inference/<ade20k_val_hash>/` for all selected runs.
    - `metrics.json` exists for both splits per selected run.

- [x] Create PE-core `probe1d` and `metrics` sweeps and run them.
  - Implementation:
    - Create `contrib/trait_discovery/sweeps/009_pe_core/probe1d.py` using existing `00X` experiment probe sweeps as templates.
    - Create `contrib/trait_discovery/sweeps/009_pe_core/probe1d_metrics.py` using existing `00X` experiment metrics sweeps as templates.
    - Swap shard hashes and run IDs.
  - Commands:
    ```sh
    uv run python contrib/trait_discovery/scripts/launch.py probe1d \
      --sweep contrib/trait_discovery/sweeps/009_pe_core/probe1d.py \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 4 \
      --mem-gb 80 \
      --device cuda
    ```
    ```sh
    uv run python contrib/trait_discovery/scripts/launch.py metrics \
      --sweep contrib/trait_discovery/sweeps/009_pe_core/probe1d_metrics.py \
      --slurm-acct PAS2136 \
      --slurm-partition nextgen \
      --n-hours 6 \
      --mem-gb 320
    ```
  - Deliverables:
    - `probe1d_metrics.npz` on ADE20K val for selected runs.
    - Table-ready metrics: NMSE, L0, Probe R, mAP, Purity@16, Cov@0.3.

- [x] Choose final PE-core row and update `main.tex`.
  - Selection rule:
    - Match current policy: select by best probe loss on ADE20K train, report ADE20K val metrics.
  - Paper updates:
    - Replace `PE-core (pending)` row in `main.tex` with numeric values.
    - Add run ID comment on the PE-core row.
    - Update nearby text to reflect PE-core outcome.

## Reproducibility checklist

- [x] Fill PE-core shard hashes.
  - IN1K train: `6d03937c`
  - IN1K val: `a7f78fe3`
  - ADE20K train: `fa2b7ff0`
  - ADE20K val: `80219cbf`

- [ ] Fill PE-core selected SAE run IDs.
  - Layer 21 candidates: `6ed9ojrt`, `ang7atm3`, `ogpjtuij`, `xq1zfqh1`, `9u9ny8nm`
  - Layer 23 candidates: `h4gy7fke`, `ywydn3z5`, `omk5qhxf`, `f3a9b41q`, `r69kzt74`
  - Final row run ID: `xq1zfqh1` (L21, k=128, best train probe loss 0.0239). Pending: k=256 runs on quad queue (3829881, 3829882).

## Secondary TODOs (after PE-core)

- [ ] Run seed stability for best DINOv3 TopK config.
  - Start with 3 seeds, increase if variance is high.
  - Repeat inference -> probe1d -> metrics on ADE20K.
  - Report mean +/- std for Probe R, mAP, Purity@16, Cov@0.3.

- [ ] Run seed stability for best PE-core config.
  - Start with 3 seeds, increase if variance is high.
  - Repeat inference -> probe1d -> metrics on ADE20K.
  - Report mean +/- std for Probe R, mAP, Purity@16, Cov@0.3.

- [ ] Optional: add one additional backbone row only if it changes the story.
  - Keep as low priority unless PE-core results are weak or inconclusive.

## Camera-ready exit criteria

- [x] ADE20K table in `main.tex` has a final numeric PE-core row with run ID comment.
- [ ] Every row in that table is reproducible from run IDs and artifact paths.
- [ ] No `pending` placeholders remain in main text.
