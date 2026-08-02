# Contributing to scripts

Read the [root guide](../CONTRIBUTING.md) first; this covers only what is specific to the shell scripts. They follow the [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) and are checked by neither Prettier nor ESLint, so the shape below and the constraints in [`CLAUDE.md`](./CLAUDE.md) are the whole convention.

## The Shape of a Script

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

- **Declare with `readonly` and `local -r`**: Wherever the value does not change, and quote every expansion
- **Give Every Function the Block Comment**: With `Globals`, `Arguments`, `Outputs`, and `Returns` sections where they apply, and a file header saying what the script does and which constraint the code cannot show
- **Log with the Color Constants**: Use the `[INFO]`, `[WARNING]`, `[ERROR]`, and `[DONE]` prefixes, and send errors and warnings to stderr
- **One Job per Script**: Driven by a `main` that takes positional arguments with `"${1:-default}"` defaults and ends with `main "$@"`
- **Set `-o errexit` at the Top**: And `set -o monitor` only where the script supervises long-lived children
- **Take No New Dependencies**: Beyond `bash`, `curl`, `git`, and the tool the script exists to drive

> [!important]
> [`CLAUDE.md`](./CLAUDE.md) states the 2 rules a script may never break — guard the working directory first, and never prompt — and the constraints each individual script carries.

## Adding a Script

Add one only when the work needs a shell — process supervision, Docker, `curl` fan-out, or a system binary a workflow and a laptop should invoke the same way. Anything a Node.js script can do belongs in [`source/tooling/`](../source/tooling/CONTRIBUTING.md), which is already in the build graph.

Name it `<technology>-<action>.sh` — the tool it drives, then what it does to it, as in `docker-copy.sh` and `cloudfront-warm.sh`. 2 rules follow from that order:

- **Leave `-<action>` Off When the Tool Has Only One Action**: `hadolint.sh` lints Dockerfiles and does nothing else, so `hadolint-lint.sh` would only stutter — an action earns its place when the same tool could take another, the way Docker also builds and pushes and CloudFront also invalidates
- **Never Lead with the Action**: `warm-up-cloudfront-cache.sh` sorts away from its siblings and hides how many scripts already drive the same tool

A new script that a developer runs must appear in [`README.md`](./README.md); one an NPM script calls must also be wired into the root `package.json`. Renaming or removing one means tracing every caller first — the root `package.json`, [`release.config.mjs`](../release.config.mjs), [`.github/workflows/`](../.github/workflows/), and the documents that link it. Being documented is not being used: delete a script nothing calls.

## Checking a Change

There is no test suite. Run the script from the root, then run it from a subdirectory to confirm the guard fires:

```shell
bash scripts/cloudfront-warm.sh
(cd source && bash ../scripts/cloudfront-warm.sh)  # must fail with [ERROR]
```

`npm-parallel.sh` is the one worth stress-testing after an edit: enable job control (`set -o monitor`) so each child leads its own process group, then confirm one Ctrl-C leaves no orphaned dev server or `node --watch` behind.
