# Contribution Guide

Thank you for considering contributing to vue-frappe.

Please read the [code of conduct](CODE_OF_CONDUCT.md). If you discover a security vulnerability, report it privately as described in [SECURITY.md](SECURITY.md) — do not open a public issue.

## Bug reports

When filing a bug, include a clear title, a short description, and enough detail for someone else to reproduce the problem. A minimal Vue SFC or reproduction repo is especially helpful.

Pull requests are welcome and preferred when you already have a fix. Keep each pull request focused on one change.

## Which branch?

| Branch | Role                                                                  |
| ------ | --------------------------------------------------------------------- |
| `main` | Default branch. Open PRs here (or from short-lived feature branches). |

Suggested release flow:

```text
feature/*  →  main  →  tag vX.Y.Z  →  npm + GitHub Release
```

## Local development

Requirements:

- Node.js **20+**
- npm (ships with Node)

```bash
npm install
npm run preflight
```

`npm run preflight` runs: install (if needed) → lint → format → typecheck → unit tests → build → size.

### Scripts

| Command                          | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| `npm run preflight`              | Full pre-commit checklist (`bin/preflight.sh`) |
| `npm test` / `npm run test:unit` | Run unit tests once                            |
| `npm run test:watch`             | Vitest watch mode                              |
| `npm run test:coverage`          | Coverage + thresholds                          |
| `npm run typecheck`              | `vue-tsc`                                      |
| `npm run lint`                   | ESLint                                         |
| `npm run format`                 | Prettier write                                 |
| `npm run build`                  | Typecheck + library build                      |
| `npm run size`                   | Bundle size budget                             |

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

1. Run **`npm run preflight`** and fix any failures.
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

1. Merge the release branch into `main` when ready.
2. Ensure `package.json` `version` matches the tag (e.g. `2.0.0`).
3. Tag **`vX.Y.Z`** on `main` and push the tag:

   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```

4. The **Publish** workflow verifies the package, publishes to npm, and creates a GitHub Release (auto-generated notes; edit the release body if you want a hand-written summary).

Breaking upgrades for consumers are documented in [UPGRADE.md](UPGRADE.md).
