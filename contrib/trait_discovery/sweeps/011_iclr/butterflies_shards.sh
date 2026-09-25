#!/bin/sh

uv run launch.py shards \
    --shards-root /fs/scratch/PAS2136/jbeattie/iclr2026/saev/shards/ \
    --family dinov3 \
    --ckpt /fs/scratch/PAS2136/jbeattie/models/encoders/dinov3/dinov3_vitl16_pretrain_lvd1689m-8aa4cbdd.pth \
    --batch-size 128 \
    --n-workers 1 \
    --layers -1 \
    --content-tokens-per-example 256 \
    data:img-seg-folder --data.root /fs/ess/PAS2136/jbeattie/datasets/cambridge-segfolder-v1.6 