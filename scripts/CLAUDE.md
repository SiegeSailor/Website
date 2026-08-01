# CLAUDE.md — scripts

Shell scripts called by the npm scripts and the workflows.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a script**; neither Prettier nor ESLint touches shell, so that document is the whole review: the skeleton, the shape, when a script should exist, the per-script constraints, and how to check a change, and [`.claude/rules/shell-script.md`](../.claude/rules/shell-script.md) points back to it whenever a `*.sh` is opened
- [`README.md`](./README.md) — what each script does and how to run it

The one that is silent when broken: a script that prompts hangs a workflow instead of failing it — [per-script constraints](./CONTRIBUTING.md#per-script-constraints).
