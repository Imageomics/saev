import marimo

__generated_with = "0.23.11"
app = marimo.App(width="full")


@app.cell
def _():
    import pathlib
    import typing as tp

    import marimo as mo
    import numpy as np
    import polars as pl
    import scipy.sparse
    from PIL import Image
    from tdiscovery.classification import apply_grouping, load_image_labels
    from tdiscovery.visuals import make_seg

    import saev.data
    import saev.data.datasets
    import saev.data.models
    import saev.viz

    from sklearn import linear_model
    from sklearn.metrics import mean_squared_error, r2_score

    return (
        Image,
        apply_grouping,
        linear_model,
        load_image_labels,
        make_seg,
        mean_squared_error,
        mo,
        np,
        pathlib,
        pl,
        r2_score,
        saev,
        scipy,
        tp,
    )


@app.cell
def _(pathlib):
    run_root_dpath = pathlib.Path("/fs/ess/PAS2136/jbeattie/saev/runs")
    shards_dpath = pathlib.Path(
        "/fs/scratch/PAS2136/jbeattie/saev/shards/93a3db75/"
    )

    shard_id = "93a3db75"

    all_run_ids = [
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

    run_metadata = {
        # Layer 21, k=16
        'vnycpqlu': {'layer': 21, 'k': 16},
        # Layer 21, k=32
        'nw11ywf5': {'layer': 21, 'k': 32},
        # Layer 21, k=64
        '6se2d0jo': {'layer': 21, 'k': 64},
        # Layer 21, k=128
        '25ma6cta': {'layer': 21, 'k': 128},
        # Layer 23, k=16
        '3rbr8lbq': {'layer': 23, 'k': 16},
        # Layer 23, k=32
        'mblk8qj9': {'layer': 23, 'k': 32},
        # Layer 23, k=64
        'ap6fx1xz': {'layer': 23, 'k': 64},
        # Layer 23, k=128
        '9la0oibn': {'layer': 23, 'k': 128},
    }
    return all_run_ids, run_metadata, run_root_dpath, shard_id, shards_dpath


@app.cell
def _(mo):
    mo.md("""
    # 002-wider-saes: Feature Viewer

    Browse SAE features scored for mimic pair discrimination. Select a run and task, then pick features by selectivity to view per-class activation grids.
    """)
    return


@app.cell
def _(all_run_ids, mo, pl, run_root_dpath, shard_id):
    _dfs = []
    for _rid in all_run_ids:
        _pq = (
            run_root_dpath / _rid / "inference" / shard_id / "cambridge-mimics.parquet"
        )
        if _pq.exists():
            _dfs.append(pl.read_parquet(_pq))
    scores_df = pl.concat(_dfs) if _dfs else pl.DataFrame()
    mo.stop(scores_df.height == 0, mo.md("No score parquets found."))

    scores_df = scores_df.with_columns(
        pl.col("auroc").sub(0.5).abs().mul(2).clip(0, 1).alias("selectivity"),
        (pl.col("support_erato") - pl.col("support_melpomene"))
        .abs()
        .alias("support_diff"),
    )
    return (scores_df,)


@app.cell
def _(mo, scores_df):
    _tasks = sorted(scores_df.get_column("task").unique().to_list())
    task_dropdown = mo.ui.dropdown(
        _tasks, value=_tasks[0], label="Task", searchable=True
    )
    n_per_class_slider = mo.ui.slider(3, 20, value=6, label="Images per class")
    show_seg_toggle = mo.ui.switch(value=False, label="Show seg masks")
    mo.hstack(
        [task_dropdown, n_per_class_slider, show_seg_toggle],
        justify="start",
    )
    return n_per_class_slider, show_seg_toggle, task_dropdown


@app.cell
def _(mo, scores_df):
    _runs = scores_df.get_column("run_id").unique().to_list()
    run_dropdown = mo.ui.dropdown(
        _runs + ["all", "layer_22", "layer_24"], value=_runs[0], label="Run", searchable=True
    )

    layer_22 = ['vnycpqlu', 'nw11ywf5', '6se2d0jo', '25ma6cta']
    layer_24 = ['3rbr8lbq', 'mblk8qj9', 'ap6fx1xz', '9la0oibn']
    run_dropdown
    return layer_22, layer_24, run_dropdown


@app.cell
def _(layer_22, layer_24, mo, pl, run_dropdown, scores_df, task_dropdown):
    if run_dropdown.value == "all":
        filtered_df = scores_df.filter(pl.col("task") == task_dropdown.value).sort(
            "selectivity", descending=True
        )
    elif run_dropdown.value == "layer_22":
        filtered_df = scores_df.filter(pl.col("run_id").is_in(layer_22)).filter(pl.col("task") == task_dropdown.value).sort(
            "selectivity", descending=True
        )
    elif run_dropdown.value == "layer_24":
        filtered_df = scores_df.filter(pl.col("run_id").is_in(layer_24)).filter(pl.col("task") == task_dropdown.value).sort(
            "selectivity", descending=True
        )
    else:
        filtered_df = scores_df.filter(pl.col("run_id") == run_dropdown.value).filter(pl.col("task") == task_dropdown.value).sort(
            "selectivity", descending=True
        )
    mo.stop(filtered_df.height == 0, mo.md("No features for this task."))

    feature_table = mo.ui.table(
        filtered_df
        .select(
            "run_id",
            "feature_id",
            "selectivity",
            "auroc",
            "support_diff",
            "support_erato",
            "support_melpomene",
            "mean_act_erato",
            "mean_act_melpomene",
            "w1_act",
            "w1_firing"
        )
        .to_pandas(),
        selection="single",
        label="Top features by selectivity",
    )
    feature_table
    return feature_table, filtered_df


@app.cell
def _(filtered_df):
    random_sample_df = filtered_df
    random_sample_df["w1_act"].max()
    return (random_sample_df,)


@app.cell
def _(
    filtered_df,
    linear_model,
    mean_squared_error,
    r2_score,
    random_sample_df,
):
    import matplotlib.pyplot as plt
    w1_dist_fig = plt.figure()
    plt.yscale("log")
    plt.title("W1 distance distribution")
    plt.xlabel("W1")
    plt.ylabel("count")
    plt.hist(filtered_df["w1_act"])



    _regr = linear_model.LinearRegression()
    _regr.fit(random_sample_df["w1_act"].reshape((-1, 1)), random_sample_df["selectivity"].reshape((-1, 1)))
    w1_y = _regr.predict(random_sample_df["w1_act"].to_numpy().reshape((-1, 1)))

    print("Coefficients: \n", _regr.coef_)
    print("Mean squared error: %.5f" % mean_squared_error(random_sample_df["selectivity"].reshape((-1, 1)), w1_y))
    print("Coefficient of determination: %.5f" % r2_score(random_sample_df["selectivity"].reshape((-1, 1)), w1_y))



    w1_selectivity_fig = plt.figure(figsize=(5, 5), dpi=1000)
    plt.scatter(x = random_sample_df["w1_act"], y = random_sample_df["selectivity"])

    plt.plot([random_sample_df["w1_act"].min(), random_sample_df["w1_act"].max()], [w1_y.min(), w1_y.max()], linestyle="--", color="red", linewidth=2)
    plt.xlabel("W1")
    plt.ylabel("Selectivity")
    plt.title("W1 vs Selectivity")

    #mo.hstack([w1_dist_fig, w1_selectivity_fig])
    w1_selectivity_fig
    return (plt,)


@app.cell
def _(
    all_run_ids,
    linear_model,
    mean_squared_error,
    np,
    pl,
    plt,
    r2_score,
    run_metadata,
    scores_df,
):


    k = 10
    fw = 3
    fh = 3
    figpad = 15

    tasks_of_interest = [
      "cyrbia_dorsal_vs_cythera_dorsal",
      #"cyrbia_ventral_vs_cythera_ventral",
      "lativitta_dorsal_vs_malleti_dorsal",
      #"lativitta_ventral_vs_malleti_ventral",
      "notabilis_dorsal_vs_plesseni_dorsal",
      #"notabilis_ventral_vs_plesseni_ventral",
      #"ssp.nov.P_dorsal_vs_malleti_dorsal",
      #"ssp.nov.P_ventral_vs_malleti_ventral",
    ]

    top_k_selectivity_dfs = {id: scores_df.filter(pl.col("run_id") == id).filter(pl.col("task").is_in(tasks_of_interest)).sort(by='selectivity', descending=True).group_by("task").head(k) for id in all_run_ids}
    top_k_w1_act_dfs = {id: scores_df.filter(pl.col("run_id") == id).filter(pl.col("task").is_in(tasks_of_interest)).sort(by='w1_act', descending=True).group_by('task').head(k) for id in all_run_ids}

    for id in all_run_ids:
        top_k_selectivity_dfs[id] = top_k_selectivity_dfs[id].with_columns(k = pl.lit(run_metadata[id]['k']), layer = pl.lit(run_metadata[id]['layer']))
        top_k_w1_act_dfs[id] = top_k_w1_act_dfs[id].with_columns(k = pl.lit(run_metadata[id]['k']), layer = pl.lit(run_metadata[id]['layer']))

    ### SELECTIVITY 
    top_k_select_fig_21 = plt.figure(dpi=1000, figsize=(fw, fh))
    plt.tight_layout()
    plt.title(f"Selectivity vs k in Layer 21 @ {k}", pad=figpad)
    plt.ylabel("Selectivity")
    plt.xlabel("k")
    plt.ylim(bottom=0.4, top=1)
    plt.xticks([16, 32, 64, 128])

    reg_x = []
    reg_y = []
    labels = []
    for id in all_run_ids:
        if int(top_k_selectivity_dfs[id]['layer'][0]) !=  21:
            continue
        reg_x.extend(list(top_k_selectivity_dfs[id]['k']))
        reg_y.extend(list(top_k_selectivity_dfs[id]['selectivity']))
        labels.extend(list(top_k_selectivity_dfs[id]['task']))
    plt.scatter(reg_x, reg_y, alpha = 0.8)

    regr = linear_model.LinearRegression()
    regr.fit(np.array(reg_x).reshape(-1, 1), np.array(reg_y).reshape(-1, 1))
    pred_y = regr.predict(np.array(reg_x).reshape(-1, 1))

    # The coefficients
    print("Coefficients: \n", regr.coef_)
    # The mean squared error
    print("Mean squared error: %.5f" % mean_squared_error(reg_y, pred_y))
    # The coefficient of determination: 1 is perfect prediction
    print("Coefficient of determination: %.5f" % r2_score(reg_y, pred_y))

    plt.plot(reg_x, pred_y, linestyle="--", linewidth=2)

    plt.savefig(f"./figures/selectivity_vs_k_21_at_{k}.png", bbox_inches="tight")

    top_k_select_fig_23 = plt.figure(dpi=1000, figsize=(fw, fh))
    plt.title(f"Selectivity vs k in Layer 23 @ {k}", pad=figpad)
    plt.ylabel("Selectivity")
    plt.xlabel("k")
    plt.ylim(bottom=0.4, top=1)
    plt.xticks([16, 32, 64, 128])

    reg_x = []
    reg_y = []
    for id in all_run_ids:
        if int(top_k_selectivity_dfs[id]['layer'][0]) !=  23:
            continue

        reg_x.extend(list(top_k_selectivity_dfs[id]['k']))
        reg_y.extend(list(top_k_selectivity_dfs[id]['selectivity']))

    plt.scatter(reg_x, reg_y, alpha = 0.8)

    regr = linear_model.LinearRegression()
    regr.fit(np.array(reg_x).reshape(-1, 1), np.array(reg_y).reshape(-1, 1))
    pred_y = regr.predict(np.array(reg_x).reshape(-1, 1))

    # The coefficients
    print("Coefficients: \n", regr.coef_)
    # The mean squared error
    print("Mean squared error: %.5f" % mean_squared_error(reg_y, pred_y))
    # The coefficient of determination: 1 is perfect prediction
    print("Coefficient of determination: %.5f" % r2_score(reg_y, pred_y))

    plt.plot(reg_x, pred_y, linestyle="--", linewidth=2)
    plt.savefig(f"./figures/selectivity_vs_k_23_at_{k}.png", bbox_inches="tight")


    ### W1 ACT

    top_k_w1_fig_21 = plt.figure(dpi=1000, figsize=(fw, fh))
    plt.title(f"W1 Distance vs k in Layer 21 @ {k}", pad=figpad)
    plt.ylabel("W1")
    plt.xlabel("k")
    plt.xticks([16, 32, 64, 128])

    reg_x = []
    reg_y = []
    for id in all_run_ids:
        if int(top_k_w1_act_dfs[id]['layer'][0]) !=  21:
            continue
        reg_x.extend(list(top_k_w1_act_dfs[id]['k']))
        reg_y.extend(list(top_k_w1_act_dfs[id]['w1_act']))
    plt.scatter(reg_x, reg_y, alpha = 0.8)

    regr = linear_model.LinearRegression()
    regr.fit(np.array(reg_x).reshape(-1, 1), np.array(reg_y).reshape(-1, 1))
    pred_y = regr.predict(np.array(reg_x).reshape(-1, 1))

    # The coefficients
    print("Coefficients: \n", regr.coef_)
    # The mean squared error
    print("Mean squared error: %.5f" % mean_squared_error(reg_y, pred_y))
    # The coefficient of determination: 1 is perfect prediction
    print("Coefficient of determination: %.5f" % r2_score(reg_y, pred_y))

    plt.plot(reg_x, pred_y, linestyle="--", linewidth=2)

    plt.savefig(f"./figures/w1_act_vs_k_21_at_{k}.png", bbox_inches="tight")

    top_k_w1_fig_23 = plt.figure(dpi=1000, figsize=(fw, fh))
    plt.title(f"W1 Distance vs k in Layer 23 @ {k}", pad=figpad)
    plt.ylabel("W1")
    plt.xlabel("k")
    plt.xticks([16, 32, 64, 128])

    reg_x = []
    reg_y = []
    for id in all_run_ids:
        if int(top_k_w1_act_dfs[id]['layer'][0]) !=  23:
            continue
        reg_x.extend(list(top_k_w1_act_dfs[id]['k']))
        reg_y.extend(list(top_k_w1_act_dfs[id]['w1_act']))
    plt.scatter(reg_x, reg_y, alpha = 0.8)

    regr = linear_model.LinearRegression()
    regr.fit(np.array(reg_x).reshape(-1, 1), np.array(reg_y).reshape(-1, 1))
    pred_y = regr.predict(np.array(reg_x).reshape(-1, 1))

    # The coefficients
    print("Coefficients: \n", regr.coef_)
    # The mean squared error
    print("Mean squared error: %.5f" % mean_squared_error(reg_y, pred_y))
    # The coefficient of determination: 1 is perfect prediction
    print("Coefficient of determination: %.5f" % r2_score(reg_y, pred_y))

    plt.plot(reg_x, pred_y, linestyle="--", linewidth=2)
    plt.savefig(f"./figures/w1_act_vs_k_23_at_{k}.png", bbox_inches="tight")

    #mo.vstack([mo.hstack([top_k_select_fig_21, top_k_select_fig_23]), mo.hstack([top_k_w1_fig_21, top_k_w1_fig_23]),])
    return


@app.cell
def _(feature_table, mo):
    _sel = feature_table.value
    mo.stop(
        _sel is None or len(_sel) == 0,
        mo.md("Select a feature from the table above."),
    )
    selected_run_id = str(_sel.iloc[0]["run_id"])
    selected_feature_id = int(_sel.iloc[0]["feature_id"])
    mo.md(f"Selected: run=`{selected_run_id}` feature=**{selected_feature_id}**")
    return selected_feature_id, selected_run_id


@app.cell
def _(
    apply_grouping,
    load_image_labels,
    mo,
    run_root_dpath,
    saev,
    scipy,
    selected_run_id,
    shard_id,
    shards_dpath,
    task_dropdown,
    tp,
):
    # Load render context: image dataset, labels, patch size.
    _md = saev.data.Metadata.load(shards_dpath)
    _model_cls = tp.cast(
        tp.Callable[[str], tp.Any], saev.data.models.load_model_cls(_md.family)
    )
    _vit = _model_cls(_md.ckpt)
    _resize_tr = _vit.make_resize(_md.ckpt, _md.content_tokens_per_example, scale=1.0)
    _data_cfg = tp.cast(saev.data.datasets.Config, _md.make_data_cfg())
    img_ds = saev.data.datasets.get_dataset(
        _data_cfg, data_transform=_resize_tr, mask_transform=_resize_tr
    )
    patch_size = int(_vit.patch_size)
    n_patches = _md.content_tokens_per_example
    pixel_agg = _md.pixel_agg
    bg_label = _data_cfg.bg_label

    _, _labels_by_col = load_image_labels(shards_dpath)
    sv_labels = _labels_by_col["subspecies_view"]
    n_images = len(sv_labels)

    from mimics import tasks as _tasks_mod

    _grouping = _tasks_mod.make_label_grouping(task_dropdown.value)
    _targets, _names, include_mask = apply_grouping(sv_labels, _grouping)
    _c2i = {name: i for i, name in enumerate(_names)}
    erato_i = _c2i["erato"]
    melp_i = _c2i["melpomene"]
    _inc_tgt = _targets[include_mask]
    erato_class_mask = _inc_tgt == erato_i
    melp_class_mask = _inc_tgt == melp_i

    # Load token_acts for selected run.
    _ta_fpath = (
        run_root_dpath / selected_run_id / "inference" / shard_id / "token_acts.npz"
    )
    msg = f"Missing token_acts: '{_ta_fpath}'."
    assert _ta_fpath.exists(), msg
    ta_csc = scipy.sparse.load_npz(str(_ta_fpath)).tocsc()
    tpi = ta_csc.shape[0] // n_images
    assert ta_csc.shape[0] == n_images * tpi

    mo.md(
        f"Loaded token_acts for `{selected_run_id}` (d_sae={ta_csc.shape[1]}, tpi={tpi}, patch_size={patch_size})."
    )
    return (
        bg_label,
        erato_class_mask,
        img_ds,
        include_mask,
        melp_class_mask,
        n_images,
        n_patches,
        patch_size,
        pixel_agg,
        sv_labels,
        ta_csc,
        tpi,
    )


@app.cell
def _(
    Image,
    bg_label,
    erato_class_mask,
    img_ds,
    include_mask,
    make_seg,
    melp_class_mask,
    mo,
    n_images,
    n_patches,
    n_per_class_slider,
    np,
    patch_size,
    pixel_agg,
    run_root_dpath,
    saev,
    selected_feature_id,
    selected_run_id,
    shard_id,
    show_seg_toggle,
    sv_labels,
    ta_csc,
    tpi,
):
    # Extract per-patch activations for this feature.
    _col = ta_csc[:, selected_feature_id].toarray().ravel()
    _by_image = _col.reshape(n_images, tpi)
    _max_acts = _by_image.max(axis=1)
    _upper = float(_by_image.max())

    _inc_acts = _by_image[include_mask]
    _inc_max = _max_acts[include_mask]
    inc_max_acts = _inc_max
    _inc_i = np.where(include_mask)[0]

    _n = n_per_class_slider.value
    _n_cols = 3

    import glasbey

    _palette = [
        tuple(rgb) for rgb in glasbey.create_palette(palette_size=256, as_hex=False)
    ]

    # Cache dir: runs/{run_id}/inference/{shard_id}/images/{feature_id}/
    _cache_dpath = (
        run_root_dpath
        / selected_run_id
        / "inference"
        / shard_id
        / "images"
        / str(selected_feature_id)
    )
    _cache_dpath.mkdir(parents=True, exist_ok=True)

    def _render_images(img_i, patches):
        """Render highlighted + seg images, caching to disk."""
        _sae_fpath = _cache_dpath / f"{img_i}_sae_img.png"
        _seg_fpath = _cache_dpath / f"{img_i}_seg.png"

        if _sae_fpath.exists() and _seg_fpath.exists():
            return Image.open(_sae_fpath), Image.open(_seg_fpath)

        _sample = img_ds[img_i]
        assert isinstance(_sample, dict) and "data" in _sample
        _img = _sample["data"]
        assert isinstance(_img, Image.Image)

        if _sae_fpath.exists():
            _sae = Image.open(_sae_fpath)
        else:
            _sae = saev.viz.add_highlights(_img, patches, patch_size, upper=_upper)
            _sae.save(_sae_fpath)

        _seg = None
        if _seg_fpath.exists():
            _seg = Image.open(_seg_fpath)
        else:
            _seg_raw = _sample.get("patch_labels", None)
            if _seg_raw is not None:
                _seg = make_seg(
                    _seg_raw, n_patches, patch_size, pixel_agg, bg_label, _palette
                )
                _seg.save(_seg_fpath)

        return _sae, _seg

    def _get_top_bot(class_mask):
        _cls_max = _inc_max[class_mask]
        _order = np.argsort(-_cls_max)
        _top_i = _order[:_n]
        _nonzero = _order[_cls_max[_order] > 0]
        _bot_i = _nonzero[-_n:] if len(_nonzero) >= _n else _nonzero
        return _top_i, _bot_i

    _e_top, _e_bot = _get_top_bot(erato_class_mask)
    _m_top, _m_bot = _get_top_bot(melp_class_mask)

    # Pre-render all images with a single progress bar.
    _render_jobs = []
    for _indices, _mask in [
        (_e_top, erato_class_mask),
        (_m_top, melp_class_mask),
        (_e_bot, erato_class_mask),
        (_m_bot, melp_class_mask),
    ]:
        _cls_acts = _inc_acts[_mask]
        _cls_global_i = _inc_i[_mask]
        for _idx in _indices:
            _img_i = int(_cls_global_i[_idx])
            _patches = _cls_acts[_idx].astype(np.float32)
            _render_jobs.append((_img_i, _patches))

    _rendered = {}
    for _img_i, _patches in mo.status.progress_bar(
        _render_jobs, title="Rendering images"
    ):
        if _img_i not in _rendered:
            _rendered[_img_i] = _render_images(_img_i, _patches)

    def _build_grid(indices, class_mask):
        """Build grid from pre-rendered images."""
        _cls_max = _inc_max[class_mask]
        _cls_global_i = _inc_i[class_mask]

        _imgs = []
        for _idx in indices:
            _img_i = int(_cls_global_i[_idx])
            _sae, _seg = _rendered[_img_i]
            _act_val = float(_cls_max[_idx])
            _sv = sv_labels[_img_i]
            _ssp, _view = _sv.rsplit("_", 1)
            _cells = [mo.image(_sae)]
            if show_seg_toggle.value and _seg is not None:
                _cells.append(mo.image(_seg))
            _cells.append(mo.md(f"{_ssp} ({_view}) | act={_act_val:.3f}"))
            _imgs.append(mo.vstack(_cells))

        _rows = []
        for _r in range(0, len(_imgs), _n_cols):
            _rows.append(mo.hstack(_imgs[_r : _r + _n_cols], justify="start"))
        return mo.vstack(_rows)

    mo.vstack([
        mo.md(f"## Feature {selected_feature_id} (upper={_upper:.3f})"),
        mo.md(f"### Erato Top {len(_e_top)}"),
        _build_grid(_e_top, erato_class_mask),
        mo.md(f"### Melpomene Top {len(_m_top)}"),
        _build_grid(_m_top, melp_class_mask),
        mo.md(f"### Erato Bottom {len(_e_bot)}"),
        _build_grid(_e_bot, erato_class_mask),
        mo.md(f"### Melpomene Bottom {len(_m_bot)}"),
        _build_grid(_m_bot, melp_class_mask),
    ])
    return (inc_max_acts,)


@app.cell
def _(
    erato_class_mask,
    inc_max_acts,
    melp_class_mask,
    plt,
    selected_feature_id,
):
    plt.figure(figsize=(3, 3), dpi=1000)
    #plt.yscale('log')
    plt.title(f"Feature {selected_feature_id} Max Activations")
    plt.xlabel("Activation Value")
    plt.ylabel("Count")
    plt.hist(inc_max_acts[melp_class_mask], alpha=0.6, label="Melpomene")
    plt.hist(inc_max_acts[erato_class_mask], alpha=0.6, label="Erato")

    plt.legend()
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
