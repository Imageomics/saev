# ECCV TODO

## Decisions Locked

- Skip `PE-spatial` and use `PE-core` terminology throughout.
- Canonical naming in text/tables: `Perception Encoder ViT-L/14 336`.
- Do not spend time on author block changes for now.
- Keep an eye on inline `\sam{...}` notes and remove/resolve before submission.

## P0: Blocking Submission

- [x] Fill SemiNMF row in tab:ade20k.
- [x] Fill FishVista row in tab:fishvista.
- [ ] Resolve remaining `\gpt{}` markers (line 798: verify fishvista figure panels; line 807: fishvista claim strength).
- [x] Fix stale intro percentage: reframed as SAE 26.4% vs baseline 7.9% coverage.

## P1: Addresses Specific Reviewer Concerns

- [ ] Add one "novel discovery" example: show top SAE latents that don't match any labeled ADE20K/FishVista class but are stable across images. Quantify that they predict some independent attribute. (Addresses ALL reviewers' core critique that evaluation is only rediscovery.)
- [ ] Add spurious feature discussion/example: show a case where an SAE feature is confidently wrong or semantically incoherent, discuss how a practitioner would identify it. (Addresses Ub5E #4, JJQC #1.)
- [ ] SAE seed stability: even 3-5 seeds with mean/std on key metrics would address JJQC #3. Full 30-seed plan in cvpr-rebuttal.md. JJQC said this "would likely be sufficient to change my rating upward."

## P2: Writing and Consistency

- [x] Update conclusion to mention SemiNMF alongside k-means & PCA.
- [x] Matryoshka hierarchy claim: moved to footnote, explicitly marked anecdotal. (4udU C4.)
- [x] Layer comparison: added appendix with Probe R, Purity, Coverage figures + cross-reference from main text. (Ub5E minor #1.)
- [x] fig:ade20k-examples: now shows k-means, PCA, SemiNMF, SAE (all baselines). No stale Matryoshka panel.

## P3: Nice to Have

- [ ] Optional: add compact "backbone context" table (reported IN1K/ADE20K numbers from original papers, clearly marked not directly comparable).
- [ ] Optional: add backbone comparison figure if sweep-quality PE curves become available.

## Table Format

All metric tables should use 8-column format:
- 2 cols: SAE training dataset val NMSE/L0 (e.g., IN1K val)
- 2 cols: downstream dataset val NMSE/L0 (e.g., ADE20K val; measures transferability)
- 4 cols: downstream probe metrics (Probe R, mAP, Purity@k, Cov@tau)

## Keywords

- Candidate set:
  - `sparse autoencoders`
  - `foundation models`
  - `scientific discovery`
  - `concept discovery`
  - `representation interpretability`
