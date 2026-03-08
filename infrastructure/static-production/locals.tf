#######################################
# Shared
#######################################
locals {
  cost_center = "personal"
  environment = "static-production"
  managed_by  = "terraform"
  project     = "siegesailor-website"
}

#######################################
# Module
#######################################
locals {
  module = "client"
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
