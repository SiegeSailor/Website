#!/bin/bash
#
# Push Docker image to ECR.

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
# Build ECR repository URL from account, region, and repository name.
# Arguments:
#   $1 - AWS region
#   $2 - ECR repository name
# Outputs:
#   Writes ECR repository URL to stdout
# Returns:
#   0 if successful, 1 otherwise
#######################################
get_ecr_url() {
  local -r aws_region="$1"
  local -r ecr_repository_name="$2"

  local account_id
  account_id=$(aws sts get-caller-identity --query "Account" --output text 2>/dev/null || echo "")

  if [ -z "${account_id}" ] || [ "${account_id}" = "None" ]; then
    echo -e "${YELLOW}[ERROR] Unable to determine AWS account ID${NONE}" >&2
    return 1
  fi

  echo "${account_id}.dkr.ecr.${aws_region}.amazonaws.com/${ecr_repository_name}"

  return 0
}

#######################################
# Ensure the ECR repository exists before pushing.
# Arguments:
#   $1 - ECR repository name
#   $2 - AWS region
# Returns:
#   0 if successful, 1 otherwise
#######################################
ensure_ecr_repository() {
  local -r ecr_repository_name="$1"
  local -r aws_region="$2"

  if aws ecr describe-repositories \
    --region "${aws_region}" \
    --repository-names "${ecr_repository_name}" \
    >/dev/null 2>&1; then
    return 0
  fi

  echo -e "${GREEN}[INFO] Creating ECR repository ${ecr_repository_name}${NONE}"
  aws ecr create-repository \
    --region "${aws_region}" \
    --repository-name "${ecr_repository_name}" \
    >/dev/null

  return 0
}

#######################################
# Get the latest image digest from ECR.
# Arguments:
#   $1 - ECR repository name
#   $2 - AWS region
# Outputs:
#   Writes image digest to stdout
# Returns:
#   0 if successful, 1 otherwise
#######################################
get_ecr_latest_image_digest() {
  local -r ecr_repository_name="$1"
  local -r aws_region="$2"

  local digest
  digest=$(aws ecr describe-images \
    --region "${aws_region}" \
    --repository-name "${ecr_repository_name}" \
    --image-ids imageTag=latest \
    --query "imageDetails[0].imageDigest" \
    --output text 2>/dev/null || echo "")

  if [ -z "${digest}" ] || [ "${digest}" = "None" ]; then
    echo -e "${YELLOW}[ERROR] Unable to read latest image digest from ECR${NONE}" >&2
    return 1
  fi

  echo "${digest}"
  return 0
}

#######################################
# Authenticate Docker to ECR.
# Arguments:
#   $1 - AWS region
#   $2 - ECR repository URL
# Returns:
#   0 if successful, 1 otherwise
#######################################
authenticate_ecr() {
  local -r aws_region="$1"
  local -r ecr_url="$2"
  local -r docker_cmd="$3"

  echo -e "${GREEN}[INFO] Authenticating ${ecr_url}${NONE}"
  aws ecr get-login-password --region "${aws_region}" | \
    ${docker_cmd} login --username AWS --password-stdin "${ecr_url}"

  return 0
}

#######################################
# Main function.
# Arguments:
#   $1 - Repository (default: siegesailor-website-client)
#   $2 - Tag (default: latest)
#   $3 - Environment (default: server-production)
# Outputs:
#   Pushes Docker image to ECR with specified tag ($2)
#######################################
main() {
  local -r repository="${1:-siegesailor-website-client}"
  local -r tag="${2:-latest}"
  local -r environment="${3:-server-production}"
  local -r aws_region="${AWS_REGION:-us-east-1}"
  local -r ecr_repository_name="siegesailor-website-${environment}-client"
  local docker_cmd
  docker_cmd="$(get_docker_cmd)" || exit 1
  readonly docker_cmd

  local -r image="${repository}:${tag}"
  local -r ecr_url=$(get_ecr_url "${aws_region}" "${ecr_repository_name}") || exit 1

  ensure_ecr_repository "${ecr_repository_name}" "${aws_region}" || exit 1

  authenticate_ecr "${aws_region}" "${ecr_url}" "${docker_cmd}" || exit 1

  echo -e "${GREEN}[INFO] Tagging image ${image} as ${ecr_url}:${tag}${NONE}"
  ${docker_cmd} tag "${image}" "${ecr_url}:${tag}"

  echo -e "${GREEN}[INFO] Pushing image ${ecr_url}:${tag} to ${aws_region}${NONE}"
  ${docker_cmd} push "${ecr_url}:${tag}"

  if [ "${tag}" != "latest" ]; then
    echo -e "${GREEN}[INFO] Also tagging and pushing the latest tag${NONE}"
    ${docker_cmd} tag "${image}" "${ecr_url}:latest"
    ${docker_cmd} push "${ecr_url}:latest"
  fi

  echo -e "${BLUE}[DONE] Pushed image ${ecr_url}:${tag}@$(get_ecr_latest_image_digest "${ecr_repository_name}" "${aws_region}" || exit 1)${NONE}"
}

main "$@"
