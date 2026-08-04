# Contribution Guide

Thank you for considering contributing to vue-frappe.

Please read the [code of conduct](CODE_OF_CONDUCT.md). If you discover a security vulnerability, report it privately as described in [SECURITY.md](SECURITY.md) — do not open a public issue.

## Bug reports

When filing a bug, include a clear title, a short description, and enough detail for someone else to reproduce the problem. A minimal Vue SFC or reproduction repo is especially helpful.

Pull requests are welcome and preferred when you already have a fix. Keep each pull request focused on one change.

## Which branch?

| Branch    | Role                                                            |
| --------- | --------------------------------------------------------------- |
| `develop` | Day-to-day integration. Open PRs here for features and fixes.   |
| `main`    | Stable / release line. Only merge from `develop` when shipping. |

Default branch on GitHub is **`main`**. CI runs on pushes and PRs to both `main` and `develop`.

Suggested flow:

```text
feature/*  →  develop  →  main  →  tag vX.Y.Z  →  npm + GitHub Release
```

Open pull requests against **`develop`** unless a maintainer asks for another branch.

## Local development

Requirements:

- Node.js **20+**
- [pnpm](https://pnpm.io) 10+

```bash
pnpm install
pnpm preflight
```

`pnpm preflight` runs: install (if needed) → lint → format → typecheck → unit tests → build → size.

### Scripts

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `pnpm preflight`     | Full pre-commit checklist (`bin/preflight.sh`) |
| `pnpm test`          | Run unit tests once                            |
| `pnpm test:unit`     | Alias for `pnpm test`                          |
| `pnpm test:watch`    | Vitest watch mode                              |
| `pnpm test:coverage` | Coverage + thresholds                          |
| `pnpm typecheck`     | `vue-tsc`                                      |
| `pnpm lint`          | ESLint                                         |
| `pnpm format`        | Prettier write                                 |
| `pnpm build`         | Typecheck + library build                      |
| `pnpm size`          | Bundle size budget                             |

### Project layout

```text
src/
  components/VueFrappe.vue   # chart component
  utils/buildOptions.ts      # pure option builders (easy to unit test)
  types/                     # public types + frappe ambient modules
  plugin.ts                  # app.use(VueFrappePlugin)
  index.ts                   # public API
tests/                       # Vitest specs (mock frappe-charts)
bin/preflight.sh             # pre-commit quality checklist
```

## Pull requests

Before submitting a pull request, please:

1. Run **`pnpm preflight`** and fix any failures.
2. Keep the public API small — new props should map cleanly to Frappe options or Vue ergonomics.
3. Prefer tests for behavior that talks to Frappe (`update`, lifecycle, events). Mock `frappe-charts` so tests stay unit-level.
4. Export useful types from `src/index.ts` when you extend the public surface.
5. No unrelated refactors in the same PR as a bug fix.
6. If you changed host-facing behavior, update [readme.md](../readme.md) (and [UPGRADE.md](UPGRADE.md) for breaking changes).

### Commit style

Prefer clear, imperative subjects:

- `fix chart.update not being called on prop changes`
- `Add dataSelect event forwarding`
- `docs: document heatmap example`

## Releases

1. Land work on `develop`, then merge `develop` → `main`.
2. Bump `package.json` `version` (e.g. `2.0.0`) in the release commit.
3. Tag **`vX.Y.Z`** on `main` and push the tag:

   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```

4. The **Publish** workflow verifies the package, publishes to npm, and creates a GitHub Release (auto-generated notes; edit the release body if you want a hand-written summary).

Breaking upgrades for consumers are documented in [UPGRADE.md](UPGRADE.md).
