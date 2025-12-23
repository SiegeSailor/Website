#!/bin/bash
#
# Run hadolint on the Dockerfile.

set -o errexit

#######################################
# Main function.
# Arguments:
#   $@ - Additional flags to pass to hadolint (optional)
# Outputs:
#   Run hadolint on Dockerfile
#######################################
main() {
  if [ ! -f ".hadolint.yml" ]; then
    echo "[ERROR] This script must be run from the root directory" >&2
    exit 1
  fi

  local -ra hadolint_flags=("${@:2}")

  echo "[INFO] Linting Dockerfile"
  hadolint \
    --config .hadolint.yml \
    "${hadolint_flags[@]}" \
    docker-context/Dockerfile

  echo "[DONE] Linted Dockerfile"
}

main "$@"