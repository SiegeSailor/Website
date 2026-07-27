# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site
served from S3 behind CloudFront, plus a single-source resume and profile build
system. This file is the map and the rules that hold everywhere;
[`README.md`](./README.md) says what the project is and
[`CONTRIBUTING.md`](./CONTRIBUTING.md) how to work in it, including every
command, convention, check, and workflow.

## Where the rules live

Each scope carries three documents: `README.md` (what it is),
`CONTRIBUTING.md` (how to work on it), and `CLAUDE.md` (what must not break).
**A rule true of two scopes belongs at the root**, linked from the scopes rather
than repeated — so before writing a rule down, decide which scope owns it.

| Scope                                           | Read its `CLAUDE.md` before touching               |
| ----------------------------------------------- | -------------------------------------------------- |
| [`source/website/`](./source/website/CLAUDE.md) | The Next.js application                            |
| [`source/tooling/`](./source/tooling/CLAUDE.md) | The document builders, their loader, and the image |
| [`source/content/`](./source/content/CLAUDE.md) | Any authored content                               |
| [`infrastructure/`](./infrastructure/CLAUDE.md) | Terraform and anything deployed to AWS             |
| [`scripts/`](./scripts/CLAUDE.md)               | The shell scripts                                  |

Conventions that follow a **file type across scopes** are path-scoped rules in
[`.claude/rules/`](./.claude/rules/) instead, loaded only when a matching file
is opened:

| Rule                                                     | Loads for                                       |
| -------------------------------------------------------- | ----------------------------------------------- |
| [`documentation.md`](./.claude/rules/documentation.md)   | Any `README.md`, `CONTRIBUTING.md`, `CLAUDE.md` |
| [`workflow.md`](./.claude/rules/workflow.md)             | `.github/workflows/*.yml`                       |
| [`shell-script.md`](./.claude/rules/shell-script.md)     | Any `*.sh` and the Husky hooks                  |
| [`npm-script.md`](./.claude/rules/npm-script.md)         | Any `package.json`                              |
| [`content-loader.md`](./.claude/rules/content-loader.md) | The two loaders that must stay in step          |
| [`generated-file.md`](./.claude/rules/generated-file.md) | Build output that must never be edited          |

## Repository layout

The repository is an npm workspace: the root `package.json` owns the version and
the single `package-lock.json`; `source/website/` and `source/tooling/` are the
two member workspaces, and `source/content/` is plain data shared by both.

- **`source/`** — the three authored folders, nested under one parent so they
  stay adjacent in a file tree. Nothing else lives here, and the three keep
  their sibling relationship: the website reaches `../content/`, and the tooling
  scripts reach `../../content/resume/`.
  - **`source/content/`** — all authored content: `resume/`, the single source of
    truth for the resume, the whole website, and the profile README; and
    `articles/`, the blog posts.
  - **`source/website/`** — the Next.js application, built on the host.
  - **`source/tooling/`** — the `Dockerfile`, the three build scripts that render
    `source/content/` into documents, and the loader they share.
- **`infrastructure/`** — one flat Terraform environment: the site S3 bucket,
  CloudFront, ACM, Route 53, and a budget alarm.
- **`scripts/`** — the shell scripts the npm scripts and workflows call.
- **`.github/workflows/`** — one workflow per task; see
  [the workflow table](./CONTRIBUTING.md#workflows).
- **`.claude/`** — `rules/`, path-scoped conventions, and `skills/`, one folder
  each.
- Community health files follow GitHub standards: `README.md`,
  `CONTRIBUTING.md`, `LICENSE-MIT.md` (code), and `LICENSE-CC-BY.md` (docs and
  blog posts).

## Rules that hold everywhere

- **Match the format and style of adjacent files** before adding or editing
  anything, and keep code comments minimal — state only the constraints the code
  cannot show.
- **Never edit a generated file**:
  `source/content/resume/versions.generated.json`,
  `source/website/SiegeSailor-README.md`, and every `export/` folder.
- **Everything under `source/website/app/` must stay statically exportable**: no
  Server Actions, no API routes, no request-time rendering.
- **Facts in `source/content/resume/` are verified.** Do not alter dates,
  rankings, or titles without explicit confirmation from Ken.
- **The resume must fit one US-Letter page and stay ATS-safe.** The full list is
  in [`source/content/resume/CLAUDE.md`](./source/content/resume/CLAUDE.md); the
  build verifies the page count and fails on a violation.
- **Commit through the [`commit`](./.claude/skills/commit/SKILL.md) skill** —
  one Conventional Commits line, no body, and the type drives the release, so a
  careless `feat:` cuts a minor version. See also
  [Commits and releases](./CONTRIBUTING.md#commits-and-releases).

## How the pieces connect

`source/content/resume/` feeds three outputs from one source, and each output
asks for itself by name:

| Consumer name         | Output                                       | Built by                                    |
| --------------------- | -------------------------------------------- | ------------------------------------------- |
| `resume`              | The one-page PDF/DOCX resume                 | `source/tooling/scripts/build-resume.mjs`   |
| `readme`              | The `SiegeSailor/SiegeSailor` profile README | `source/tooling/scripts/build-readme.mjs`   |
| `site`, `/`, `/about` | Every page's content and metadata            | `source/website/helpers/server/content.ts`  |
| `versions`            | The latest release per project               | `source/tooling/scripts/build-versions.mjs` |

A section leaves a document by dropping a name from a `consumers:` list, not by
editing a builder. What deliberately stays in code instead: section **order**
(ATS-sensitive, drives the one-page fit), the resume's typography, UI microcopy
(nav and button labels, search placeholder, callout and error-page copy), route
**paths** (they are typed routing, unlike route titles), the scraper lists,
`TECHNOLOGY_TO_ICON` and `MEDIA_TO_ICON` (they import React components), and the
HeroUI theme values.
