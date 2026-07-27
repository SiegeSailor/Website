---
paths:
  - "package.json"
  - "source/*/package.json"
---

# Editing a package manifest

**Read [`CONTRIBUTING.md`](../../CONTRIBUTING.md#adding-a-command) before adding
a script.** It owns the four places a new `build:*` or `watch:*` target has to
appear.

`build` and `watch` are aggregates written out by hand — npm does not expand
script globs — so a variant missing from its aggregate never runs, and nothing
reports it.

Version fields belong to semantic-release; never bump one by hand.
