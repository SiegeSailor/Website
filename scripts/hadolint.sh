#!/bin/bash
#
# Run hadolint on source/tooling/Dockerfile against the root .hadolint.yml, which
# is what sets the failure threshold and the ignored rules.
#
# hadolint is a system binary rather than an npm dependency, so this checks for
# it and fails with a usable message instead of `command not found`; CI installs
# a pinned version before calling this.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

#######################################
# Main function.
# Arguments:
#   $@ - Additional flags to pass to hadolint (optional)
# Outputs:
#   Every rule violation hadolint reports; exits 1 on a violation at or above
#   the configured failure threshold
#######################################
main() {
  if [ ! -f ".hadolint.yml" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  if ! command -v hadolint >/dev/null 2>&1; then
    echo -e "${YELLOW}[ERROR] hadolint is not installed. Install it from https://github.com/hadolint/hadolint${NONE}" >&2
    exit 1
  fi

  local -ra hadolint_flags=("$@")

  echo -e "${GREEN}[INFO] Linting Dockerfile with $(hadolint --version)${NONE}"
  hadolint \
    --config .hadolint.yml \
    "${hadolint_flags[@]}" \
    source/tooling/Dockerfile

  echo -e "${BLUE}[DONE] Linted Dockerfile${NONE}"
}

main "$@"
