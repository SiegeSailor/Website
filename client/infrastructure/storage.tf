
module "alb_log_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.9.1"

  bucket = "${local.project}-${var.environment}-alb-log"


  attach_elb_log_delivery_policy = true
  attach_lb_log_delivery_policy  = true

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  lifecycle_rule = [
    {
      id      = "general-expiration"
      enabled = true

      expiration = {
        days = 90
      }
    }
  ]

  tags = {
    CostCenter  = local.cost_center
    Environment = var.environment
    ManagedBy   = local.managed_by
    Project     = local.project
  }
}

module "cloudfront_log_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.9.1"

  bucket = "${local.project}-${var.environment}-cloudfront-log"

  control_object_ownership = true
  object_ownership         = "ObjectWriter"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  lifecycle_rule = [
    {
      id      = "general-expiration"
      enabled = true

      expiration = {
        days = 90
      }
    }
  ]

  tags = {
    CostCenter  = local.cost_center
    Environment = var.environment
    ManagedBy   = local.managed_by
    Project     = local.project
  }
}
