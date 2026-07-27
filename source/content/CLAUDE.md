# CLAUDE.md — source/content

All authored content. See [`README.md`](./README.md) for how it reaches the four
outputs and [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the edit-and-rebuild
loop. Two deeper guides sit one level down: the structure and constraints of the
resume source in [`resume/CLAUDE.md`](./resume/CLAUDE.md), and how to write a
post in [`articles/CLAUDE.md`](./articles/CLAUDE.md).

## Rules

- **The facts here are verified.** Do not alter dates, rankings, titles, or
  numbers without explicit confirmation from Ken. This is the folder a
  background-check vendor is effectively reading.
- **Never reformat.** This folder is excluded from Prettier on purpose; reflowing
  prose or re-indenting YAML changes the rendered documents.
- **Change `consumers:`, not a builder**, to move content between outputs.
- **One content key per file**, claimed by no other file.
- **Rebuild and read the output after editing.** Archiving a node silently
  shortens a document; un-archiving one can push the resume past its single
  page.
- **`resume/versions.generated.json` is generated** — never edit or commit it.
