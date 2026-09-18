# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

**Every command runs from the repository root.** The root scripts delegate into the `source` workspace, so there is never a need to `cd` into it.

> [!note]
> [`CLAUDE.md`](./CLAUDE.md#repository-layout) explains the NPM workspace structure and the repository layout.

> [!important]
> Versions are bumped by Semantic Release automatically in [`main-release.yml`](./.github/workflows/main-release.yml).

## Prerequisites

| Tool                                                   | Version   | Needed For        |
| ------------------------------------------------------ | --------- | ----------------- |
| [AWS CLI](https://aws.amazon.com/cli/)                 | `2.32.11` | Deploying by hand |
| [Node.js](https://nodejs.org/)                         | `26.5.0`  | Everything        |
| [NPM](https://www.npmjs.com/)                          | `11.17.0` | Everything        |
| [Terraform](https://developer.hashicorp.com/terraform) | `1.14.1`  | Deploying by hand |
| [TFLint](https://github.com/terraform-linters/tflint)  | `0.60.0`  | Deploying by hand |

> [!note]
> Node.js and NPM are pinned in [`.nvmrc`](./.nvmrc), required by every `engines` field, and read by CI. Run `nvm install` after pulling a change to `.nvmrc`.

## Getting Started

`npm ci` installs the `source` workspace from the root lockfile and, through the `prepare` script, the Husky hook:

```shell
npm ci
npm run watch
```

> [!important]
> Install from the root, not from inside a workspace. `cd source && npm ci` installs that workspace's tree without the root dev dependencies, so `prepare` finds no Husky and quietly skips the hook.
