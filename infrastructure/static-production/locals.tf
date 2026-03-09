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
# Composite
#######################################
locals {
  shared_tags = {
    CostCenter  = local.cost_center
    Environment = local.environment
    ManagedBy   = local.managed_by
    Project     = local.project
  }
}
