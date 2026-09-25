"""Baseline classifier sweep for DINOv3 ViT-L/16 on Cambridge butterflies (384p, v1.6).

The DINOv3 activation shards for the Cambridge dataset were cleaned from
/fs/scratch, so shards_dpath below currently has no recorded activations.
Regenerate them first with `launch.py shards` (family=dinov3, layers=[-2],
dataset cambridge-segfolder-v1.6), then point shards_dpath at the new hash.
"""


def make_cfgs() -> list[dict]:
    return [
        {
            "shards_dpath": "/fs/scratch/PAS2136/jbeattie/saev/shards/a1da4c41",
        }
    ]
