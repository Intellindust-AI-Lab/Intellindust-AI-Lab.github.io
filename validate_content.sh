#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

langs=(en zh fr)
sections=(about research awards publications contact)
errors=0

record_error() {
  echo "[error] $1"
  errors=$((errors + 1))
}

is_external_ref() {
  local ref="$1"
  [[ "$ref" =~ ^https?:// || "$ref" =~ ^mailto: || "$ref" =~ ^data: || "$ref" =~ ^javascript: || "$ref" =~ ^# || "$ref" =~ ^// ]]
}

echo "[check] validating content markdown files"
for lang in "${langs[@]}"; do
  for section in "${sections[@]}"; do
    file="content/${lang}/${section}.md"
    if [[ ! -f "$file" ]]; then
      record_error "missing file: $file"
      continue
    fi
    if [[ ! -s "$file" ]]; then
      record_error "empty file: $file"
    fi
    if ! rg -q '^##\s+' "$file"; then
      record_error "missing section heading (## ...) in: $file"
    fi

    while IFS= read -r src; do
      path="${src#src=\"}"
      path="${path%\"}"
      if is_external_ref "$path"; then
        continue
      fi
      if [[ ! -f "$path" ]]; then
        record_error "broken image path in $file -> $path"
      fi
    done < <(rg -o 'src="[^"]+"' "$file" || true)
  done
done

echo "[check] validating generated data and local links"
set +e
node <<'NODE'
const fs = require('fs');
const path = require('path');
let errors = 0;
const fail = (message) => {
  console.log(`[error] ${message}`);
  errors += 1;
};
const isExternal = (ref) => /^(https?:|mailto:|data:|javascript:|#|\/\/)/.test(ref);
const strip = (ref) => ref.split('#')[0].split('?')[0];
const existsLocal = (baseFile, ref) => {
  const clean = strip(ref);
  if (!clean) return true;
  const target = clean.startsWith('/')
    ? path.join(process.cwd(), clean.slice(1))
    : path.join(path.dirname(baseFile), clean);
  return fs.existsSync(target);
};

try {
  const pubs = JSON.parse(fs.readFileSync('data/publications.json', 'utf8'));
  if (!Array.isArray(pubs) || pubs.length === 0) fail('data/publications.json must contain at least one publication');
  pubs.forEach((pub, idx) => {
    if (!pub.title) fail(`publication ${idx} missing title`);
    if (!pub.venue) fail(`publication ${idx} missing venue`);
    if (!pub.image) fail(`publication ${idx} missing image`);
    if (pub.image && !fs.existsSync(strip(pub.image))) fail(`publication ${pub.title || idx} broken image -> ${pub.image}`);
    if (!Array.isArray(pub.actions)) fail(`publication ${pub.title || idx} missing actions array`);
  });
} catch (error) {
  fail(`cannot parse data/publications.json: ${error.message}`);
}

const htmlFiles = ['index.html'];
const collectHtml = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) collectHtml(full);
    if (stat.isFile() && full.endsWith('.html')) htmlFiles.push(full);
  }
};
collectHtml('projects');

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const refs = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map((m) => m[1]);
  const metaImages = [...html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/g)].map((m) => m[1]);
  for (const ref of [...refs, ...metaImages]) {
    if (!ref || isExternal(ref)) continue;
    if (!existsLocal(file, ref)) fail(`${file}: broken local ref -> ${ref}`);
  }
}

process.exit(errors > 0 ? 1 : 0);
NODE
node_status=$?
set -e
if [[ "$node_status" -ne 0 ]]; then
  errors=$((errors + 1))
fi

if [[ "$errors" -gt 0 ]]; then
  echo "[fail] validation failed with $errors issue(s)."
  exit 1
fi

echo "[ok] content validation passed."
