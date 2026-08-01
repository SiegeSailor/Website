# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site served from S3 behind CloudFront, plus a single-source resume and Profile build system. This file is the map; [`README.md`](./README.md) says what the project is and [`CONTRIBUTING.md`](./CONTRIBUTING.md) how to work in it, including every command, convention, check, commit rule, and workflow.

## Where the Rules Live

[`.claude/rules/documentation.md`](./.claude/rules/documentation.md) owns which document a sentence belongs to and the style every document follows: a fact that belongs to more than one document moves into a rule, and the documents link to it. **So every `CLAUDE.md` below is a pointer plus the few rules that have no other home — read the `CONTRIBUTING.md` it names before editing that scope.**

| Scope                                           | Read Before Touching                               |
| ----------------------------------------------- | -------------------------------------------------- |
| [`infrastructure/`](./infrastructure/CLAUDE.md) | Terraform and anything deployed to AWS             |
| [`scripts/`](./scripts/CLAUDE.md)               | The shell scripts                                  |
| [`source/content/`](./source/content/CLAUDE.md) | Any authored content                               |
| [`source/tooling/`](./source/tooling/CLAUDE.md) | The document builders, their loader, and the image |
| [`source/website/`](./source/website/CLAUDE.md) | The Next.js application                            |

Conventions that follow a **file type across scopes** are path-scoped rules in [`.claude/rules/`](./.claude/rules/), loaded only when a matching file is opened. Each one names the document that owns it:

| Rule                                                     | Loads For                                                              |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`content-loader.md`](./.claude/rules/content-loader.md) | The 2 loaders that must stay in step                                   |
| [`documentation.md`](./.claude/rules/documentation.md)   | Any `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, and `.claude/**/*.md` |
| [`generated-file.md`](./.claude/rules/generated-file.md) | Build output that must never be edited                                 |
| [`npm-script.md`](./.claude/rules/npm-script.md)         | Any `package.json`                                                     |
| [`shell-script.md`](./.claude/rules/shell-script.md)     | Any `*.sh` and the Husky hooks                                         |
| [`workflow.md`](./.claude/rules/workflow.md)             | `.github/workflows/*.yml` and `.github/actions/`                       |

## Repository Layout

The repository is an NPM workspace: the root `package.json` owns the version and the single `package-lock.json`; `source/website/` and `source/tooling/` are the 2 member workspaces, and `source/content/` is plain data shared by both.

| Path              | Holds                                                                                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.claude/`        | `rules/`, path-scoped conventions, and `skills/`, one folder each                                                                                                                   |
| `.github/`        | `workflows/`, one workflow per task, and `actions/`, the composite actions they share — [the table](./CONTRIBUTING.md#workflows) and [shared steps](./CONTRIBUTING.md#shared-steps) |
| `infrastructure/` | One flat Terraform environment: the site S3 bucket, CloudFront, ACM, Route 53, and a budget alarm                                                                                   |
| `scripts/`        | The shell scripts the NPM scripts and workflows call                                                                                                                                |
| `source/content/` | All authored content: `resume/`, the single source of truth for the resume, the whole website, and the Profile, and `articles/`, the articles                                       |
| `source/tooling/` | The `Dockerfile`, the 3 build scripts that render `source/content/` into documents, and the loader they share                                                                       |
| `source/website/` | The Next.js application, built on the host                                                                                                                                          |

The 3 authored folders are nested under `source/` so they stay adjacent in a file tree, and nothing else lives there. They also keep their sibling relationship: the website reaches `../content/`, and the tooling scripts reach `../../content/resume/`. Community health files follow GitHub standards at the root: `README.md`, `CONTRIBUTING.md`, `LICENSE-MIT.md` for code, and `LICENSE-CC-BY.md` for documents and articles.

`source/content/resume/` feeds 4 outputs, and each asks for itself by name in a `consumers:` list, so a section leaves a document without a builder edit. The consumers and the file map are in [`source/content/README.md`](./source/content/README.md).

## Rules That Hold Everywhere

Each of these is stated in full where it is linked; none may be broken on the way to finishing something else.

| Rule                                                                            | Stated In                                                                                                |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Change a verified fact in `source/content/resume/` only with Ken's confirmation | [`source/content/CONTRIBUTING.md`](./source/content/CONTRIBUTING.md)                                     |
| Commit through the `commit` skill: one Conventional Commits line, no body       | [`.claude/skills/commit/SKILL.md`](./.claude/skills/commit/SKILL.md)                                     |
| Keep everything under `source/website/app/` statically exportable               | [`source/website/CONTRIBUTING.md`](./source/website/CONTRIBUTING.md#staying-statically-exportable)       |
| Keep the resume on one US-Letter page and ATS-safe                              | [`source/content/resume/CLAUDE.md`](./source/content/resume/CLAUDE.md#constraints-that-must-never-break) |
| Match the format and style of adjacent files, and keep code comments minimal    | [`CONTRIBUTING.md`](./CONTRIBUTING.md#conventions)                                                       |
| Never apply Terraform without confirmation                                      | [`infrastructure/CLAUDE.md`](./infrastructure/CLAUDE.md)                                                 |
| Never edit a generated file                                                     | [`CONTRIBUTING.md`](./CONTRIBUTING.md#generated-files)                                                   |
