---
paths:
  - "source/content/resume/versions.generated.json"
  - "source/website/SiegeSailor-README.md"
  - "**/export/**"
---

# The Outputs Are Generated

Never edit one, and never commit one. All of these are git-ignored build output, so an edit survives until the next build and then disappears, taking the reason for it with it — change the input and rebuild instead.

| Path                                            | Written By                                        | Rebuild With                                   |
| ----------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| `source/content/resume/versions.generated.json` | `source/tooling/scripts/build-versions.mjs`       | `npm run build:versions`                       |
| `source/tooling/export/`                        | The document builders                             | `npm run build:resume`, `npm run build:readme` |
| `source/website/SiegeSailor-README.md`          | `scripts/docker-copy.sh`, copied out of the image | `bash scripts/docker-copy.sh`                  |
| `source/website/export/`                        | `next build`                                      | `npm run build:website`                        |
