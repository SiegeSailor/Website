# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

**Every command runs from the repository root**, which is also the Docker build context. The root scripts delegate into the right workspace, so there is never a need to `cd` into one.

> [!note]
> [`CLAUDE.md`](./CLAUDE.md#repository-layout) explains the NPM workspace structure and the repository layout.

> [!important]
> Versions are bumped by Semantic Release automatically in [`main-release.yml`](./.github/workflows/main-release.yml).

## Prerequisites

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

## Getting Started

A single `npm ci` installs both workspaces from the root lockfile and, through the `prepare` script, the Husky hook:

```shell
npm ci
npm run watch
```

> [!important]
> Install from the root, not from inside a workspace. `cd source/website && npm ci` installs that workspace's tree without the root dev dependencies, so `prepare` finds no Husky and quietly skips the hook.
