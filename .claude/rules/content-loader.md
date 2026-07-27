---
paths:
  - "source/tooling/scripts/load-content.mjs"
  - "source/website/helpers/server/content.ts"
---

# The two loaders are twins

**Change one and change the other in the same commit.** These two files are the
same ~50 lines written twice, deliberately, and a divergence does not fail a
build — it quietly gives the resume different content from the website.

[`source/tooling/CONTRIBUTING.md`](../../source/tooling/CONTRIBUTING.md#the-two-loaders-are-twins)
owns why they are duplicated and what they must agree on;
[`source/website/CONTRIBUTING.md`](../../source/website/CONTRIBUTING.md#working-with-content)
owns why `content.ts` is server-only.
