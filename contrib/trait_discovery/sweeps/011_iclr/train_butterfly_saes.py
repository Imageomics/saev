def make_cfgs() -> list[dict]:
    batch_size: int = 1024 * 16
    n_train = 100_000_000
    
    shards_dpath = "/fs/scratch/PAS2136/jbeattie/iclr2026/saev/shards/45090eb7/"

    version = "v1.6"

    cfgs = []
    for k in [64]:
        for lr in [3e-4, 1e-3, 3e-3, 1e-2, 3e-2, 1e-1]:
            cfgs.append({
                "tags": ["cambridge-256p-v1"],
                "slurm_acct": "PAS2136",
                "slurm_partition": "nextgen",
                "n_hours": 12.0,
                "lr": lr,
                "n_lr_warmup": 500,
                "n_sparsity_warmup": n_train // batch_size,
                "runs_root": "/fs/ess/PAS2136/samuelstevens/saev/runs",
                "n_train": n_train,
                "sae": {
                    "d_model": 1024,
                    "d_sae": 1024 * 16,
                    "normalize_w_dec": True,
                    "remove_parallel_grads": True,
                    "activation": {"top_k": k},
                    "reinit_blend": 0.8,
                },
                "train_data": {
                    "layer": -1,
                    "shards": shards_dpath,
                    "min_buffer_fill": 0.2,
                    "ignore_labels": [0],
                    "use_tmpdir": True,
                },
                "val_data": {
                    "layer": -1,
                    "shards": shards_dpath,
                    "ignore_labels": [0],
                    "use_tmpdir": True,
                },
            })
    return cfgs
