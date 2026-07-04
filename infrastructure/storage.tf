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

moved {
  from = module.tf_state_production_s3_bucket
  to   = module.tf_state_s3_bucket
}

#######################################
# Static Site
#######################################
module "site_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.10.0"

  bucket        = local.site_bucket_name
  force_destroy = true

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  tags = local.module_tags
}

data "aws_iam_policy_document" "site_s3_bucket" {
  statement {
    sid       = "AllowCloudFrontServicePrincipalReadOnly"
    actions   = ["s3:GetObject"]
    resources = ["${module.site_s3_bucket.s3_bucket_arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [module.cloudfront.cloudfront_distribution_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = module.site_s3_bucket.s3_bucket_id
  policy = data.aws_iam_policy_document.site_s3_bucket.json
}
