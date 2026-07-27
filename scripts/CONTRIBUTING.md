# Contributing to scripts

Read the [root guide](../CONTRIBUTING.md) first; this covers only what is
specific to the shell scripts. They follow the
[Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
and are checked by neither Prettier nor ESLint, so the shape below is the whole
convention.

## The shape of a script

```bash
#!/bin/bash
#
# One or two sentences on what this does, and any constraint the code cannot
# show — why a flag is set, what breaks without it.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

#######################################
# Main function.
# Arguments:
#   $1 - What it is (default: the default)
# Outputs:
#   What the caller gets
#######################################
main() {
  if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -r target="${1:-a-default}"

  echo -e "${GREEN}[INFO] Starting${NONE}"
  echo -e "${BLUE}[DONE] Finished${NONE}"
}

main "$@"
```

- **Guard the working directory first.** Test for a file or folder that only
  exists at the root, and fail with `[ERROR]` on stderr and exit 1. Never make a
  script work from its own directory instead — the npm scripts, the Docker
  context, and the workflows all assume the root.
- **`set -o errexit` at the top**, and `set -o monitor` only where the script
  supervises long-lived children.
- **One job per script**, driven by a `main` that takes positional arguments with
  `"${1:-default}"` defaults, and ends with `main "$@"`.
- **Every function carries the block comment** with `Globals`, `Arguments`,
  `Outputs`, and `Returns` sections when they apply, and the file carries a
  header saying what it does and which constraint the code cannot show.
- **Log with the colour constants** and the `[INFO]`, `[WARNING]`, `[ERROR]`,
  `[DONE]` prefixes. Errors and warnings go to stderr.
- **Declare with `readonly` and `local -r`** wherever the value does not change,
  and quote every expansion.
- **Never prompt.** These run unattended in CI, so anything that could block —
  a `sudo` password, a confirmation — must be detected and fail loudly instead.
- **No new dependencies** beyond `bash`, `curl`, `git`, and the tool the script
  exists to drive.

## Adding a script

Add one only when the work needs a shell — process supervision, Docker, `curl`
fan-out, or a system binary a workflow and a laptop should invoke the same way.
Anything a Node script can do belongs in
[`source/tooling/`](../source/tooling/CONTRIBUTING.md), which is already in the
build graph.

Name it `<technology>-<action>.sh` — the tool it drives, then what it does to it,
as in `docker-copy.sh` and `cloudfront-warm.sh`. Two rules follow from that
order:

- **Leave `-<action>` off when the tool has only one action.** `hadolint.sh`
  lints Dockerfiles and does nothing else, so `hadolint-lint.sh` would only
  stutter. An action earns its place when the same tool could take another —
  Docker also builds and pushes, CloudFront also invalidates.
- **Never lead with the action.** `warm-up-cloudfront-cache.sh` sorts away from
  its siblings and hides how many scripts already drive the same tool.

A new script that a developer runs must appear in
[`README.md`](./README.md); one an npm script calls must also be wired into the
root `package.json`. Renaming or removing one means tracing every caller first —
the root `package.json`, [`release.config.mjs`](../release.config.mjs),
[`.github/workflows/`](../.github/workflows/), and the documents that link it.
Being documented is not being used: delete a script nothing calls.

## Per-script constraints

- **`docker-copy.sh` must never prompt for a password.** It escalates to `sudo`
  only when non-interactive `sudo` works or a TTY is attached; CI relies on it
  failing loudly instead of hanging.
- **`docker-copy.sh` cannot skip the build.** Building the image _is_ what
  generates the artifacts it copies, and layer caching already makes an
  unchanged image cheap.
- **`hadolint.sh` runs in CI** as the last step of
  [`.github/actions/verify`](../.github/actions/verify/action.yml), which puts the
  pinned hadolint on the `PATH` first. The `version` input of
  [`setup-hadolint`](../.github/actions/setup-hadolint/action.yml) is the only
  place that version lives in CI; bumping it means bumping the prerequisites
  table with it.
- **`npm-parallel.sh` traps every signal that ends it**, SIGHUP included,
  because job control puts the children in their own process groups and the trap
  becomes the only path that stops them. Do not simplify it to a bare
  `trap ... INT TERM`.
- **`cloudfront-warm.sh` reads the deployed `sitemap.xml`**, not
  `source/content/`, so it warms what is actually live even when the working
  tree is ahead of it.

## Checking a change

There is no test suite. Run the script from the root, then run it from a
subdirectory to confirm the guard fires:

```shell
bash scripts/cloudfront-warm.sh
(cd source && bash ../scripts/cloudfront-warm.sh)  # must fail with [ERROR]
```

`npm-parallel.sh` is the one worth stress-testing after an edit: enable job
control (`set -o monitor`) so each child leads its own process group, then
confirm one Ctrl-C leaves no orphaned dev server or `node --watch` behind.
