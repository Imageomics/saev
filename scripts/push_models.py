repo_url = "https://github.com/Imageomics/saev"
docs_url = "https://imageomics.github.io/saev"


def main(
    hf_token: str,
    folder: str = "checkpoints/public/usvhngx4",
    repo: str = "osunlp/SAE_CLIP_24K_ViT-B-16_IN1K",
):
    import huggingface_hub as hfhub

    hfapi = hfhub.HfApi(token=hf_token)

    user, name = repo.split("/")

    hfapi.upload_folder(folder_path=folder, repo_id=repo, repo_type="model")
    hfapi.upload_file(
        path_or_fileobj=f"docs/assets/modelcards/{name}.md",
        path_in_repo="README.md",
        repo_id=repo,
        repo_type="model",
    )


if __name__ == "__main__":
    import tyro

    tyro.cli(main)
