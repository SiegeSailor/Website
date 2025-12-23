#!/bin/bash
#
# Run container-structure-test on the Docker image.

set -o errexit

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
    echo "[ERROR] This script must be run from the root directory" >&2
    exit 1
  fi

  local -r image="${1:-siegesailor-website-client:latest}"
  local -ra container_structure_test_flags=("${@:2}")

  echo "[INFO] Testing Docker container ${image}"
  container-structure-test test \
    --image "${image}" \
    --config .container-structure-test.yml \
    "${container_structure_test_flags[@]}"

  echo "[DONE] Tested Docker container ${image}"
}

main "$@"