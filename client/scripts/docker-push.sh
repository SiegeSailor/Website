#!/bin/bash
#
# Push Docker image to ECR.

set -o errexit

readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_NONE='\033[0m'

#######################################
# Get ECR repository URL from Terraform output.
# Arguments:
#   $1 - Environment (default: production)
# Outputs:
#   Writes ECR repository URL to stdout
# Returns:
#   0 if successful, 1 otherwise
#######################################
get_ecr_url() {
  local -r environment="${1:-production}"
  local -r path_to_infrastructure="infrastructure/${environment}"
  
  if [ ! -d "${path_to_infrastructure}" ]; then
    echo -e "${COLOR_YELLOW}[ERROR] Terraform directory not found: ${path_to_infrastructure}${COLOR_NONE}" >&2
    return 1
  fi

  local ecr_url
  ecr_url=$(cd "${path_to_infrastructure}" && terraform output -raw ecr_repository_url 2>/dev/null || echo "")

  if [ -z "${ecr_url}" ]; then
    echo -e "${COLOR_YELLOW}[ERROR] ECR repository not found in Terraform outputs. Run 'terraform apply' first.${COLOR_NONE}" >&2
    return 1
  fi

  echo "${ecr_url}"
}

#######################################
# Extract AWS region from ECR URL.
# Arguments:
#   $1 - ECR repository URL
# Outputs:
#   Writes AWS region to stdout
#######################################
get_aws_region() {
  local -r ecr_url="$1"
  echo "${ecr_url}" | cut -d'.' -f4
}

#######################################
# Authenticate Docker to ECR.
# Arguments:
#   $1 - AWS region
#   $2 - ECR repository URL
# Returns:
#   `0` if successful, `1` otherwise
#######################################
authenticate_ecr() {
  local -r aws_region="$1"
  local -r ecr_url="$2"

  echo -e "${COLOR_GREEN}[INFO] Authenticating to ECR${COLOR_NONE}"
  aws ecr get-login-password --region "${aws_region}" | \
    docker login --username AWS --password-stdin "${ecr_url}"
}

#######################################
# Main function.
# Arguments:
#   $1 - Repository (default: siegesailor-website-client)
#   $2 - Tag (default: latest)
#   $3 - Environment (default: production)
# Outputs:
#   Pushes Docker image to ECR with specified tag ($2)
#######################################
main() {
  local -r repository="${1:-siegesailor-website-client}"
  local -r tag="${2:-latest}"
  local -r environment="${3:-production}"

  local -r image="${repository}:${tag}"
  local -r ecr_url=$(get_ecr_url "${environment}") || exit 1
  local -r aws_region=$(get_aws_region "${ecr_url}")

  authenticate_ecr "${aws_region}" "${ecr_url}" || exit 1

  echo -e "${COLOR_GREEN}[INFO] Tagging image ${image} as ${ecr_url}:${tag}${COLOR_NONE}"
  docker tag "${image}" "${ecr_url}:${tag}"

  echo -e "${COLOR_GREEN}[INFO] Pushing image ${ecr_url}:${tag} to ${aws_region}${COLOR_NONE}"
  docker push "${ecr_url}:${tag}"

  if [ "${tag}" != "latest" ]; then
    echo -e "${COLOR_GREEN}[INFO] Also tagging and pushing the latest tag${COLOR_NONE}"
    docker tag "${image}" "${ecr_url}:latest"
    docker push "${ecr_url}:latest"
  fi

  echo -e "${COLOR_BLUE}[DONE] Pushed image ${ecr_url}:${tag}${COLOR_NONE}"
}

main "$@"
