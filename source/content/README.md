# source/content

All authored content, shared by the 2 workspaces that render it. Nothing here is code, and nothing here is generated.

| Folder                     | Holds                                                                        | Guide                                        |
| -------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------- |
| [`articles/`](./articles/) | Articles, one file per article named `YYYY-MM-DD.md`                         | [`articles/CLAUDE.md`](./articles/CLAUDE.md) |
| [`resume/`](./resume/)     | The single source of truth for the resume, the whole website, and the README | [`resume/CLAUDE.md`](./resume/CLAUDE.md)     |

## One Source, 4 Outputs

`resume/` is a **file-consumers structure**: every file declares in `consumers:` which outputs read it, optionally names its section in `heading:`, and holds exactly one content key. Each output asks for itself by name and gets only the files that declare it, so a section leaves a document by dropping a name from a list — no builder edit, no code change.

| Output                               | Consumers             |
| ------------------------------------ | --------------------- |
| Every page's content and metadata    | `site`, `/`, `/about` |
| The latest release per project       | `versions`            |
| The one-page PDF and DOCX resume     | `resume`              |
| The `SiegeSailor/SiegeSailor` README | `readme`              |

Nodes inside a file follow the same rule one level down — [`CONTRIBUTING.md`](./CONTRIBUTING.md#changing-what-appears-where) owns that shape, and the full file map is in [`resume/CLAUDE.md`](./resume/CLAUDE.md).

`articles/` is plainer: `../website/helpers/server/article.ts` reads the folder from disk, and the front matter in each file drives the article list, the feed, and the article page. Images live with the website, because Next.js serves them — [`../website/README.md`](../website/README.md#structure) gives the path.

See [`CLAUDE.md`](./CLAUDE.md#constraints-that-must-never-break) for why nothing here is reformatted and [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the edit-and-rebuild loop.
