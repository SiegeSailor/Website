output "aws_region" {
  description = "The AWS region to deploy resources in."
  value       = var.aws_region
}

output "environment" {
  description = "The deployment environment."
  value       = local.environment
}

output "site_bucket_name" {
  description = "Name of the S3 bucket that stores the static site."
  value       = module.site_s3_bucket.s3_bucket_id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution that serves the site."
  value       = module.cloudfront.cloudfront_distribution_id
}
