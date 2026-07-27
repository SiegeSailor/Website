---
paths:
  - ".github/workflows/*.yml"
---

# Writing a workflow

## One workflow, one task

A workflow does a single job with a single outcome. When a second outcome
appears — a deploy that also pushes a README — it becomes a second file.

## Naming

| Field       | Format                                  | Example                                |
| ----------- | --------------------------------------- | -------------------------------------- |
| Filename    | `<branch\|trigger>-<context>.yml`       | `main-deploy.yml`                      |
| `name`      | `<branch\|trigger>: <detailed context>` | `main: Deploy AWS static website`      |
| `run-name`  | `<name>` plus what identifies the run   | `main: Deploy <ref>@<sha> by @<actor>` |
| Job `name`  | Title Case, what the job produces       | `Build and Deploy`                     |
| Step `name` | Sentence case, imperative               | `Install dependencies`                 |

**No trailing period on any of them.**

A `run-name` is fixed before the first step runs and can only read `github`,
`inputs`, and `vars` — never a value the run computes. Report anything resolved
mid-run (a released version, a bucket name) to `$GITHUB_STEP_SUMMARY` instead.

## Every file carries

- The schema comment on line 1:
  `# yaml-language-server: $schema=https://json.schemastore.org/github-workflow.json`
- A `paths:` filter that includes the workflow's own file, so a change to it is
  exercised.
- A `concurrency.group` named after the workflow. `cancel-in-progress: true`
  only where a superseded run is worthless; never on a deploy or a release.
- The narrowest `permissions` the job needs — `contents: read` unless it writes.
- `environment: production` whenever it reads a production secret.
- `actions/setup-node` with `node-version-file: .nvmrc`, `cache: npm`, and
  `cache-dependency-path: package-lock.json`. Never pin a Node version here.
- Actions pinned to a major (`actions/checkout@v7`), tools to an exact version
  (`terraform_version: 1.14.1`).

## Before finishing

Confirm the file parses and reads the way the title claims:

```shell
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('.github/workflows/<file>.yml','utf8')).name)"
```

Then update the workflow table in [`CONTRIBUTING.md`](../../CONTRIBUTING.md#workflows)
and the badges in [`README.md`](../../README.md); a renamed file breaks both.
