# source/content

All authored content, shared by the two workspaces that render it. Nothing here
is code, and nothing here is generated.

| Folder                          | Holds                                                          | Guide                                     |
| ------------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| [`resume/`](./resume/)          | The single source of truth for the resume, the whole website, and the profile README | [`resume/CLAUDE.md`](./resume/CLAUDE.md)   |
| [`articles/`](./articles/)      | Blog posts, one file per post named `YYYY-MM-DD.md`             | [`articles/CLAUDE.md`](./articles/CLAUDE.md) |

## One source, four outputs

`resume/` is a **file-consumers structure**: every file declares in `consumers:`
which outputs read it, optionally names its section in `heading:`, and holds
exactly one content key. Each output asks for itself by name and gets only the
files that declare it, so a section leaves a document by dropping a name from a
list — no builder edit, no code change.

| Consumer               | Output                                       |
| ---------------------- | -------------------------------------------- |
| `resume`               | The one-page PDF/DOCX resume                 |
| `readme`               | The `SiegeSailor/SiegeSailor` profile README |
| `site`, `/`, `/about`  | Every page's content and metadata            |
| `versions`             | The latest release per project               |

Nodes inside a file follow the same rule one level down: a node with no
`consumers` inherits the file's, and `consumers: []` archives it — verified
material kept in the source and printed nowhere. The full file map is in
[`resume/CLAUDE.md`](./resume/CLAUDE.md).

`articles/` is plainer: `../website/helpers/server/article.ts` reads the folder
from disk, and the front matter in each file drives the post list, the feed, and
the article page. Images live with the website, in
`../website/public/images/<YYYY-MM-DD>/`, because Next.js serves them.

## Not formatted

This whole folder is excluded from Prettier. It is hand-tuned prose and data,
and reflowing it changes the rendered documents. `resume/versions.generated.json`
is build output and git-ignored — never edit or commit it.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the edit-and-rebuild loop.
