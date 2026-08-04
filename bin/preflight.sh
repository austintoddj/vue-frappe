#!/usr/bin/env bash
#
# Pre-commit checklist: lint/format, typecheck, unit tests, build, and size budget.
#
# Usage:
#   bin/preflight.sh
#   pnpm preflight
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

step() {
  echo ""
  echo "==> $*"
}

# Dependency upgrades are intentional (Dependabot / manual), not part of preflight.
step "pnpm install (or skip if node_modules present)"
if [[ ! -d node_modules ]]; then
  pnpm install --frozen-lockfile
else
  echo "node_modules present — skipping install"
fi

step "pnpm run lint"
pnpm run lint

step "pnpm run format"
pnpm run format

step "pnpm run typecheck"
pnpm run typecheck

step "pnpm run test:unit"
pnpm run test:unit

step "pnpm run build"
pnpm run build

step "pnpm run size"
pnpm run size

echo ""
echo "==> Preflight complete. Review the diff, then commit."
