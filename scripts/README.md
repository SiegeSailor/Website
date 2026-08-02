# scripts

The shell scripts the NPM scripts and the workflows call. Each one does a single job that would be awkward as an NPM script: driving Docker, supervising parallel processes, or fanning out HTTP requests. Every name reads `<technology>-<action>.sh`, so the file says which tool it drives before it is opened — [`CONTRIBUTING.md`](./CONTRIBUTING.md#adding-a-script) owns that rule.

| Script                                       | Does                                                                        | Called By                           |
| -------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| [`cloudfront-warm.sh`](./cloudfront-warm.sh) | Requests every page in the deployed sitemap so CloudFront caches it again   | By hand                             |
| [`docker-copy.sh`](./docker-copy.sh)         | Builds the tooling image and copies the resume documents and the README out | `main-deploy.yml`, Semantic Release |
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

`cloudfront-warm.sh` exits 1 unless every page returns 200. `hadolint.sh` needs hadolint on the `PATH` and fails with an install pointer when it is missing, which is why the lint lives in a script rather than an NPM script: CI and a laptop run the same command.

See [`CLAUDE.md`](./CLAUDE.md#per-script-constraints) for the constraint each script carries and [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the shape every script follows.
