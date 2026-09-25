"""Baseline classifier sweep for BioCLIP2.5 ViT-H/14 on Cambridge butterflies (256p, v1.6)."""


def make_cfgs() -> list[dict]:
    return [
        {
            "shards_dpath": "/fs/scratch/PAS2136/jbeattie/saev/shards/2e66437c",
        }
    ]
