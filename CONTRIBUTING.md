# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

The repository is one NPM workspace:

- [`/`](./): `package.json` owns the version and the only `package-lock.json`
  - [`source/website/`](./source/website/)
  - [`source/tooling/`](./source/tooling/)

**Every command runs from the repository root**, which is also the Docker build context. the root scripts delegate into the right workspace, so there is never a need to `cd` into one.

> [!important]
> Versions are bumped by Semantic Release automatically in [`main-release.yml`](./.github/workflows/main-release.yml).

### Prerequisites

| Tool                                                   | Version   | Needed For                         |
| ------------------------------------------------------ | --------- | ---------------------------------- |
| [AWS CLI](https://aws.amazon.com/cli/)                 | `2.32.11` | Deploying by hand                  |
| [Docker](https://www.docker.com/)                      | `29.4.0`  | Resume documents with pinned tools |
| [hadolint](https://github.com/hadolint/hadolint)       | `2.14.0`  | Linting the `Dockerfile`           |
| [Node.js](https://nodejs.org/)                         | `26.5.0`  | Everything                         |
| [NPM](https://www.npmjs.com/)                          | `11.17.0` | Everything                         |
| [Terraform](https://developer.hashicorp.com/terraform) | `1.14.1`  | Deploying by hand                  |
| [TFLint](https://github.com/terraform-linters/tflint)  | `0.60.0`  | Deploying by hand                  |

> [!note]
> Node.js and NPM are pinned in [`.nvmrc`](./.nvmrc), required by every `engines` field, read by CI, and matched by the Docker image. Run `nvm install` after pulling a change to `.nvmrc`.

### Scopes

The project is modularized into the following scopes:

| Scope                                  | Contents                                                       |
| -------------------------------------- | -------------------------------------------------------------- |
| [`/`](./)                              | Shared setup, the rules, and the commit convention             |
| [`infrastructure/`](./infrastructure/) | The Terraform environment on AWS for static file deployment    |
| [`scripts/`](./scripts/)               | The shell scripts the NPM scripts call                         |
| [`source/content/`](./source/content/) | Source of truth for articles, articles and resume              |
| [`source/tooling/`](./source/tooling/) | The Resume and GitHub document builders and their Docker image |
| [`source/website/`](./source/website/) | The Next.js application                                        |

## Getting Started

A single `npm ci` installs both workspaces from the root lockfile and, through the `prepare` script, the Husky hook:

```shell
npm ci
npm run watch
```

> [!important]
> Install from the root, not from inside a workspace. `cd source/website && npm ci` installs that workspace's tree without the root dev dependencies, so `prepare` finds no Husky and quietly skips the hook.

`watch` runs every `watch:*` target concurrently through [`npm-parallel.sh`](./scripts/npm-parallel.sh), so one terminal gives the dev server plus a resume and README that rebuild whenever `source/content/` changes. Output is interleaved and one Ctrl-C stops all of them. `build` is the same kind of aggregate but sequential: it chains every `build:*` target with `&&` in dependency order, starting with `build:versions` because the other 3 read the JSON it writes.

Neither aggregate expands a glob — NPM has no such feature — so **adding a `build:*` or `watch:*` script means adding it to the aggregate too**.

## Commits and Releases

A commit message is one [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) line and nothing else:

```text
<type>(<scope>)?: <subject>
```

| Rule                                    | Detail                                                                        |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| No body, no footer, no trailers         | The subject is the whole message                                              |
| One concern per commit                  | Split by concern rather than by file, even when the work was a single task    |
| Scope only when it sharpens the subject | Most commits need none                                                        |
| Under 72 characters                     | Type included, imperative mood, lowercase after the colon, no trailing period |

The type decides the release, so a careless one publishes a version:

| Type                                                       | Release |
| ---------------------------------------------------------- | ------- |
| `feat`                                                     | minor   |
| `fix`                                                      | patch   |
| `feat!`, `fix!` (any type with `!`)                        | major   |
| `refactor`, `docs`, `ci`, `chore`, `test`, `style`, `perf` | none    |

Mark a breaking change with `!` after the type rather than a `BREAKING CHANGE:` footer, which would need a body.

[semantic-release](https://semantic-release.gitbook.io/) — configured in [`release.config.mjs`](./release.config.mjs) — runs on every push to `main`, where it tags the commit `vX.Y.Z`, publishes a GitHub Release whose notes come from the commits, and commits the bumped `package.json` and `package-lock.json` back to `main`. It then builds the resume documents through [`docker-copy.sh`](./scripts/docker-copy.sh), stamping the version into the document metadata, and attaches them to the release.

There is no `CHANGELOG.md` and no `SECURITY.md`: issues and pull requests are disabled on this repository, and the release notes live on the GitHub Release. The repository is private, so a release asset URL only works for an authenticated collaborator — the public link to the resume is the deployed `https://jinyu-zhang.com/documents/<document>`, which is what the badges and the profile page button point at.
