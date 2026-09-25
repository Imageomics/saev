#!/usr/bin/env bash

uv run launch.py shards \
    --family dinov3 \
    --ckpt /fs/scratch/PAS2136/jbeattie/models/encoders/dinov3/dinov3_vitl16_pretrain_lvd1689m-8aa4cbdd.pth \
    --shards-root /fs/scratch/PAS2136/jbeattie/saev/shards/ \
    --batch-size 128 \
    --n-workers 1 \
    --d-model 1024 \
    --layers 19 21 23 \
    --content-tokens-per-example 384 \
    --max-tokens-per-shard 1200000 \
    data:img-seg-folder  --data.root /fs/ess/PAS2136/jbeattie/datasets/cambridge-segfolder-v1.6
