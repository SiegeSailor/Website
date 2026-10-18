#######################################
# Shared
#######################################
locals {
  cost_center = "personal"
  environment = "production"
  managed_by  = "terraform"
  project     = "siegesailor-website"
}

#######################################
# Module
#######################################
locals {
  module = "client"
  # Purchased via AWS Route 53 manually.
  domain = "jinyu-zhang.com"

  site_bucket_name = "${local.project}-${local.environment}-${local.module}"

  comments_module = "comments"
  comments_name   = "${local.project}-${local.environment}-${local.comments_module}"
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

  comments_tags = merge(local.shared_tags, {
    Module = local.comments_module
  })
}
