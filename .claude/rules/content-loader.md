---
paths:
  - "source/tooling/scripts/load-content.mjs"
  - "source/website/helpers/server/content.ts"
---

# The two loaders are twins

These two files are the same ~50 lines written twice, deliberately. The website
cannot import the tooling workspace — it is pinned to `js-yaml` and `docx` so
its Docker image stays at ~22 packages — and the website needs webpack to own
the files for dev hot-reload.

**Change one and change the other in the same commit.** They must agree on:

- what `consumers:` means, and that a file without it is rejected;
- that a file carries exactly one content key, and that a key claimed twice is a
  build failure;
- node-level inheritance: silence inherits the file's consumers, `consumers: []`
  archives.

A divergence does not fail a build. It quietly gives the resume different
content from the website, which is exactly the failure this structure exists to
prevent.

`content.ts` is additionally **server-only**: `require.context` inlines every
file in `source/content/resume/`, so importing it from a client component ships
`contact.yaml` to the browser. The structure itself is documented in
[`source/content/resume/CLAUDE.md`](../../source/content/resume/CLAUDE.md).
