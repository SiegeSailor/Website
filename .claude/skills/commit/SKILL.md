---
name: commit
description: Write a commit message for this repository — Conventional Commits, one line, no body. Use whenever committing, amending, or drafting a commit message here.
---

# Commit

**[`CONTRIBUTING.md`](../../../CONTRIBUTING.md#commits-and-releases) owns the
format**: one Conventional Commits line, no body, no footer, no trailers, under
72 characters, imperative, one concern per commit, and a type table showing
which types publish a version. Read it, then write the message.

Say what the commit does, not what it touches:

```text
refactor: nest the three workspaces under source/
feat: aggregate build and watch over their :* variants
fix: skip the Husky hook install when Husky is absent
ci: split workflows by task and rename them by trigger
```

A major version is Ken's call — ask before writing the `!`.

## Before committing

- **Work on a branch.** `main` deploys and releases on every push.
- **Let the hook run.** A failure means fix the code, not `--no-verify`.
- **Stage deliberately.** `git add -A` sweeps in unrelated work — check
  `git status` first, and never stage generated output.
- **Commit only when asked**, and push only when asked.
