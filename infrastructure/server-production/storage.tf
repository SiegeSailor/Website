#######################################
# Terraform State
#######################################
module "tf_state_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.10.0"

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
