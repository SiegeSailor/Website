#!/bin/bash
#
# Build the Docker image.

set -o errexit

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
    echo "[ERROR] This script must be run from the root directory" >&2
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
    echo "[WARN] .env file not found"
  fi

  echo "[INFO] Building Docker image ${image}"
  cp -r ../.git docker-context/.git
  docker build \
    --build-arg COMMIT_SHORT="${commit_short}" \
    --build-arg IMAGE="${image}" \
    --tag "${image}" \
    "${docker_flags[@]}" \
    docker-context
  rm -rf docker-context/.git

  echo "[DONE] Built Docker image ${image}"
}

main "$@"