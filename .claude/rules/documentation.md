---
paths:
  - "**/README.md"
  - "**/CONTRIBUTING.md"
  - "**/CLAUDE.md"
  - ".claude/**/*.md"
---

# Writing documentation

**Read [`CONTRIBUTING.md`](../../CONTRIBUTING.md#documentation) before writing.**
It owns which document answers which question, and the style every document
follows.

The two rules that decide where a sentence goes:

- A fact true of **two scopes** belongs at the root, linked from both.
- A fact true of a `CONTRIBUTING.md` **and** a `CLAUDE.md` belongs to the
  `CONTRIBUTING.md`, and the `CLAUDE.md` links to it.

So a `CLAUDE.md` or a rule states only what has no home in a `CONTRIBUTING.md`,
and points at one for everything else. Before adding a paragraph anywhere, check
that it is not already written down: `grep -rn "<phrase>" --include="*.md" .`
