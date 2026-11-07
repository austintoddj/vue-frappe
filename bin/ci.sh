#!/usr/bin/env bash
#
# Checks GitHub runs after install. Preflight calls this same file.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

step() {
  echo ""
  echo "==> $*"
}

step "npm run typecheck"
npm run typecheck

step "npm run lint"
npm run lint

step "npm test"
npm test

step "npm run build"
npm run build

step "npm run size"
npm run size

if [[ "${CI:-}" == "true" ]]; then
  # Floors of peerDependencies. Current @vue/test-utils calls a Vue 3.5 API, so this run uses 2.4.6.
  step "Tests on the lowest supported peers"
  npm install --no-save vue@3.4.0 frappe-charts@1.6.0 @vue/test-utils@2.4.6
  npm test
fi

echo ""
echo "==> CI checks passed."
