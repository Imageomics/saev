#!/bin/sh
# Validate .zenodo.json with the same pinned zenodraft as CI.

set -eu

workflow=".github/workflows/validate-zenodo.yaml"

# e.g. "zenodraft@0.14.1" from the `npm install zenodraft@0.14.1` line.
spec=$(grep -oE 'zenodraft@[0-9]+\.[0-9]+\.[0-9]+' "$workflow" | head -n 1)
if [ -z "$spec" ]; then
    echo "could not read pinned zenodraft version from $workflow" >&2
    exit 1
fi

if command -v npx >/dev/null 2>&1; then
    exec npx "$spec" metadata validate .zenodo.json
elif command -v bunx >/dev/null 2>&1; then
    exec bunx "$spec" metadata validate .zenodo.json
elif command -v dx >/dev/null 2>&1; then
    exec dx "$spec" metadata validate .zenodo.json
elif command -v deno >/dev/null 2>&1; then
    exec deno run --allow-read "npm:$spec" metadata validate .zenodo.json
else
    echo "no JS runner found (tried: npx bunx dx deno)" >&2
    exit 1
fi
