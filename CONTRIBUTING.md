# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

Everything in this document applies to the whole repository. Rules that apply to a single scope live with that scope — see [Scopes](#scopes).

The repository is one NPM workspace. The root `package.json` owns the version (bumped by semantic-release) and the only `package-lock.json`; [`source/website/`](./source/website/) and [`source/tooling/`](./source/tooling/) are the 2 member workspaces. **Every command runs from the repository root**, which is also the Docker build context — the root scripts delegate into the right workspace, so there is never a need to `cd` into one.

## Prerequisites

| Tool                                                   | Version   | Needed For                         |
| ------------------------------------------------------ | --------- | ---------------------------------- |
| [AWS CLI](https://aws.amazon.com/cli/)                 | `2.32.11` | Deploying by hand                  |
| [Docker](https://www.docker.com/)                      | `29.4.0`  | Resume documents with pinned tools |
| [hadolint](https://github.com/hadolint/hadolint)       | `2.14.0`  | Linting the `Dockerfile`           |
| [Node.js](https://nodejs.org/)                         | `26.5.0`  | Everything                         |
| NPM                                                    | `11.17.0` | Everything                         |
| [Terraform](https://developer.hashicorp.com/terraform) | `1.14.1`  | Deploying by hand                  |
| [TFLint](https://github.com/terraform-linters/tflint)  | `0.60.0`  | Deploying by hand                  |

Node.js and NPM are pinned in [`.nvmrc`](./.nvmrc), required by every `engines` field, read by CI, and matched by the Docker image. Run `nvm install` after pulling a change to `.nvmrc`.

## Scopes

The project is modularized into the following scopes:

| Scope                                  | Contents                                          |
| -------------------------------------- | ------------------------------------------------- |
| Root                                   | Shared setup, conventions, commits, and workflows |
| [`infrastructure/`](./infrastructure/) | The Terraform environment on AWS                  |
| [`scripts/`](./scripts/)               | The shell scripts the NPM scripts call            |
| [`source/content/`](./source/content/) | The authored resume source and articles           |
| [`source/tooling/`](./source/tooling/) | The document builders and their image             |
| [`source/website/`](./source/website/) | The Next.js application                           |

## Getting Started

A single `npm ci` installs both workspaces from the root lockfile and, through the `prepare` script, the Husky hook:

```shell
npm ci
npm run watch
```

`watch` runs every `watch:*` target concurrently through [`npm-parallel.sh`](./scripts/npm-parallel.sh), so one terminal gives the dev server plus a resume and Profile that rebuild whenever `source/content/` changes. Output is interleaved and one Ctrl-C stops all of them. `build` is the same kind of aggregate but sequential: it chains every `build:*` target with `&&` in dependency order, starting with `build:versions` because the other 3 read the JSON it writes.

Neither aggregate expands a glob — NPM has no such feature — so **adding a `build:*` or `watch:*` script means adding it to the aggregate too**.

## Commands

| Command                  | Does                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `npm ci`                 | Install both workspaces from the single lockfile                                    |
| `npm run build`          | Every `build:*` target, in dependency order                                         |
| `npm run build:profile`  | `source/content/` → `source/tooling/export/SiegeSailor-README.md`                   |
| `npm run build:resume`   | `source/content/` → `source/tooling/export/resume/*.{docx,pdf}`                     |
| `npm run build:versions` | Latest GitHub release per project → `source/content/resume/versions.generated.json` |
| `npm run build:website`  | Static export to `source/website/export/`                                           |
| `npm run format`         | Prettier write; `format:check` verifies only                                        |
| `npm run lint`           | ESLint; `lint:fix` autofixes                                                        |
| `npm run typecheck`      | `tsc --noEmit`                                                                      |
| `npm run watch`          | Every `watch:*` target at once, in one terminal                                     |
| `npm run watch:profile`  | Rebuild the Profile on a `source/content/` change                                   |
| `npm run watch:resume`   | Rebuild the resume documents on a `source/content/` change                          |
| `npm run watch:website`  | Development server only                                                             |

The shell scripts are documented in [`scripts/README.md`](./scripts/README.md), and the Terraform commands in [`infrastructure/CONTRIBUTING.md`](./infrastructure/CONTRIBUTING.md).

### Adding a Command

A new `build:<name>` or `watch:<name>` touches 4 places, and one missed step is silent — an unlisted variant simply never runs:

1. The workspace `package.json`, where the script actually runs
2. The root `package.json`, delegating with `npm run <script> --workspace source/<workspace>`, because root scripts delegate and never implement
3. The root aggregate: `build` chains with `&&` in dependency order and `build:versions` stays first, because the others read the JSON it writes, while `watch` passes its targets to `scripts/npm-parallel.sh`
4. The table above

Version fields belong to semantic-release; never bump one by hand.

## Conventions

These standards are followed throughout:

- [AWS Tagging Best Practices and Strategies](https://docs.aws.amazon.com/tag-editor/latest/userguide/best-practices-and-strats.html), including [cost visibility](https://aws.amazon.com/blogs/aws-cloud-financial-management/gs-create-and-enforce-your-tagging-strategy-for-more-granular-cost-visibility/), on every deployed resource
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) on every commit message
- [GitHub Community Standards](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions) on the community health files
- [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) on the JavaScript, TypeScript, and Markdown
- [Shell Style Guide](https://google.github.io/styleguide/shellguide.html) on the shell scripts
- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style) on `infrastructure/`

And these repository rules:

- **Keep Code Comments Minimal**: State only the constraints the code cannot show
- **Match Adjacent Files**: Follow the format and style of the files beside what is being added or edited

The documents follow [`.claude/rules/documentation.md`](./.claude/rules/documentation.md), which owns which document a fact belongs to and the writing style all of them share.

### Generated Files

Never edit one. All of these are git-ignored build output, so an edit survives until the next build and then disappears, taking the reason for it with it — change the input and rebuild instead.

| Path                                            | Written By                                        | Rebuild With                                    |
| ----------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| `source/content/resume/versions.generated.json` | `source/tooling/scripts/build-versions.mjs`       | `npm run build:versions`                        |
| `source/tooling/export/`                        | The document builders                             | `npm run build:resume`, `npm run build:profile` |
| `source/website/SiegeSailor-README.md`          | `scripts/docker-copy.sh`, copied out of the image | `bash scripts/docker-copy.sh`                   |
| `source/website/export/`                        | `next build`                                      | `npm run build:website`                         |

## Quality Checks

Prettier owns formatting, ESLint owns correctness, `tsc` owns types, and hadolint owns the `Dockerfile`:

```shell
npm run format:check         # Prettier, verify only (what CI runs)
npm run lint                 # ESLint
npm run typecheck            # tsc --noEmit
bash scripts/hadolint.sh     # hadolint on source/tooling/Dockerfile
```

The first 3 run automatically on `git commit` through a Husky `pre-commit` hook that calls [lint-staged](https://github.com/lint-staged/lint-staged) ([`.lintstagedrc.mjs`](./.lintstagedrc.mjs)): staged files are formatted and autofixed in place and re-staged, `tsc --noEmit` runs when a `.ts` or `.tsx` file is staged, and the commit aborts if anything fails. Pass `--no-verify` to skip the hook, or set `HUSKY=0` to stop installing it.

The `Dockerfile` lint stays out of the hook — hadolint is a system binary rather than a dependency, so a machine without it would fail every commit. Both workflows install a pinned version and run it, so a violation fails CI instead.

Prettier runs from the root and so also covers `source/tooling/` and the Markdown; ESLint stays scoped to `source/website/`, where its config lives. Authored content — all of `source/content/` — is excluded from Prettier so prose and the hand-tuned resume source stay untouched. Terraform and the shell scripts are covered by neither.

> [!important]
> Install from the root, not from inside a workspace. `cd source/website && npm ci` installs that workspace's tree without the root dev dependencies, so `prepare` finds no Husky and quietly skips the hook.

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

There is no `CHANGELOG.md` and no `SECURITY.md`: issues and pull requests are disabled on this repository, and the release notes live on the GitHub Release. The repository is private, so a release asset URL only works for an authenticated collaborator — the public link to the resume is the deployed `https://jinyu-zhang.com/documents/<document>`, which is what the badges and the `/about` page button point at.

## Workflows

One workflow does one task — a single job with a single outcome. When a second outcome appears, such as a deploy that also pushes a README, it becomes a second file.

| Workflow                                                   | Trigger                   | Task                                                                  |
| ---------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------- |
| [`main-deploy.yml`](./.github/workflows/main-deploy.yml)   | Push to `main`, or manual | Build, apply Terraform, sync to S3, invalidate CloudFront             |
| [`main-profile.yml`](./.github/workflows/main-profile.yml) | Push to `main`, or manual | Build the Profile and push it to `SiegeSailor/SiegeSailor` if changed |
| [`main-release.yml`](./.github/workflows/main-release.yml) | Push to `main`, or manual | Run semantic-release and attach the resume documents                  |
| [`push-verify.yml`](./.github/workflows/push-verify.yml)   | Every push outside `main` | Format, lint, typecheck, and lint the `Dockerfile`                    |

The `production` environment carries the credentials both `main` deployments need:

- **Secrets**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `SIEGESAILOR_PAT`, a Personal Access Token with `contents: write` on `SiegeSailor/SiegeSailor` used only by the Profile sync
- **Variables**: `AWS_REGION`

### Naming

A run is identifiable from its title alone, with no trailing period on any field:

| Field       | Format                                  | Example                                |
| ----------- | --------------------------------------- | -------------------------------------- |
| Filename    | `<branch\|trigger>-<context>.yml`       | `main-deploy.yml`                      |
| `name`      | `<branch\|trigger>: <detailed context>` | `main: Deploy AWS static website`      |
| `run-name`  | `<name>` plus what identifies the run   | `main: Deploy <ref>@<sha> by @<actor>` |
| Job `name`  | Title Case, what the job produces       | `Build and Deploy`                     |
| Step `name` | Sentence case, imperative               | `Install dependencies`                 |

A `run-name` is fixed before the first step runs and can only read `github`, `inputs`, and `vars` — never a value the run computes. Anything resolved mid-run, such as a released version or a bucket name, goes to `$GITHUB_STEP_SUMMARY` instead, which is what `main-release.yml` does.

### Shared Steps

Every workflow opens the same way, and 2 of them run the same gates — `push-verify.yml` and `main-deploy.yml`, because nothing else guarantees the gates run at all: there is no branch protection and no pull request, so the deploy is the only check on what actually ships. Those steps live once, in [`.github/actions/`](./.github/actions/), as composite actions:

| Action                                                            | Does                                                           | Used By     |
| ----------------------------------------------------------------- | -------------------------------------------------------------- | ----------- |
| [`setup-hadolint`](./.github/actions/setup-hadolint/action.yml)   | Puts the pinned hadolint on the `PATH`                         | `verify`    |
| [`setup-workspace`](./.github/actions/setup-workspace/action.yml) | `actions/setup-node` from `.nvmrc`, then `npm ci`              | All 4       |
| [`verify`](./.github/actions/verify/action.yml)                   | `format:check`, `lint`, `typecheck`, and the `Dockerfile` lint | The 2 gates |

So a workflow reads `Checkout` → `Setup workspace` → its own work, with `Verify code quality and types` between them where the gates apply.

A composite action runs inside the calling job, so none of these costs a second runner or a second `npm ci` — which a reusable `workflow_call` would. 3 consequences are worth knowing before editing one:

- **`Checkout` Can Never Move into an Action**: The runner reads `action.yml` out of the checked-out repository, so a local action cannot run before it
- **`verify` Installs Nothing, on Purpose**: `setup-workspace` owns the `node_modules` the deploy's own build needs, so removing or reordering the gates cannot break a later step
- **Every `run` Step inside an Action Needs Its Own `shell: bash`**: A nested local action, the way `verify` calls `setup-hadolint`, is pathed from the repository root rather than from the action's folder

Actions are named the way GitHub's own are, `<action>-<technology>` (`setup-hadolint`, like `setup-node`), not the `<technology>-<action>` the [shell scripts](./scripts/CONTRIBUTING.md) use. The hadolint version lives in that action's `version` input default and nowhere else in CI.

### What Every Workflow Carries

- The schema comment on line 1: `# yaml-language-server: $schema=https://json.schemastore.org/github-workflow.json`
- A `paths:` filter that includes the workflow's own file, so a change to it is exercised, plus `.github/actions/**` on `push-verify.yml`, the one workflow that exists to exercise the shared actions — the `main:` workflows deliberately omit it, and `main-deploy.yml` omits `.hadolint.yml` too, because a CI-only change must not deploy production or touch another repository
- A `concurrency.group` named after the workflow, with `cancel-in-progress: true` only where a superseded run is worthless and never on a deploy or a release
- The narrowest `permissions` the job needs, which is `contents: read` unless it writes
- `environment: production` whenever it reads a production secret
- `Setup workspace` directly after `Checkout`, never its own `actions/setup-node`, because that action owns the inputs and so no workflow pins a Node.js version
- Actions pinned to a major (`actions/checkout@v7`), tools to an exact version (`terraform_version: 1.14.1`)

Renaming a workflow breaks the table above and the badges in [`README.md`](./README.md); update both in the same commit.
