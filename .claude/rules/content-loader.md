---
paths:
  - "source/tooling/scripts/load-content.mjs"
  - "source/website/helpers/server/content.ts"
---

# The 2 Loaders Are Twins

**Change one and change the other in the same commit.** These 2 files are the same ~50 lines written twice, deliberately, and a divergence does not fail a build — it quietly gives the resume different content from the website.

[`source/tooling/CONTRIBUTING.md`](../../source/tooling/CONTRIBUTING.md#the-2-loaders-are-twins) owns why they are duplicated and what they must agree on; [`source/website/CONTRIBUTING.md`](../../source/website/CONTRIBUTING.md#working-with-content) owns why `content.ts` is server-only.
