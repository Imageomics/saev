#!/usr/bin/env bash

uv run launch.py train \
    --sweep ~/sae-trait-discovery/saev/contrib/mimics/exps/002-wider-saes/train_16k_dino.py \
    --max-parallel 4 \
    sae.activation:batch-top-k