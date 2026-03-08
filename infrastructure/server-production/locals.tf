#######################################
# Shared
#######################################
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
