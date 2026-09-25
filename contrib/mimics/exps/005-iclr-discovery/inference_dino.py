"""Inference for Pareto-optimal 16K BioCLIP SAEs on Cambridge butterflies (256p, v1.6)."""

def make_cfgs():
    import os.path

    run_root = "/fs/ess/PAS2136/jbeattie/saev/runs"
    shards_384 = "/fs/scratch/PAS2136/jbeattie/saev/shards/93a3db75"

    # Pareto-optimal run IDs from notebook.py, keyed by (layer, d_sae).
    run_ids = {
        (21, 16384): ['vnycpqlu', 'nw11ywf5', '6se2d0jo', '25ma6cta'],
        (23, 16384): ['3rbr8lbq', 'mblk8qj9', 'ap6fx1xz', '9la0oibn']
    }

    cfgs = []
    for (layer, _), ids in run_ids.items():
        for run_id in ids:
            cfgs.append({
                "run": os.path.join(run_root, run_id),
                "data": {"shards": shards_384, "layer": layer},
            })
    return cfgs
