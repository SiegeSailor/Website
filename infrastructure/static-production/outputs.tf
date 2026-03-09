output "aws_region" {
  description = "The AWS region to deploy resources in."
  value       = var.aws_region
}

output "environment" {
  description = "The deployment environment."
  value       = local.environment
}

output "amplify_app_id" {
  description = "Amplify app ID."
  value       = aws_amplify_app.this.id
}

output "amplify_app_name" {
  description = "Amplify app name."
  value       = aws_amplify_app.this.name
}

output "amplify_default_domain" {
  description = "Amplify managed default domain."
  value       = aws_amplify_app.this.default_domain
}

output "amplify_branch_name" {
  description = "Amplify branch connected to deployment."
  value       = aws_amplify_branch.main.branch_name
}

output "custom_domain_name" {
  description = "Custom domain associated with Amplify app."
  value       = var.create_domain_association ? aws_amplify_domain_association.this[0].domain_name : null
}
