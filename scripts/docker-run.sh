#!/bin/bash
#
# Run the Docker image.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly NONE="\033[0m"

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

  echo -e "${GREEN}[INFO] Running Docker container ${image}${NONE}"
  docker run \
    --rm \
    --network "host" \
    "${docker_flags[@]}" \
    "${image}"

  echo -e "${BLUE}[DONE] Exited Docker container ${image}${NONE}"
}

main "$@"