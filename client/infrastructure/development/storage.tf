
module "tf_state_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.9.1"

  bucket        = "${local.project}-${local.environment}-tf-state"
  force_destroy = true

  versioning = {
    status = true
  }

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  tags = local.shared_tags
}

module "alb_log_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.9.1"

  bucket        = "${local.project}-${local.environment}-alb-log"
  force_destroy = true

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

  tags = local.shared_tags
}

module "cloudfront_log_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.9.1"

  bucket        = "${local.project}-${local.environment}-cloudfront-log"
  force_destroy = true

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

  tags = local.shared_tags
}
