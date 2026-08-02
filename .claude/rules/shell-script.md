---
paths:
  - "**/*.sh"
  - ".husky/*"
---

# Writing a Shell Script

**Read [`scripts/CONTRIBUTING.md`](../../scripts/CONTRIBUTING.md) before editing.** Neither Prettier nor ESLint touches shell, so that document is the whole review: the skeleton to copy, the shape every script follows, and when a script should exist at all.

The 2 that bite hardest, stated in full alongside the per-script constraints in [`scripts/CLAUDE.md`](../../scripts/CLAUDE.md#constraints-that-must-never-break):

- **Guard the Working Directory First**: Every script tests for the repository root and fails anywhere else
- **Never Prompt**: These run unattended in CI
