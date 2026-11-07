#!/usr/bin/env bash
#
# Local run of the CI checks.
#
# Usage:
#   bin/preflight.sh
#   npm run preflight
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

if [[ ! -d node_modules ]]; then
  echo ""
  echo "==> npm ci"
  npm ci
fi

exec "${ROOT}/bin/ci.sh"
