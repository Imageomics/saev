# JJQC

This work does provide a step toward validating the SAE paradigm in fully unsupervised contexts, which is a useful aim and an important target for future work. Considering the paper itself and the subsequent review, rebuttal, and discussion, my final recommendation remains a rating of 3 (borderline reject). As noted by the area chair, papers with significant outstanding concerns remaining after the rebuttal should be rejected, if the updates that would require additional reviewer oversight. Despite the authors' admirable effort to provide a substantive rebuttal, there are simply too many outstanding analyses (especially control analyses / method comparison) which I would want to see and vet before substantially updating my view of the paper.

I think this is a fairly borderline case, and I am not quite as steeped in this particular subfield as perhaps other reviewers are, so I defer to the ACs in their judgment of the work overall. I could see valid arguments for accepting the paper if the concerns raised by reviewers were deemed to be marginal and/or if the ACs feel that the rebuttal was of sufficient merit to raise the paper up to the threshold of CVPR acceptance.


# Ub5E

The authors seriously engage several points of criticism from each of the reviewers in their rebuttal, but most of the major concerns stand. We therefore keep our score. In particular, our remaining concerns are:

(1) The FishVista experiment is framed as a controlled rediscovery test of known anatomy, and the conclusion explicitly cautions that the contribution is validating SAEs as an instrument, not delivering novel biological discoveries. Thus, “open-ended” is more a promise than an empirically demonstrated outcome. The authors acknowledge this in their rebuttal. In case they were to expand the paper, including at least one unlabeled “candidate discovery” analysis would add value (e.g. show top latents that do not match any of the labeled parts but are stable and quantify that they predict some independent attribute).

(2) Discovery remains validated through supervised probes. Although SAE training is unsupervised, semantic validation relies on post-hoc supervised probes using human-defined labels. This means that “open-ended discovery” is still evaluated through predefined semantic vocabularies. While this is reasonable for controlled evaluation, it limits the extent to which the pipeline is truly open-ended in practice. The authors did not respond to this point.

(3) While k-means and PCA are reasonable reference points, they are relatively weak baselines for the paper’s stated goal. Other well-established unsupervised or dictionary-learning methods (e.g., classical sparse coding, NMF, ICA, sparse PCA, non-sparse autoencoders) are not considered. Including at least one or two sparse decomposition or dictionary-learning baselines would make the empirical evaluation much more convincing. The authors indicated that they are planning to conduct additional experiments, but these results are not available for review.

(4) The paper briefly notes reduced performance for rare concepts with limited analyses of failure modes and negative results (e.g., spurious features). Such analysis would be especially valuable given the scientific discovery framing. The authors do not substantively address this concern, though they refer to it in the rebuttal.

(5) The paper implicitly treats SAE features as interpretable units, but does not engage with known limitations of SAE-based interpretability. Because the paper positions SAEs as tools for scientific discovery, a more explicit discussion of these limitations would be important for preventing overinterpretation of results. The authors are conducting additional experiments for the camera-ready version, but their results are not yet available for review.


# 4udU

I thank the authors for their detailed response which answers many of the questions raised in the reviews. I particularly appreciate the efforts the authors have made to engage with concerns raised, including repositioning the contributions, evaluations with TopK SAEs that further help performance, and acknowledging the need to compare against baselines like NMF.

I believe this has the potential to be a good paper for CVPR. However, my biggest concern right now (that is also shared by both of the other reviewers, also in our reviewer-AC discussion) is the lack of available comparisons against baselines like NMF. I appreciate that the authors have been making efforts to run these experiments and understand that they haven't been able to provide them yet due to compute constraints. But unfortunately, without these experiments it is very difficult to evaluate the contributions of this work. NMF has been shown to be effective for exactly the task this paper is aiming for (e.g. in CRAFT), so comparing against it seems critical to establish if SAEs provide any meaningful gains. Given this, I would like to maintain my score of weak reject.

For a future submission (or camera ready), I would also encourage having (1) more models beyond DINOv3, and (2) more analyses, e.g. related to Weakness C3 in my review. I also agree with the concerns about long tail concept discovery and assumption of axis-alignedness raised by JJQC and Ub5E, and it would be good to acknowledge this in the text in the revision.