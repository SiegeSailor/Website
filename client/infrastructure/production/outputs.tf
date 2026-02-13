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
