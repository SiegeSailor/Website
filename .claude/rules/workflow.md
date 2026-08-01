---
paths:
  - ".github/workflows/*.yml"
  - ".github/actions/**/action.yml"
---

# Writing a Workflow

**Read [`CONTRIBUTING.md`](../../CONTRIBUTING.md#workflows) before editing.** It owns the one-task rule, the naming table for every field, the `run-name` limitation, the shared composite actions, and the list of what every workflow carries.

The 4 that are easiest to get wrong:

- **Name Every Field to Its Pattern**: The filename is `<branch|trigger>-<context>.yml` and `name` is `<branch|trigger>: <detailed context>`, with no trailing period on any field, while composite actions invert the order as `<action>-<technology>`, as GitHub's own do
- **Keep `run-name` Static**: It cannot read a value the run computes, so send those to `$GITHUB_STEP_SUMMARY`
- **Trace a Rename**: It breaks the workflow table and the `README.md` badges
- **Share a Step through `.github/actions/`**: Every `run` there needs its own `shell: bash`, `Checkout` is the one step that cannot move there, and `setup-workspace` owns Node and `npm ci` for all 4 workflows

Confirm the file parses before finishing:

```shell
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/<file>.yml','utf8')).name)"
```
