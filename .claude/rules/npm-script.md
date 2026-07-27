---
paths:
  - "package.json"
  - "source/*/package.json"
---

# Adding an npm script

`build` and `watch` are aggregates written out by hand — **npm does not expand
script globs** — so a new variant that is not added to its aggregate simply
never runs, without an error anywhere.

A new `build:<name>` or `watch:<name>` touches four places:

1. The workspace `package.json`, where the script actually runs.
2. The root `package.json`, delegating with
   `npm run <script> --workspace source/<workspace>`.
3. The root aggregate: `build` chains with `&&` in dependency order and
   `build:versions` stays first, because the others read the JSON it writes;
   `watch` passes its targets to `scripts/run-parallel.sh`.
4. The command table in [`CONTRIBUTING.md`](../../CONTRIBUTING.md#commands).

Keep the root scripts thin — a root script delegates, it does not implement, so
that every command works from the repository root. Version fields are owned by
semantic-release; never bump one by hand.
