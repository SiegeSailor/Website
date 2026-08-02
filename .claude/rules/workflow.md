---
paths:
  - ".github/workflows/*.yml"
  - ".github/actions/**/action.yml"
---

# Writing a Workflow

One workflow does one task — a single job with a single outcome. When a second outcome appears, such as a deploy that also pushes a README, it becomes a second file.

| Workflow                                                       | Trigger                   | Task                                                                 |
| -------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------- |
| [`main-deploy.yml`](../../.github/workflows/main-deploy.yml)   | Push to `main`, or manual | Build, apply Terraform, sync to S3, invalidate CloudFront            |
| [`main-readme.yml`](../../.github/workflows/main-readme.yml)   | Push to `main`, or manual | Build the README and push it to `SiegeSailor/SiegeSailor` if changed |
| [`main-release.yml`](../../.github/workflows/main-release.yml) | Push to `main`, or manual | Run Semantic Release and attach the resume documents                 |
| [`push-verify.yml`](../../.github/workflows/push-verify.yml)   | Every push outside `main` | Format, lint, typecheck, and lint the `Dockerfile`                   |

The `production` environment carries the credentials both `main` deployments need:

- **Secrets**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `SIEGESAILOR_PAT`, a Personal Access Token with `contents: write` on `SiegeSailor/SiegeSailor` used only by the README sync
- **Variables**: `AWS_REGION`

Renaming a workflow breaks the table above and the badges in [`README.md`](../../README.md); update both in the same commit. Confirm the file parses before finishing:

```shell
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/<file>.yml','utf8')).name)"
```

## Naming

A run is identifiable from its title alone, with no trailing period on any field:

| Field       | Format                                  | Example                                |
| ----------- | --------------------------------------- | -------------------------------------- |
| Filename    | `<branch\|trigger>-<context>.yml`       | `main-deploy.yml`                      |
| `name`      | `<branch\|trigger>: <detailed context>` | `main: Deploy AWS static website`      |
| `run-name`  | `<name>` plus what identifies the run   | `main: Deploy <ref>@<sha> by @<actor>` |
| Job `name`  | Title Case, what the job produces       | `Build and Deploy`                     |
| Step `name` | Sentence case, imperative               | `Install dependencies`                 |

A `run-name` is fixed before the first step runs and can only read `github`, `inputs`, and `vars` — never a value the run computes. Anything resolved mid-run, such as a released version or a bucket name, goes to `$GITHUB_STEP_SUMMARY` instead, which is what `main-release.yml` does.

## Shared Steps

Every workflow opens the same way, and 2 of them run the same gates — `push-verify.yml` and `main-deploy.yml`, because nothing else guarantees the gates run at all: there is no branch protection and no pull request, so the deploy is the only check on what actually ships. Those steps live once, in [`.github/actions/`](../../.github/actions/), as composite actions:

| Action                                                                | Does                                                           | Used By     |
| --------------------------------------------------------------------- | -------------------------------------------------------------- | ----------- |
| [`setup-hadolint`](../../.github/actions/setup-hadolint/action.yml)   | Puts the pinned hadolint on the `PATH`                         | `verify`    |
| [`setup-workspace`](../../.github/actions/setup-workspace/action.yml) | `actions/setup-node` from `.nvmrc`, then `npm ci`              | All 4       |
| [`verify`](../../.github/actions/verify/action.yml)                   | `format:check`, `lint`, `typecheck`, and the `Dockerfile` lint | The 2 gates |

So a workflow reads `Checkout` → `Setup workspace` → its own work, with `Verify code quality and types` between them where the gates apply.

A composite action runs inside the calling job, so none of these costs a second runner or a second `npm ci` — which a reusable `workflow_call` would. 3 consequences are worth knowing before editing one:

- **`Checkout` Can Never Move into an Action**: The runner reads `action.yml` out of the checked-out repository, so a local action cannot run before it
- **Every `run` Step inside an Action Needs Its Own `shell: bash`**: A nested local action, the way `verify` calls `setup-hadolint`, is pathed from the repository root rather than from the action's folder
- **`verify` Installs Nothing, on Purpose**: `setup-workspace` owns the `node_modules` the deploy's own build needs, so removing or reordering the gates cannot break a later step

Actions are named the way GitHub's own are, `<action>-<technology>` (`setup-hadolint`, like `setup-node`), not the `<technology>-<action>` the [shell scripts](../../scripts/CONTRIBUTING.md) use. The hadolint version lives in that action's `version` input default and nowhere else in CI.

## What Every Workflow Carries

- The schema comment on line 1: `# yaml-language-server: $schema=https://json.schemastore.org/github-workflow.json`
- A `paths:` filter that includes the workflow's own file, so a change to it is exercised, plus `.github/actions/**` on `push-verify.yml`, the one workflow that exists to exercise the shared actions — the `main:` workflows deliberately omit it, and `main-deploy.yml` omits `.hadolint.yml` too, because a CI-only change must not deploy production or touch another repository
- A `concurrency.group` named after the workflow, with `cancel-in-progress: true` only where a superseded run is worthless and never on a deploy or a release
- The narrowest `permissions` the job needs, which is `contents: read` unless it writes
- `environment: production` whenever it reads a production secret
- `Setup workspace` directly after `Checkout`, never its own `actions/setup-node`, because that action owns the inputs and so no workflow pins a Node.js version
- Actions pinned to a major (`actions/checkout@v7`), tools to an exact version (`terraform_version: 1.14.1`)
