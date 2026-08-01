---
paths:
  - ".husky/*"
  - ".hadolint.yml"
  - ".lintstagedrc.mjs"
  - ".prettierignore"
  - ".prettierrc.json"
  - "source/website/eslint.config.mjs"
---

# Checking Code Quality

Prettier owns formatting, ESLint owns correctness, `tsc` owns types, and hadolint owns the `Dockerfile`:

```shell
npm run format:check         # Prettier, verify only (what CI runs)
npm run lint                 # ESLint
npm run typecheck            # tsc --noEmit
bash scripts/hadolint.sh     # hadolint on source/tooling/Dockerfile
```

The first 3 run automatically on `git commit` through a Husky `pre-commit` hook that calls [lint-staged](https://github.com/lint-staged/lint-staged) ([`.lintstagedrc.mjs`](../../.lintstagedrc.mjs)): staged files are formatted and autofixed in place and re-staged, `tsc --noEmit` runs when a `.ts` or `.tsx` file is staged, and the commit aborts if anything fails. Pass `--no-verify` to skip the hook, or set `HUSKY=0` to stop installing it.

The `Dockerfile` lint stays out of the hook — hadolint is a system binary rather than a dependency, so a machine without it would fail every commit. Both workflows install a pinned version and run it, so a violation fails CI instead.

Prettier runs from the root and so also covers `source/tooling/` and the Markdown; ESLint stays scoped to `source/website/`, where its config lives. Authored content — all of `source/content/` — is excluded from Prettier so prose and the hand-tuned resume source stay untouched. Terraform and the shell scripts are covered by neither.
