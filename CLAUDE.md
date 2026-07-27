# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site
served from S3 behind CloudFront, plus a single-source resume and profile build
system. This file is the map; [`README.md`](./README.md) says what the project
is and [`CONTRIBUTING.md`](./CONTRIBUTING.md) how to work in it, including every
command, convention, check, commit rule, and workflow.

## Where the rules live

Each scope carries three documents: `README.md` (what it is),
`CONTRIBUTING.md` (how to work on it), and `CLAUDE.md` (what must not break).
Two rules decide where a sentence goes, both stated in
[`CONTRIBUTING.md`](./CONTRIBUTING.md#documentation):

- A rule true of **two scopes** belongs at the root, linked from both.
- A rule true of a `CONTRIBUTING.md` **and** a `CLAUDE.md` belongs to the
  `CONTRIBUTING.md`. **So every `CLAUDE.md` below is a pointer plus the few
  rules that have no other home — read the `CONTRIBUTING.md` it names before
  editing that scope.**

| Scope                                           | Read before touching                               |
| ----------------------------------------------- | -------------------------------------------------- |
| [`source/website/`](./source/website/CLAUDE.md) | The Next.js application                            |
| [`source/tooling/`](./source/tooling/CLAUDE.md) | The document builders, their loader, and the image |
| [`source/content/`](./source/content/CLAUDE.md) | Any authored content                               |
| [`infrastructure/`](./infrastructure/CLAUDE.md) | Terraform and anything deployed to AWS             |
| [`scripts/`](./scripts/CLAUDE.md)               | The shell scripts                                  |

Conventions that follow a **file type across scopes** are path-scoped rules in
[`.claude/rules/`](./.claude/rules/), loaded only when a matching file is
opened. Each one names the document that owns it:

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

`source/content/resume/` feeds four outputs, and each asks for itself by name in
a `consumers:` list, so a section leaves a document without a builder edit. The
consumers and the file map are in
[`source/content/README.md`](./source/content/README.md).

## Rules that hold everywhere

Each of these is stated in full where it is linked; none may be broken on the
way to finishing something else.

- **Match the format and style of adjacent files**, and keep code comments
  minimal — [conventions](./CONTRIBUTING.md#conventions).
- **Never edit a generated file** —
  [the list](./CONTRIBUTING.md#generated-files).
- **Everything under `source/website/app/` must stay statically exportable** —
  [why](./source/website/CONTRIBUTING.md#staying-statically-exportable).
- **The facts in `source/content/resume/` are verified**; dates, rankings, and
  titles change only with Ken's confirmation —
  [detail](./source/content/CONTRIBUTING.md).
- **The resume must fit one US-Letter page and stay ATS-safe** —
  [the constraints](./source/content/resume/CLAUDE.md#constraints-that-must-never-break).
- **Never apply Terraform without confirmation** —
  [infrastructure](./infrastructure/CLAUDE.md).
- **Commit through the [`commit`](./.claude/skills/commit/SKILL.md) skill** —
  one Conventional Commits line, no body, and the type drives the release.
