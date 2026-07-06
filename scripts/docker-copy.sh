#!/bin/bash
#
# Generate resume documents into a target directory using the Docker image.

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

  # Command substitution captures stdout, so only stdin can be tested.
  if [ -t 0 ]; then
    echo "sudo docker"
    return 0
  fi

  echo -e "${YELLOW}[ERROR] Docker requires elevated privileges and non-interactive sudo is unavailable. Configure Docker access for your user (docker group) or run with pre-authorized sudo.${NONE}" >&2
  return 1
}

#######################################
# Main function.
# Arguments:
#   $1 - Target directory (default: docker-context/export/resume)
#   $2 - Build platform (default: linux/amd64)
#   $3 - Docker image tag (default: siegesailor-website-resume:latest)
#   $@ - Additional flags to pass to Docker (optional)
# Outputs:
#   Resume documents generated into the target directory ($1)
#######################################
main() {
  if [ ! -d "docker-context" ]; then
    echo -e "${YELLOW}[ERROR] This script must be run from the root directory${NONE}" >&2
    exit 1
  fi

  local -r target="${1:-docker-context/export/resume}"
  local -r build_platform="${2:-linux/amd64}"
  local -r image="${3:-siegesailor-website-resume:latest}"
  local -ra docker_flags=("${@:4}")
  local docker_cmd
  docker_cmd="$(get_docker_cmd)" || exit 1
  readonly docker_cmd

  echo -e "${GREEN}[INFO] Building Docker image ${image} for ${build_platform}${NONE}"
  ${docker_cmd} build \
    --target "resume" \
    --tag "${image}" \
    --platform "${build_platform}" \
    "${docker_flags[@]}" \
    docker-context

  echo -e "${GREEN}[INFO] Copying resume documents to ${target}${NONE}"
  mkdir -p "${target}"
  local container
  container="$(${docker_cmd} create "${image}")"
  ${docker_cmd} cp "${container}:/app/export/resume/." "${target}" || {
    ${docker_cmd} rm "${container}" >/dev/null
    exit 1
  }
  ${docker_cmd} rm "${container}" >/dev/null

  echo -e "${BLUE}[DONE] Generated resume documents in ${target}${NONE}"
}

main "$@"
