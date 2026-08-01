---
name: commit
description: Write a commit message for this repository — Conventional Commits, one line, no body. Use whenever committing, amending, or drafting a commit message here.
---

# Commit

**[`CONTRIBUTING.md`](../../../CONTRIBUTING.md#commits-and-releases) owns the format**: one Conventional Commits line, no body, no footer, no trailers, under 72 characters, imperative, one concern per commit, and a type table showing which types publish a version. Read it, then write the message.

Say what the commit does, not what it touches:

```text
refactor: nest the three workspaces under source/
feat: aggregate build and watch over their :* variants
fix: skip the Husky hook install when Husky is absent
ci: split workflows by task and rename them by trigger
```

A major version is Ken's call — ask before writing the `!`.

## Before Committing

- **Work on a Branch**: `main` deploys and releases on every push
- **Let the Hook Run**: A failure means fixing the code, not passing `--no-verify`
- **Stage Deliberately**: `git add -A` sweeps in unrelated work, so read `git status` first and never stage generated output
- **Wait to Be Asked**: Commit only when asked, and push only when asked
