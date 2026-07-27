---
paths:
  - "**/*.sh"
  - ".husky/*"
---

# Writing a shell script

**Read [`scripts/CONTRIBUTING.md`](../../scripts/CONTRIBUTING.md) before
editing.** Neither Prettier nor ESLint touches shell, so that document is the
whole review: the skeleton to copy, the shape every script follows, when a
script should exist at all, and the constraints particular scripts carry.

The two that bite hardest:

- **Every script runs from the repository root** and guards for it.
- **Nothing may prompt.** These run unattended in CI.
