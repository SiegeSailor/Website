# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site served from S3 behind CloudFront. This file is the map; [`README.md`](./README.md) says what the project is and [`CONTRIBUTING.md`](./CONTRIBUTING.md) how to work in it.

Path-scoped conventions live in [`.claude/rules/`](./.claude/rules/); read the ones whose `paths:` match the files being edited.

## Repository Layout

The repository is one NPM workspace:

- [`/`](./): `package.json` owns the version and the only `package-lock.json`
  - [`source/`](./source/): the sole member workspace — the Next.js application
    - [`source/articles/`](./source/articles/): the posts, as Markdown read from disk at build time
    - [`source/settings/content.ts`](./source/settings/content.ts): every other word the site renders, as plain typed constants

## Scopes

Besides the workspace and standard folders, e.g., `.github/` and `.husky/`, the project is modularized into scopes, and a scope's must-not-break rules live in its `CLAUDE.md`. Each is named for the folder it lives in, and lends its **Commit Scope** to the `<scope>` of a commit message:

| Scope                                  | Commit Scope     | Contents                                                    |
| -------------------------------------- | ---------------- | ----------------------------------------------------------- |
| [`/`](./)                              | -                | Shared setup, the rules, the skills, and the CI workflows   |
| [`infrastructure/`](./infrastructure/) | `infrastructure` | The Terraform environment on AWS for static file deployment |
| [`scripts/`](./scripts/)               | `scripts`        | The shell scripts the workflows and the operator call       |
| [`source/`](./source/)                 | `website`        | The Next.js application, its posts, and its copy            |

> [!note]
> Read a scope's `CLAUDE.md` before editing anything inside it. A change that spans scopes takes no `<scope>`, the way a change to the root takes none.

## Profile Facts Live Elsewhere

The résumé, the GitHub profile README, and the facts behind them live in [`SiegeSailor/SiegeSailor`](https://github.com/SiegeSailor/SiegeSailor), not here. This repository holds only what the website renders, and it renders constants — there is no content loader, no `consumers:` tagging, and nothing fetched at build time but the posts.

When profile facts change there, bring them across with the [`update-website`](./.claude/skills/update-website/SKILL.md) skill rather than editing `settings/content.ts` from memory.

## Universal Rules

These are rules that hold everywhere. Each is stated in full where it is linked; none may be broken on the way to finishing something else:

| Stated In                                                | Rule                                               |
| -------------------------------------------------------- | -------------------------------------------------- |
| [`infrastructure/CLAUDE.md`](./infrastructure/CLAUDE.md) | Never apply Terraform without confirmation         |
| [`source/CLAUDE.md`](./source/CLAUDE.md)                 | Keep everything under `app/` statically exportable |

Commit messages follow the `conventional-commit` skill from [`SiegeSailor/Claude-Plugins`](https://github.com/SiegeSailor/Claude-Plugins), which reads the scope table above.
