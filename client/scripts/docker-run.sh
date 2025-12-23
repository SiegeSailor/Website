#!/bin/bash
#
# Run the Docker image.

set -o errexit

#######################################
# Main function.
# Arguments:
#   $1 - Docker image tag (default: siegesailor-website-client:latest)
#   $@ - Additional flags to pass to Docker (optional)
# Outputs:
#   Run Docker container with specified image tag ($1)
#######################################
main() {
  local -r image="${1:-siegesailor-website-client:latest}"
  local -ra docker_flags=("${@:2}")

  echo "[INFO] Running Docker container ${image}"
  docker run \
    --rm \
    --network "host" \
    --name "${image}" \
    "${docker_flags[@]}" \
    "${image}"

  echo "[DONE] Exited Docker container ${image}"
}

main "$@"