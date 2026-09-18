---
paths:
  - ".husky/*"
  - ".lintstagedrc.mjs"
  - ".prettierignore"
  - ".prettierrc.json"
  - "source/eslint.config.mjs"
---

# Checking Code Quality

Prettier owns formatting, ESLint owns correctness, and `tsc` owns types:

```shell
npm run format:check         # Prettier, verify only (what CI runs)
npm run lint                 # ESLint
npm run typecheck            # tsc --noEmit
```

All 3 run automatically on `git commit` through a Husky `pre-commit` hook that calls [lint-staged](https://github.com/lint-staged/lint-staged) ([`.lintstagedrc.mjs`](../../.lintstagedrc.mjs)): staged files are formatted and autofixed in place and re-staged, `tsc --noEmit` runs when a `.ts` or `.tsx` file is staged, and the commit aborts if anything fails. A failure means fixing the code, never skipping the hook. Set `HUSKY=0` to stop installing it.

Prettier runs from the root and so also covers the Markdown; ESLint stays scoped to `source/`, where its config lives. Terraform and the shell scripts are covered by neither.
