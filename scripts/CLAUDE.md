# CLAUDE.md — scripts

Shell scripts called by the NPM scripts and the workflows.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a script**; it owns the skeleton, the shape, when a script should exist, and how to check a change
- [`README.md`](./README.md) — what each script does and how to run it

## Constraints That Must Never Break

- **Guard the Working Directory First**: Test for a file or folder that only exists at the root, and fail with `[ERROR]` on stderr and exit 1 — never make a script work from its own directory instead, because the NPM scripts, the Docker context, and the workflows all assume the root
- **Never Prompt**: These run unattended in CI, so anything that could block — a `sudo` password, a confirmation — must be detected and fail loudly instead

## Per-Script Constraints

- **`cloudfront-warm.sh` Reads the Deployed `sitemap.xml`**: Not `source/content/`, so it warms what is actually live even when the working tree is ahead of it
- **`docker-copy.sh` Cannot Skip the Build**: Building the image _is_ what generates the artifacts it copies, and layer caching already makes an unchanged image cheap
- **`docker-copy.sh` Must Never Prompt for a Password**: It escalates to `sudo` only when non-interactive `sudo` works or a TTY is attached, and CI relies on it failing loudly instead of hanging
- **`hadolint.sh` Runs in CI**: As the last step of [`.github/actions/verify`](../.github/actions/verify/action.yml), which puts the pinned hadolint on the `PATH` first — the `version` input of [`setup-hadolint`](../.github/actions/setup-hadolint/action.yml) is the only place that version lives in CI, so bumping it means bumping the [prerequisites table](../CONTRIBUTING.md#prerequisites) with it
- **`npm-parallel.sh` Traps Every Signal That Ends It**: SIGHUP included, because job control puts the children in their own process groups and the trap becomes the only path that stops them — do not simplify it to a bare `trap ... INT TERM`
