# scripts

The shell scripts the npm scripts and the workflows call. Each one does a single
job that would be awkward as an npm script: driving Docker, supervising parallel
processes, or fanning out HTTP requests.

| Script                                                         | Does                                                                            | Called by                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| [`docker-copy.sh`](./docker-copy.sh)                           | Builds the tooling image and copies the resume documents and profile README out | `main-deploy.yml`, semantic-release |
| [`hadolint.sh`](./hadolint.sh)                                 | Lints `source/tooling/Dockerfile`                                               | By hand                             |
| [`run-parallel.sh`](./run-parallel.sh)                         | Runs several root npm scripts at once in one terminal                           | `npm run watch`                     |
| [`warm-up-cloudfront-cache.sh`](./warm-up-cloudfront-cache.sh) | Requests every page so CloudFront caches it after a deploy                      | By hand                             |

## Usage

Every script runs from the repository root and refuses to run anywhere else:

```shell
bash scripts/docker-copy.sh [resume-target] [platform] [image] [docker-flags...]
bash scripts/hadolint.sh [hadolint-flags...]
bash scripts/run-parallel.sh <npm-script> [npm-script...]
bash scripts/warm-up-cloudfront-cache.sh [domain] [protocol]
```

Defaults: `docker-copy.sh` writes to `source/tooling/export/resume` and builds
`linux/amd64`; `warm-up-cloudfront-cache.sh` targets `https://jinyu-zhang.com`.

Building the image _is_ what generates the resume documents — the `resume` stage
runs the builders — so `docker-copy.sh` always builds, though Docker layer
caching makes an unchanged image a fast no-op. It also handles hosts where
Docker needs elevation, escalating to `sudo` only when it can do so without an
interactive password prompt.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the shape every script follows.
