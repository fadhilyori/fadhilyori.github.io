#!/usr/bin/env bash
set -euo pipefail

TITLE="${1:-}"
TITLE_EN="${2:-}"

if [ -z "$TITLE" ]; then
    echo 'Usage: make new-post TITLE="Judul Post" [TITLE_EN="English Title"]'
    exit 1
fi

SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' \
    | sed 's/[^a-z0-9 ]//g' \
    | sed 's/ /-/g' \
    | sed 's/--*/-/g' \
    | sed 's/^-//;s/-$//')

if [ -z "$SLUG" ]; then
    echo "Error: could not generate slug from title '$TITLE'"
    exit 1
fi

DATE_PATH=$(date +%Y/%m/%d)

export POST_SLUG="$SLUG"
export POST_TITLE="$TITLE"

CONTENT_DIR="content/posts/${DATE_PATH}/${SLUG}"

hugo new --kind post "${CONTENT_DIR}/index.id.md"

if [ -n "$TITLE_EN" ]; then
    export POST_TITLE="$TITLE_EN"
fi

hugo new --kind post "${CONTENT_DIR}/index.en.md"

echo ""
echo "Created:"
echo "  ${CONTENT_DIR}/index.id.md"
echo "  ${CONTENT_DIR}/index.en.md"
