# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site served from S3 behind CloudFront, plus a single-source resume and README build system. This file is the map; [`README.md`](./README.md) says what the project is and [`CONTRIBUTING.md`](./CONTRIBUTING.md) how to work in it.

Path-scoped conventions live in [`.claude/rules/`](./.claude/rules/); read the ones whose `paths:` match the files being edited.

## Repository Layout

The repository is one NPM workspace:

- [`/`](./): `package.json` owns the version and the only `package-lock.json`
  - [`source/`](./source/)
    - [`source/content/`](./source/content/): Plain data shared by the 2 member workspaces
    - [`source/tooling/`](./source/tooling/): Member workspace
    - [`source/website/`](./source/website/): Member workspace

## Scopes

Besides the workspaces and standard folders, e.g., `.github/` and `.husky/`, the project is modularized into scopes, and a scope's must-not-break rules live in its `CLAUDE.md`. Each is named for the folder it lives in, and lends its **Commit Scope** to the `<scope>` of a commit message:

| Scope                                  | Commit Scope     | Contents                                                    |
| -------------------------------------- | ---------------- | ----------------------------------------------------------- |
| [`/`](./)                              | -                | Shared setup, the rules, the skills, and the CI workflows   |
| [`infrastructure/`](./infrastructure/) | `infrastructure` | The Terraform environment on AWS for static file deployment |
| [`scripts/`](./scripts/)               | `scripts`        | The shell scripts the NPM scripts and the workflows call    |
| [`source/content/`](./source/content/) | `content`        | Source of truth for articles, resume, and README            |
| [`source/tooling/`](./source/tooling/) | `tooling`        | The resume and README builders and their Docker image       |
| [`source/website/`](./source/website/) | `website`        | The Next.js application                                     |

> [!note]
> Read a scope's `CLAUDE.md` before editing anything inside it. A change that spans scopes takes no `<scope>`, the way a change to the root takes none.

## Universal Rules

These are rules that hold everywhere. Each is stated in full where it is linked; none may be broken on the way to finishing something else:

| Stated In                                                            | Rule                                               |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| [`.claude/skills/commit/SKILL.md`](./.claude/skills/commit/SKILL.md) | Commit through the skill                           |
| [`infrastructure/CLAUDE.md`](./infrastructure/CLAUDE.md)             | Never apply Terraform without confirmation         |
| [`source/content/CLAUDE.md`](./source/content/CLAUDE.md)             | Never change a verified fact without confirmation  |
| [`source/website/CLAUDE.md`](./source/website/CLAUDE.md)             | Keep everything under `app/` statically exportable |
