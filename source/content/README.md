# source/content

All authored content, shared by the 2 workspaces that render it. Nothing here is code, and nothing here is generated.

| Folder                     | Holds                                                                        | Guide                                        |
| -------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------- |
| [`articles/`](./articles/) | Articles, one file per article named `YYYY-MM-DD.md`                         | [`articles/CLAUDE.md`](./articles/CLAUDE.md) |
| [`resume/`](./resume/)     | The single source of truth for the resume, the whole website, and the Profile | [`resume/CLAUDE.md`](./resume/CLAUDE.md)     |

## One Source, 4 Outputs

`resume/` is a **file-consumers structure**: every file declares in `consumers:` which outputs read it, optionally names its section in `heading:`, and holds exactly one content key. Each output asks for itself by name and gets only the files that declare it, so a section leaves a document by dropping a name from a list — no builder edit, no code change.

| Output                                | Consumers             |
| ------------------------------------- | --------------------- |
| Every page's content and metadata     | `site`, `/`, `/about` |
| The `SiegeSailor/SiegeSailor` Profile | `profile`             |
| The latest release per project        | `versions`            |
| The one-page PDF and DOCX resume      | `resume`              |

Nodes inside a file follow the same rule one level down: a node with no `consumers` inherits the file's, and `consumers: []` archives it — verified material kept in the source and printed nowhere. The full file map is in [`resume/CLAUDE.md`](./resume/CLAUDE.md).

`articles/` is plainer: `../website/helpers/server/article.ts` reads the folder from disk, and the front matter in each file drives the article list, the feed, and the article page. Images live with the website, in `../website/public/images/<YYYY-MM-DD>/`, because Next.js serves them.

## Not Formatted

This whole folder is excluded from Prettier. It is hand-tuned prose and data, and reflowing it changes the rendered documents. `resume/versions.generated.json` is build output and git-ignored — never edit or commit it.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the edit-and-rebuild loop.
