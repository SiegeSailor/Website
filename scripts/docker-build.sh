#!/bin/bash
#
# Build the Docker image.

set -o errexit

readonly BLUE="\033[0;34m"
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly NONE="\033[0m"

#######################################
# Resolve Docker command without interactive password prompts.
# Outputs:
#   Writes docker command (either "docker" or "sudo -n docker") to stdout
# Returns:
#   0 if successful, 1 otherwise
#######################################
get_docker_cmd() {
  if docker info >/dev/null 2>&1; then
    echo "docker"
    return 0
  fi

  if sudo -n docker info >/dev/null 2>&1; then
    echo "sudo -n docker"
    return 0
  fi

  if [ -t 0 ] && [ -t 1 ]; then
    echo "sudo docker"
    return 0
  fi

  echo -e "${YELLOW}[ERROR] Docker requires elevated privileges and non-interactive sudo is unavailable. Configure Docker access for your user (docker group) or run with pre-authorized sudo.${NONE}" >&2
  return 1
}

#######################################
# Main function.
# Arguments:
#   $1 - Short Git commit hash (default: $(git rev-parse --short=8 HEAD))
#   $2 - Build platform (default: linux/amd64)
#   $3 - Docker image tag (default: siegesailor-website-client:latest)
#   $@ - Additional flags to pass to Docker (optional)
# Outputs:
#   Docker image built with specified tag ($3)
#######################################
main() {
  if [ ! -d "docker-context" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -r commit_short="${1:-$(git rev-parse --short=8 HEAD)}"
  local -r build_platform="${2:-linux/amd64}"
  local -r image="${3:-siegesailor-website-client:latest}"
  local -ra docker_flags=("${@:4}")
  local docker_cmd
  docker_cmd="$(get_docker_cmd)" || exit 1
  readonly docker_cmd

  if [ -f ".env" ]; then
    set -a
    # shellcheck disable=SC1091
    source ".env"
    set +a
  else
    echo -e "${YELLOW}[WARNING] .env file not found${NONE}"
  fi

  echo -e "${GREEN}[INFO] Building Docker image ${image} for ${build_platform}${NONE}"

  ${docker_cmd} build \
    --build-arg COMMIT_SHORT="${commit_short}" \
    --tag "${image}" \
    --platform "${build_platform}" \
    "${docker_flags[@]}" \
    docker-context

  echo -e "${BLUE}[DONE] Built Docker image ${image}${NONE}"
}

main "$@"