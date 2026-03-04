#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

langs=(en zh fr)
sections=(about research awards publications contact)
errors=0

echo "[check] validating content markdown files"
for lang in "${langs[@]}"; do
  for section in "${sections[@]}"; do
    file="content/${lang}/${section}.md"
    if [[ ! -f "$file" ]]; then
      echo "[error] missing file: $file"
      errors=$((errors + 1))
      continue
    fi
    if [[ ! -s "$file" ]]; then
      echo "[error] empty file: $file"
      errors=$((errors + 1))
    fi
    if ! rg -q '^##\s+' "$file"; then
      echo "[error] missing section heading (## ...) in: $file"
      errors=$((errors + 1))
    fi

    while IFS= read -r src; do
      path="${src#src=\"}"
      path="${path%\"}"
      if [[ "$path" =~ ^https?:// ]]; then
        continue
      fi
      if [[ ! -f "$path" ]]; then
        echo "[error] broken image path in $file -> $path"
        errors=$((errors + 1))
      fi
    done < <(rg -o 'src="[^"]+"' "$file" || true)
  done
done

if [[ "$errors" -gt 0 ]]; then
  echo "[fail] validation failed with $errors issue(s)."
  exit 1
fi

echo "[ok] content validation passed."
