#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Docker image push to ECR...${NC}"

# Get ECR repository URL
cd /Users/user/Documents/Website/client/terraform
ECR_URL=$(terraform output -raw ecr_repository_url 2>/dev/null || echo "")

if [ -z "$ECR_URL" ]; then
  echo -e "${YELLOW}ECR repository not found in Terraform outputs. Run 'terraform apply' first.${NC}"
  exit 1
fi

echo -e "${GREEN}ECR Repository: $ECR_URL${NC}"

# Extract AWS region and account ID from ECR URL
AWS_REGION=$(echo $ECR_URL | cut -d'.' -f4)
AWS_ACCOUNT_ID=$(echo $ECR_URL | cut -d'.' -f1 | cut -d'/' -f3)

echo -e "${GREEN}AWS Region: $AWS_REGION${NC}"
echo -e "${GREEN}AWS Account: $AWS_ACCOUNT_ID${NC}"

# Authenticate Docker to ECR
echo -e "${GREEN}Authenticating Docker to ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

# Tag local image with ECR repository URL
LOCAL_IMAGE="siegesailor-website/client"
IMAGE_TAG="${1:-latest}"

echo -e "${GREEN}Tagging image $LOCAL_IMAGE as $ECR_URL:$IMAGE_TAG${NC}"
docker tag $LOCAL_IMAGE:latest $ECR_URL:$IMAGE_TAG

# Push image to ECR
echo -e "${GREEN}Pushing image to ECR...${NC}"
docker push $ECR_URL:$IMAGE_TAG

# If not using 'latest', also tag and push as 'latest'
if [ "$IMAGE_TAG" != "latest" ]; then
  echo -e "${GREEN}Also tagging and pushing as 'latest'...${NC}"
  docker tag $LOCAL_IMAGE:latest $ECR_URL:latest
  docker push $ECR_URL:latest
fi

echo -e "${GREEN}Successfully pushed image to ECR!${NC}"
echo -e "${GREEN}Image: $ECR_URL:$IMAGE_TAG${NC}"
