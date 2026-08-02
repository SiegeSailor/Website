# CLAUDE.md — source/content

All authored content, and the single source the resume, the website, and the README are built from.

| Document                                     | Owns                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`articles/CLAUDE.md`](./articles/CLAUDE.md) | How to write an article                                                                  |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)       | The edit-and-rebuild loop, the `consumers:` workflow, and how to add a file or an article |
| [`README.md`](./README.md)                   | What lives here and how it reaches the 4 outputs                                         |
| [`resume/CLAUDE.md`](./resume/CLAUDE.md)     | The file map, the node-level consumers, and the resume constraints                       |

## Constraints That Must Never Break

- **Nothing Here Is Reformatted**: The folder is excluded from Prettier on purpose, because reflowing prose or re-indenting YAML changes the rendered documents
- **The Facts in `resume/` Are Verified**: Do not alter a date, a ranking, a title, or a number without explicit confirmation from Ken — this is the folder a background-check vendor is effectively reading
