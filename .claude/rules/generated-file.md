---
paths:
  - "source/content/resume/versions.generated.json"
  - "source/website/SiegeSailor-README.md"
  - "**/export/**"
---

# This file is generated

Do not edit it, and do not commit it — all of these are git-ignored build
output. An edit here survives until the next build and then disappears, taking
the reason for it with it.

| Path                                            | Written by                                        | Rebuild with                                   |
| ----------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| `source/content/resume/versions.generated.json` | `source/tooling/scripts/build-versions.mjs`       | `npm run build:versions`                       |
| `source/website/SiegeSailor-README.md`          | `scripts/docker-copy.sh`, copied out of the image | `bash scripts/docker-copy.sh`                  |
| `source/tooling/export/`                        | The document builders                             | `npm run build:resume`, `npm run build:readme` |
| `source/website/export/`                        | `next build`                                      | `npm run build:website`                        |

To change what lands here, change the input — the content in
[`source/content/`](../../source/content/CLAUDE.md) or the builder in
[`source/tooling/`](../../source/tooling/CLAUDE.md) — and rebuild.
