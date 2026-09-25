#!/bin/sh

uv run launch.py shards \
    --shards-root /fs/scratch/PAS2136/jbeattie/iclr2026/saev/shards/ \
    --family dinov3 \
    --ckpt /fs/scratch/PAS2136/jbeattie/models/encoders/dinov3/dinov3_vitl16_pretrain_lvd1689m-8aa4cbdd.pth \
    --batch-size 128 \
    --n-workers 1 \
    --layers 13 15 17 19 21 23 \
    --content-tokens-per-example 196 \
    data:imagenet --data.split train