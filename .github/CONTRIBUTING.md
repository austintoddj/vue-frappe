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
feature/*  →  main  →  tag vX.Y.Z  →  staged npm release (approve with 2FA) + GitHub Release
```

## Local development

Requirements:

- Node.js **20+** to consume the package. Maintainers and CI use the Node line in `.nvmrc` (26).
- npm (ships with Node). Node 26 ships npm 11.20.0, which is new enough for `npm stage publish` (11.15.0 or later).

```bash
npm install
npm run preflight
```

`npm run preflight` installs when `node_modules` is missing, then runs typecheck, lint, unit tests, the build, and the size budget. `npm run format` writes Prettier changes. GitHub also runs the tests against the lowest supported peers.

### Scripts

| Command                          | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| `npm run check`                  | Short loop: typecheck, lint, and test             |
| `npm run ci`                     | CI checks: typecheck, lint, test, build, and size |
| `npm run preflight`              | Install when needed, then `npm run ci`            |
| `npm test` / `npm run test:unit` | Run unit tests once                               |
| `npm run test:watch`             | Vitest watch mode                                 |
| `npm run test:coverage`          | Coverage, local only. CI does not upload it.      |
| `npm run typecheck`              | `vue-tsc`                                         |
| `npm run lint`                   | ESLint, then the Prettier check                   |
| `npm run format`                 | Prettier write                                    |
| `npm run build`                  | Typecheck + library build                         |
| `npm run size`                   | Bundle size budget                                |

### Project layout

```text
src/
  components/VueFrappe.vue   # chart component
  utils/buildOptions.ts      # pure option builders (easy to unit test)
  types/                     # public types + frappe ambient modules
  plugin.ts                  # app.use(VueFrappePlugin)
  index.ts                   # public API
tests/                       # Vitest specs (mock frappe-charts)
bin/ci.sh                    # checks GitHub runs after install
bin/preflight.sh             # install when needed, then bin/ci.sh
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

1. Merge a pull request that sets `version` in `package.json`.
2. Tag that `main` commit only after its `ci` run is green:

   ```bash
   gh run list -R austintoddj/vue-frappe -b main -w ci -L 1
   git fetch origin && git tag -a vX.Y.Z -m vX.Y.Z origin/main && git push origin vX.Y.Z
   ```

3. `publish.yml` checks that the tag is on `main`, matches `package.json`, and that `ci` passed. It builds, stages the version on npm, and creates the GitHub Release.
4. Nothing installs until you approve it at [npmjs.com](https://www.npmjs.com) or with `npm stage approve <id>`, using 2FA.

A bad release is fixed with the next patch version. Also run `npm deprecate vue-frappe@X.Y.Z "<reason>"`. Never move or delete a tag.

Breaking upgrades for consumers are documented in [UPGRADE.md](UPGRADE.md).
