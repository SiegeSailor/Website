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
  exists at the root, and fail with `[ERROR]` on stderr and exit 1.
- **One job per script**, driven by a `main` that takes positional arguments with
  `"${1:-default}"` defaults, and ends with `main "$@"`.
- **Every function carries the block comment** with `Globals`, `Arguments`,
  `Outputs`, and `Returns` sections when they apply.
- **Log with the colour constants** and the `[INFO]`, `[WARNING]`, `[ERROR]`,
  `[DONE]` prefixes. Errors and warnings go to stderr.
- **Declare with `readonly` and `local -r`** wherever the value does not change.

## Adding a script

Add one only when the work needs a shell — process supervision, Docker, or
`curl` fan-out. Anything a Node script can do belongs in
[`source/tooling/`](../source/tooling/CONTRIBUTING.md), which is already in the
build graph. A new script that a developer runs must appear in
[`README.md`](./README.md); one an npm script calls must also be wired into the
root `package.json`.

## Checking a change

There is no test suite. Run the script from the root, then run it from a
subdirectory to confirm the guard fires:

```shell
bash scripts/hadolint.sh
(cd source && bash ../scripts/hadolint.sh)  # must fail with [ERROR]
```

`run-parallel.sh` is the one worth stress-testing after an edit: enable job
control (`set -o monitor`) so each child leads its own process group, then
confirm one Ctrl-C leaves no orphaned dev server or `node --watch` behind.
