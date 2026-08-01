# scripts

The shell scripts the NPM scripts and the workflows call. Each one does a single job that would be awkward as an NPM script: driving Docker, supervising parallel processes, or fanning out HTTP requests. Every name reads `<technology>-<action>.sh` — the action left off where the tool has only one — so the file says which tool it drives before it is opened.

| Script                                       | Does                                                                        | Called By                           |
| -------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| [`cloudfront-warm.sh`](./cloudfront-warm.sh) | Requests every page in the deployed sitemap so CloudFront caches it again   | By hand                             |
| [`docker-copy.sh`](./docker-copy.sh)         | Builds the tooling image and copies the resume documents and the README out | `main-deploy.yml`, semantic-release |
| [`hadolint.sh`](./hadolint.sh)               | Runs hadolint on `source/tooling/Dockerfile`                                | The `verify` action                 |
| [`npm-parallel.sh`](./npm-parallel.sh)       | Runs several root NPM scripts at once in one terminal                       | `npm run watch`                     |

## Usage

Every script runs from the repository root and refuses to run anywhere else:

```shell
bash scripts/cloudfront-warm.sh [domain] [protocol]
bash scripts/docker-copy.sh [resume-target] [platform] [image] [docker-flags...]
bash scripts/hadolint.sh [hadolint-flags...]
bash scripts/npm-parallel.sh <npm-script> [npm-script...]
```

Defaults: `docker-copy.sh` writes to `source/tooling/export/resume` and builds `linux/amd64`; `cloudfront-warm.sh` targets `https://jinyu-zhang.com`.

`cloudfront-warm.sh` takes its page list from the deployed `sitemap.xml` rather than from `source/content/`, so it warms what is actually live even when the working tree is ahead of it, and exits 1 unless every page returns 200.

Building the image _is_ what generates the resume documents — the `resume` stage runs the builders — so `docker-copy.sh` always builds, though Docker layer caching makes an unchanged image a fast no-op. It also handles hosts where Docker needs elevation, escalating to `sudo` only when it can do so without an interactive password prompt.

`hadolint.sh` needs hadolint on the `PATH` — a system binary, not a dependency — so it checks for it and fails with an install pointer. In CI it is the last step of [`.github/actions/verify`](../.github/actions/verify/action.yml), which puts a pinned version there first. That is why the lint lives in a script rather than an NPM script: CI and a laptop run the same command.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the shape every script follows.
