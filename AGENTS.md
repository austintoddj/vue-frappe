# Agent rules

## Verify

- Run `npm run check` locally. Nothing else.
- Don't run e2e, the install smoke, the database tests, a dev server, a browser, or screenshots to verify a change. CI does that.
- Open a PR and wait on `gh pr checks --watch`. Read the failing step and fix that.
- Rerun a failed check at most once (`gh run rerun <run-id> --failed`). A second failure is real; report it.

## Don't

- Push to the default branch, create or push tags, publish or stage a package, merge PRs, or turn on auto-merge for your own PRs.
- Edit files in `.github/`, rulesets, repo or Actions settings, or npm or Packagist settings. Propose those in the PR description.
- Add CI jobs, versions, browsers, or checks.
- Check out, install, or run an outside contributor's branch. Read the diff on GitHub instead.
- Post on issues, PRs, discussions, or security advisories you didn't open.
- Send real email or call real third-party services from tests.
