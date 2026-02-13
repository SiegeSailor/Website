output "aws_region" {
  description = "The AWS region to deploy resources in."
  value       = var.aws_region
}

output "environment" {
  description = "The deployment environment."
  value       = local.environment
}

output "ecr_repository_arn" {
  description = "Full ARN of the repository."
  value       = module.ecr.repository_arn
}

output "ecr_repository_name" {
  description = "Name of the repository."
  value       = module.ecr.repository_name
}

output "ecr_repository_registry_id" {
  description = "The registry ID where the repository was created."
  value       = module.ecr.repository_registry_id
}

output "ecr_repository_url" {
  description = "The URL of the repository."
  value       = module.ecr.repository_url
}

output "apprunner_service_url" {
  description = "The default URL of the App Runner service."
  value       = aws_apprunner_service.this.service_url
}

output "apprunner_service_arn" {
  description = "The ARN of the App Runner service."
  value       = aws_apprunner_service.this.arn
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution."
  value       = module.cloudfront.cloudfront_distribution_id
}

output "cloudfront_distribution_domain" {
  description = "The domain name of the CloudFront distribution."
  value       = module.cloudfront.cloudfront_distribution_domain_name
}

output "custom_domain" {
  description = "The custom domain for the website."
  value       = local.domain
}
