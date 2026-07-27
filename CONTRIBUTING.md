# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

Everything in this document applies to the whole repository. Rules that apply to
a single scope live with that scope — see the
[documentation map](./README.md#documentation).

The repository is one npm workspace. The root `package.json` owns the version
(bumped by semantic-release) and the only `package-lock.json`;
[`source/website/`](./source/website/) and [`source/tooling/`](./source/tooling/)
are the two member workspaces. **Every command runs from the repository root**,
which is also the Docker build context — the root scripts delegate into the
right workspace, so there is never a need to `cd` into one.

## Prerequisites

| Tool                                                   | Version   | Needed for                         |
| ------------------------------------------------------ | --------- | ---------------------------------- |
| [Node.js](https://nodejs.org/)                         | `26.5.0`  | Everything                         |
| npm                                                    | `11.17.0` | Everything                         |
| [Docker](https://www.docker.com/)                      | `29.4.0`  | Resume documents with pinned tools |
| [Hadolint](https://github.com/hadolint/hadolint)       | `2.14.0`  | Linting the `Dockerfile`           |
| [AWS CLI](https://aws.amazon.com/cli/)                 | `2.32.11` | Deploying by hand                  |
| [Terraform](https://developer.hashicorp.com/terraform) | `1.14.1`  | Deploying by hand                  |
| [TFLint](https://github.com/terraform-linters/tflint)  | `0.60.0`  | Deploying by hand                  |

Node and npm are pinned in [`.nvmrc`](./.nvmrc), required by every `engines`
field, read by CI, and matched by the Docker image. Run `nvm install` after
pulling a change to `.nvmrc`.

## Getting started

A single `npm ci` installs both workspaces from the root lockfile and, through
the `prepare` script, the Husky hook:

```shell
npm ci
npm run watch
```

`watch` runs every `watch:*` target concurrently through
[`run-parallel.sh`](./scripts/run-parallel.sh), so one terminal gives the dev
server plus a resume and profile README that rebuild whenever
`source/content/` changes. Output is interleaved and one Ctrl-C stops all of
them. `build` is the same kind of aggregate but sequential: it chains every
`build:*` target with `&&` in dependency order, starting with `build:versions`
because the other three read the JSON it writes.

Neither aggregate expands a glob — npm has no such feature — so **adding a
`build:*` or `watch:*` script means adding it to the aggregate too**.

## Commands

| Command                  | Does                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `npm ci`                 | Install both workspaces from the single lockfile                                    |
| `npm run watch`          | Every `watch:*` target at once, in one terminal                                     |
| `npm run watch:website`  | Development server only                                                             |
| `npm run watch:resume`   | Rebuild the resume documents on a `source/content/` change                          |
| `npm run watch:readme`   | Rebuild the profile README on a `source/content/` change                            |
| `npm run build`          | Every `build:*` target, in dependency order                                         |
| `npm run build:versions` | Latest GitHub release per project → `source/content/resume/versions.generated.json` |
| `npm run build:readme`   | `source/content/` → `source/tooling/export/SiegeSailor-README.md`                   |
| `npm run build:resume`   | `source/content/` → `source/tooling/export/resume/*.{docx,pdf}`                     |
| `npm run build:website`  | Static export to `source/website/export/`                                           |
| `npm run format`         | Prettier write; `format:check` verifies only                                        |
| `npm run lint`           | ESLint; `lint:fix` autofixes                                                        |
| `npm run typecheck`      | `tsc --noEmit`                                                                      |

The shell scripts are documented in [`scripts/`](./scripts/README.md), and the
Terraform commands in [`infrastructure/`](./infrastructure/CONTRIBUTING.md).

## Conventions

These standards are followed throughout:

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [GitHub Community Standards](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions)
- [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/)
- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style)
- [Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [AWS Tagging Best Practices and Strategies](https://docs.aws.amazon.com/tag-editor/latest/userguide/best-practices-and-strats.html),
  including
  [cost visibility](https://aws.amazon.com/blogs/aws-cloud-financial-management/gs-create-and-enforce-your-tagging-strategy-for-more-granular-cost-visibility/)

And these repository rules:

- Match the format and style of adjacent files before adding or editing
  anything.
- Keep code comments minimal — state only the constraints the code cannot show.
- Never edit a generated file. `source/content/resume/versions.generated.json`,
  `source/website/SiegeSailor-README.md`, and every `export/` folder are build
  output and git-ignored.

## Quality checks

Prettier owns formatting, ESLint owns correctness, and `tsc` owns types:

```shell
npm run format:check  # Prettier, verify only (what CI runs)
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
```

All three run automatically on `git commit` through a Husky `pre-commit` hook
that calls [lint-staged](https://github.com/lint-staged/lint-staged)
([`.lintstagedrc.mjs`](./.lintstagedrc.mjs)): staged files are formatted and
autofixed in place and re-staged, `tsc --noEmit` runs when a `.ts`/`.tsx` file
is staged, and the commit aborts if anything fails. Pass `--no-verify` to skip
the hook, or set `HUSKY=0` to stop installing it.

Prettier runs from the root and so also covers `source/tooling/` and the
Markdown; ESLint stays scoped to `source/website/`, where its config lives.
Authored content — all of `source/content/` — is excluded from Prettier so prose
and the hand-tuned resume source stay untouched. Terraform and the shell scripts
are covered by neither.

> [!important]
> Install from the root, not from inside a workspace.
> `cd source/website && npm ci` installs that workspace's tree without the root
> dev dependencies, so `prepare` finds no Husky and quietly skips the hook.

## Documentation

Each scope carries a `README.md` (what it is), a `CONTRIBUTING.md` (how to work
on it), and a `CLAUDE.md` (the rules that must not be broken). One rule:

> If a rule is true of two scopes, it belongs at the root and the scopes link to
> it.

That is why setup, commands, conventions, checks, commits, and workflows are all
here rather than restated per folder.

## Commits and releases

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with
one-line messages under 72 characters where possible. The type drives the
release: `fix:` cuts a patch, `feat:` a minor, `BREAKING CHANGE` a major, and
any other type cuts no release.

[semantic-release](https://semantic-release.gitbook.io/) — configured in
[`release.config.mjs`](./release.config.mjs) — runs on every push to `main` and:

- tags the commit `vX.Y.Z`, publishes a GitHub Release whose notes come from the
  commits, and commits the bumped `package.json` and `package-lock.json` back to
  `main`;
- builds the resume documents through
  [`docker-copy.sh`](./scripts/docker-copy.sh), stamping the version into the
  document metadata, and attaches them to the release.

There is no `CHANGELOG.md` and no `SECURITY.md`: issues and pull requests are
disabled on this repository, and the release notes live on the GitHub Release.
The repository is private, so a release asset URL only works for an
authenticated collaborator — the public link to the resume is the deployed
`https://jinyu-zhang.com/documents/<document>`, which is what the badges and the
profile page button point at.

## Workflows

One workflow does one task. Files are named `<branch|trigger>-<context>.yml` and
the `name` field reads `<branch|trigger>: <detailed context>`, so a run is
identifiable from its title alone.

| Workflow                                                                 | Trigger                                 | Task                                                                         |
| ------------------------------------------------------------------------ | --------------------------------------- | ---------------------------------------------------------------------------- |
| [`pull-request-verify.yml`](./.github/workflows/pull-request-verify.yml) | Pull requests and pushes outside `main` | Format, lint, and typecheck                                                  |
| [`main-deploy.yml`](./.github/workflows/main-deploy.yml)                 | Push to `main`, or manual               | Build, apply Terraform, sync to S3, invalidate CloudFront                    |
| [`main-profile.yml`](./.github/workflows/main-profile.yml)               | Push to `main`, or manual               | Build the profile README and push it to `SiegeSailor/SiegeSailor` if changed |
| [`main-release.yml`](./.github/workflows/main-release.yml)               | Push to `main`, or manual               | Run semantic-release and attach the resume documents                         |

The `production` environment carries the credentials both `main` deployments
need:

- **Secrets**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and
  `SIEGESAILOR_PAT` (a Personal Access Token with `contents: write` on
  `SiegeSailor/SiegeSailor`, used only by the profile README sync)
- **Variables**: `AWS_REGION`

A `run-name` carries the branch, the commit, and the actor. It is fixed before
the first step runs and cannot read a value computed during the run, so
`main-release.yml` reports the published version in the job summary instead.
