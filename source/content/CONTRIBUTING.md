# Contributing to source/content

Read the [root guide](../../CONTRIBUTING.md) first. This folder is authored
content, so the loop is edit, rebuild, and look at what changed — there is
nothing to lint here.

## The loop

```shell
npm run watch    # dev server plus resume and README rebuilds on every save
```

Editing anything here hot-reloads the pages built from it, because the website
imports the files as raw text. To check the documents on their own after an
edit:

```shell
npm run build:versions    # refresh the project versions first
npm run build:resume      # .docx, plus .pdf and the page-count check with LibreOffice
npm run build:readme      # the profile README
```

The page-count check is skipped silently on a host without LibreOffice and
poppler, so build through Docker before believing the resume still fits — see
[`../tooling/CONTRIBUTING.md`](../tooling/CONTRIBUTING.md).

## Changing what appears where

Move content between documents by editing `consumers:`, never a builder:

```yaml
consumers: # this file is read by
  - resume
  - /about

heading: Summary # what titles its section in a document

summary: # exactly one content key per file
  - text: "…"
```

A node inside the file opts out the same way one level down — `consumers: []`
archives it, and silence inherits the file's list. Both loaders reject a file
with no `consumers:`, with more than one content key, or with a key another file
already claims, so a typo fails the build instead of quietly emptying a section.

> [!warning]
> Archiving a node silently shortens a document, and un-archiving one can push
> the resume past its single page. After editing, rebuild and read what came
> out.

## Adding a file or a post

- **A resume file** needs a `consumers:` list, an optional `heading:`, and one
  content key that no other file claims. The filename is free — the loader takes
  the key from the contents — and no code change is needed, because the website
  globs the folder. Record it in the file map in
  [`resume/CLAUDE.md`](./resume/CLAUDE.md).
- **A blog post** is `articles/YYYY-MM-DD.md`. Follow
  [`articles/CLAUDE.md`](./articles/CLAUDE.md), which covers the front matter,
  the tone, the Markdown features the renderer supports, and where images go.
