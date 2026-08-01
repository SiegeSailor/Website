# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site served from S3 behind CloudFront, plus a single-source resume and README build system. This file is the map; [`README.md`](./README.md) says what the project is and [`CONTRIBUTING.md`](./CONTRIBUTING.md) how to work in it, including the prerequisites, the scopes, the rules, and the commit convention.

## Repository Layout

The repository is an NPM workspace: the root `package.json` owns the version and the single `package-lock.json`; `source/website/` and `source/tooling/` are the 2 member workspaces, and `source/content/` is plain data shared by both. Beyond [the scopes](./.claude/rules/documentation.md#scopes), 2 folders carry no documents of their own:

- **`.claude/`**: `rules/`, path-scoped conventions, and `skills/`, one folder each
- **`.github/`**: `workflows/`, one workflow per task, and `actions/`, the composite actions they share, both owned by [`workflow.md`](./.claude/rules/workflow.md)

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
| Match the format and style of adjacent files, and keep code comments minimal    | [`.claude/rules/conventions.md`](./.claude/rules/conventions.md)                                         |
| Never apply Terraform without confirmation                                      | [`infrastructure/CLAUDE.md`](./infrastructure/CLAUDE.md)                                                 |
| Never edit a generated output                                                   | [`.claude/rules/outputs.md`](./.claude/rules/outputs.md)                                                 |
