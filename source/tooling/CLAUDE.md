# CLAUDE.md — source/tooling

The builders that turn [`../content/`](../content/CLAUDE.md) into the resume,
the profile README, and the version list. See [`README.md`](./README.md) for
what each script writes and [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the
commands and the layout notes.

## Rules

- **Never filter content in a builder.** A builder loads its consumer and
  renders what it gets; a section is absent because the content says so. The one
  deliberate exception is section **order**, which stays in code because it is
  ATS-sensitive and drives the one-page fit.
- **The resume must fit one US-Letter page and stay ATS-safe** — the full list is
  in [`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md). In this
  workspace that means: never emit a literal `•` (use the numbering config's
  native Word bullets), no tables, text boxes, or headers and footers, and dates
  right-aligned with tab stops rather than spaces.
- **The page-count check fails open.** Without LibreOffice or poppler it prints
  `skipped` and exits 0, so only the Docker path is guaranteed to verify. Never
  conclude the resume fits from a host build alone.
- **`.docx` is the primary deliverable**; the PDF is a convenience.
- **`load-content.mjs` and `../website/helpers/server/content.ts` are the same
  loader twice**, on purpose — the website cannot import this workspace, which
  is pinned to `js-yaml` and `docx` to keep the image at ~22 packages. Change
  one and change the other.
- **Keep the dependency list at two packages.** A third one needs a reason that
  survives the image-size argument.
- **The version comes from the root `package.json`**, which semantic-release
  owns. Never stamp a version from anywhere else.
- **Bumping `DEBIAN_SNAPSHOT` means re-verifying the page count.** A LibreOffice
  or Carlito change shifts the layout.
