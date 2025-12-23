#!/bin/bash
#
# Push Docker image to ECR.

set -o errexit

readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

#######################################
# Get ECR repository URL from Terraform output.
# Arguments:
#   None
# Outputs:
#   Writes ECR repository URL to stdout
# Returns:
#   0 if successful, 1 otherwise
#######################################
get_ecr_url() {
  local -r terraform_dir="/Users/user/Documents/Website/client/infrastructure/production"
  
  if [ ! -d "${terraform_dir}" ]; then
    echo -e "${YELLOW}[ERROR] Terraform directory not found: ${terraform_dir}${NC}" >&2
    return 1
  fi

  local ecr_url
  ecr_url=$(cd "${terraform_dir}" && terraform output -raw ecr_repository_url 2>/dev/null || echo "")

  if [ -z "${ecr_url}" ]; then
    echo -e "${YELLOW}[ERROR] ECR repository not found in Terraform outputs. Run 'terraform apply' first.${NC}" >&2
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
#   0 if successful, 1 otherwise
#######################################
authenticate_docker() {
  local -r aws_region="$1"
  local -r ecr_url="$2"

  echo -e "${GREEN}[INFO] Authenticating Docker to ECR...${NC}"
  aws ecr get-login-password --region "${aws_region}" | \
    docker login --username AWS --password-stdin "${ecr_url}"
}

#######################################
# Main function.
# Arguments:
#   $1 - Image tag (default: latest)
# Outputs:
#   Pushes Docker image to ECR with specified tag ($1)
#######################################
main() {
  local -r local_image="siegesailor-website-client"
  local -r image_tag="${1:-latest}"

  echo -e "${GREEN}[INFO] Starting Docker image push to ECR...${NC}"

  local ecr_url
  ecr_url=$(get_ecr_url) || exit 1

  echo -e "${GREEN}[INFO] ECR Repository: ${ecr_url}${NC}"

  local -r aws_region=$(get_aws_region "${ecr_url}")
  echo -e "${GREEN}[INFO] AWS Region: ${aws_region}${NC}"

  authenticate_docker "${aws_region}" "${ecr_url}" || exit 1

  echo -e "${GREEN}[INFO] Tagging image ${local_image} as ${ecr_url}:${image_tag}${NC}"
  docker tag "${local_image}:latest" "${ecr_url}:${image_tag}"

  echo -e "${GREEN}[INFO] Pushing image to ECR...${NC}"
  docker push "${ecr_url}:${image_tag}"

  if [ "${image_tag}" != "latest" ]; then
    echo -e "${GREEN}[INFO] Also tagging and pushing as 'latest'...${NC}"
    docker tag "${local_image}:latest" "${ecr_url}:latest"
    docker push "${ecr_url}:latest"
  fi

  echo -e "${GREEN}[DONE] Successfully pushed image to ECR!${NC}"
  echo -e "${GREEN}[INFO] Image: ${ecr_url}:${image_tag}${NC}"
}

main "$@"
