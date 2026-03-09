#######################################
# Shared
#######################################
data "aws_caller_identity" "current" {}

locals {
  cost_center = "personal"
  environment = "server-production"
  managed_by  = "terraform"
  project     = "siegesailor-website"
}

#######################################
# Module
#######################################
locals {
  module = "client"
  port   = 3000
  # Purchased via AWS Route 53 manually.
  domain = "jinyu-zhang.com"

  ecr_repository_name = "${local.project}-${local.environment}-${local.module}"
  ecr_repository_arn  = "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/${local.ecr_repository_name}"
  ecr_repository_url  = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${local.ecr_repository_name}"
}

#######################################
# Composite
#######################################
locals {
  shared_tags = {
    CostCenter  = local.cost_center
    Environment = local.environment
    ManagedBy   = local.managed_by
    Project     = local.project
  }

  module_tags = merge(local.shared_tags, {
    Module = local.module
  })
}
