docs: lint
    rm -rf docs/api
    mkdir -p docs/api
    -yek src/saev README.md AGENTS.md > docs/api/llms.txt
    uv run mkdocs build --config-file docs/mkdocs.yml

test:
    uv run pytest -m "not slow and not integration" tests

test-fast:
    uv run pytest -n 4 -m "not slow and not integration" tests

test-slow:
    uv run pytest -m "slow and not integration" tests

test-cov:
    uv run pytest -n 4 -m "not slow and not integration" tests --cov src/saev --cov-report term --cov-report html --cov-report json --json-report --json-report-file pytest.json

test-integration +ARGS:
    uv run pytest -m "integration" tests {{ ARGS }}

test-report: test-cov
    uv run coverage-badge -o docs/assets/coverage.svg -f
    uv run python scripts/regressions.py

check: lint test

check-all: lint test test-slow

lint: fmt
    find src/ scripts/ contrib/ -type f -name '*.py' | grep -v "notebooks" | grep -v "interactive" | xargs uvx ruff check --fix

fmt:
    uvx ruff format --preview .
    -find src/ -type f -name '*.elm' | xargs elm-format --yes

clean:
    rm -f .coverage
    rm -f docs/assets/coverage.svg
    rm -f coverage.json
    rm -f pytest.json
    rm -rf .hypothesis
    uv run python -c 'import datasets; print(datasets.load_dataset("ILSVRC/imagenet-1k").cleanup_cache_files())'

build-semseg: fmt
    cd web && elm make src/Semseg.elm --output apps/semseg/dist/app.js --optimize
    cd web && tailwindcss --input apps/semseg/main.css --output apps/semseg/dist/main.css --minify

build-classification: fmt
    cd web && elm make src/Classification.elm --output apps/classification/dist/app.js --optimize
    cd web && tailwindcss --input apps/classification/main.css --output apps/classification/dist/main.css --minify

build-comparison: fmt
    cd web && elm make src/Comparison.elm --output apps/comparison/dist/app.js --optimize
    cd web && tailwindcss --input apps/comparison/main.css --output apps/comparison/dist/main.css

export-demo:
    uv run marimo export html examples/inference.py --force --output /dev/null
    uv run python scripts/export_notebook.py
    uv run jupyter nbconvert --to notebook --execute examples/inference.ipynb --inplace

deploy: build-classification build-semseg
    uv run python scripts/deploy.py
