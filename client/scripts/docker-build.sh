#!/bin/bash
#
# Build the Docker image.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

#######################################
# Main function.
# Arguments:
#   $1 - Docker image tag (default: siegesailor-website-client:latest)
#   $2 - Short Git commit hash (default: $(git rev-parse --short=8 HEAD))
#   $@ - Additional flags to pass to Docker (optional)
# Outputs:
#   Docker image built with specified tag ($1)
#######################################
main() {
  if [ ! -d "docker-context" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -r image="${1:-siegesailor-website-client:latest}"
  local -r commit_short="${2:-$(git rev-parse --short=8 HEAD)}"
  local -ra docker_flags=("${@:3}")

  if [ -f ".env" ]; then
    set -a
    # shellcheck disable=SC1091
    source ".env"
    set +a
  else
    echo -e "${YELLOW}[WARN] .env file not found${NONE}"
  fi

  echo -e "${GREEN}[INFO] Building Docker image ${image}${NONE}"
  cp -r ../.git docker-context/.git
  docker build \
    --build-arg COMMIT_SHORT="${commit_short}" \
    --build-arg IMAGE="${image}" \
    --tag "${image}" \
    --platform "linux/amd64" \
    "${docker_flags[@]}" \
    docker-context
  rm -rf docker-context/.git

  echo -e "${BLUE}[DONE] Built Docker image ${image}${NONE}"
}

main "$@"