---
paths:
  - ".github/workflows/*.yml"
---

# Writing a workflow

**Read [`CONTRIBUTING.md`](../../CONTRIBUTING.md#workflows) before editing.** It
owns the one-task rule, the naming table for every field, the `run-name`
limitation, and the list of what every workflow carries.

The three that are easiest to get wrong:

- The filename is `<branch|trigger>-<context>.yml` and `name` is
  `<branch|trigger>: <detailed context>` — **no trailing period on any field**.
- `run-name` cannot read a value the run computes; send those to
  `$GITHUB_STEP_SUMMARY`.
- A rename breaks the workflow table and the `README.md` badges.

Confirm the file parses before finishing:

```shell
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/<file>.yml','utf8')).name)"
```
