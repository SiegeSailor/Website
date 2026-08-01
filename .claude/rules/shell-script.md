---
paths:
  - "**/*.sh"
  - ".husky/*"
---

# Writing a Shell Script

**Read [`scripts/CONTRIBUTING.md`](../../scripts/CONTRIBUTING.md) before editing.** Neither Prettier nor ESLint touches shell, so that document is the whole review: the skeleton to copy, the shape every script follows, when a script should exist at all, and the constraints particular scripts carry.

The 2 that bite hardest:

- **Run from the Repository Root**: Every script guards for it and fails anywhere else
- **Never Prompt**: These run unattended in CI
