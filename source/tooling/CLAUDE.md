# CLAUDE.md — source/tooling

The builders that turn [`../content/`](../content/CLAUDE.md) into the resume, the README, and the version list.

| Document                                                     | Owns                                                                                               |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md) | The resume constraints the builders serve                                                          |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)                       | The build commands, the resume layout notes, how to take a Debian update, and how to add a builder |
| [`README.md`](./README.md)                                   | What each script writes and why the Docker image exists                                            |

The one that is silent when broken: the page-count check exits 0 when LibreOffice or poppler is missing, so a host build proves nothing about the one-page constraint — [why](./CONTRIBUTING.md#building).

## Constraints That Must Never Break

- **Never Emit a Literal `•`**: Bullets come from the numbering config as native Word bullets, and nothing may add a table, a text box, or a header or footer — dates are right-aligned with tab stops, not spaces, and the `.docx` is the primary deliverable while the PDF is a convenience
- **Never Filter Content**: A builder loads its consumer and renders what it gets, and a section is absent because the content says so — section **order** is the one deliberate exception and stays in code, because it is ATS-sensitive and drives the one-page fit
- **Never Stamp a Version from Anywhere but the Root `package.json`**: Semantic Release owns it

## The 2 Loaders Are Twins

`scripts/load-content.mjs` and `../website/helpers/server/content.ts` are the same ~50 lines written twice, deliberately: the website cannot import this workspace, pinned to `js-yaml` and `docx` to keep the image at ~22 packages, and it needs webpack to own the files for dev hot-reload.

**Change one and change the other in the same commit.** They must agree on what `consumers:` means and that a file without it is rejected, that a file carries exactly one content key and a key claimed twice is a build failure, and that a node is printed unless it carries `archived: true`, which they strip so it never reaches a renderer while rejecting the superseded node-level `consumers:` outright.

A divergence does not fail a build. It quietly gives the resume different content from the website, which is the failure the structure exists to prevent.
