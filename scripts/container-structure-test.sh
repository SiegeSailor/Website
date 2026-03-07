#!/bin/bash
#
# Run container-structure-test on the Docker image.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

#######################################
# Main function.
# Arguments:
#   $1 - Docker image tag (default: siegesailor-website-client:latest)
#   $@ - Additional flags to pass to container-structure-test (optional)
# Outputs:
#   Run container-structure-test on specified image tag ($1)
#######################################
main() {
  if [ ! -f ".container-structure-test.yml" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -r image="${1:-siegesailor-website-client:latest}"
  local -ra container_structure_test_flags=("${@:2}")

  echo -e "${GREEN}[INFO] Testing Docker container ${image}${NONE}"
  container-structure-test test \
    --image "${image}" \
    --config .container-structure-test.yml \
    "${container_structure_test_flags[@]}"

  echo -e "${BLUE}[DONE] Tested Docker container ${image}${NONE}"
}

main "$@"