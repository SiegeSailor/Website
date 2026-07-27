#!/bin/bash
#
# Run hadolint on the Dockerfile.

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
#   Run hadolint on Dockerfile
#######################################
main() {
  if [ ! -f ".hadolint.yml" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -ra hadolint_flags=("${@:2}")

  echo -e "${GREEN}[INFO] Linting Dockerfile${NONE}"
  hadolint \
    --config .hadolint.yml \
    "${hadolint_flags[@]}" \
    source/tooling/Dockerfile

  echo -e "${BLUE}[DONE] Linted Dockerfile${NONE}"
}

main "$@"