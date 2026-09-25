"""Scoring sweep for Pareto-optimal 16K/32K SAEs on Cambridge butterflies (384p, v1.6)."""

def make_cfgs() -> list[dict]:
    # Pareto-optimal run IDs from notebook.py, keyed by (layer, d_sae).
    run_ids = [
        # Layer 21, k=16
        'vnycpqlu', 
        # Layer 21, k=32
        'nw11ywf5', 
        # Layer 21, k=64
        '6se2d0jo', 
        # Layer 21, k=128
        '25ma6cta', 
        # Layer 23, k=16
        '3rbr8lbq', 
        # Layer 23, k=32
        'mblk8qj9', 
        # Layer 23, k=64
        'ap6fx1xz', 
        # Layer 23, k=128
        '9la0oibn'
    ]

    return [{"run_ids": run_ids, "run_root_dpath": "/fs/ess/PAS2136/jbeattie/saev/runs", "shards_dpath": "/fs/scratch/PAS2136/jbeattie/saev/shards/93a3db75"}]
