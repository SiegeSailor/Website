#######################################
# General
#######################################
locals {
  cost_center = "personal"
  managed_by  = "terraform"
  project     = "siegesailor-website"
}

#######################################
# Module
#######################################
locals {
  module = "client"
  port   = 3000
}

#######################################
# AWS
#######################################
locals {
  # Manually purchased on Route 53
  domain = "jinyu-zhang.com"
}
