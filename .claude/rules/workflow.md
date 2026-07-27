---
paths:
  - ".github/workflows/*.yml"
  - ".github/actions/**/action.yml"
---

# Writing a workflow

**Read [`CONTRIBUTING.md`](../../CONTRIBUTING.md#workflows) before editing.** It
owns the one-task rule, the naming table for every field, the `run-name`
limitation, the shared composite actions, and the list of what every workflow
carries.

The four that are easiest to get wrong:

- The filename is `<branch|trigger>-<context>.yml` and `name` is
  `<branch|trigger>: <detailed context>` — **no trailing period on any field**.
  Composite actions invert that, `<action>-<technology>`, as GitHub's own do.
- `run-name` cannot read a value the run computes; send those to
  `$GITHUB_STEP_SUMMARY`.
- A rename breaks the workflow table and the `README.md` badges.
- A step a second workflow needs belongs in `.github/actions/`, where every
  `run` needs its own `shell: bash`. `Checkout` is the one step that cannot move
  there; `setup-workspace` owns Node and `npm ci` for all four workflows.

Confirm the file parses before finishing:

```shell
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/<file>.yml','utf8')).name)"
```
