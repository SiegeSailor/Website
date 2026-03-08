variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "github_repository" {
  description = "GitHub repository in owner/name format."
  type        = string
  default     = "SiegeSailor/Website"
}

variable "github_branch" {
  description = "GitHub branch to connect in Amplify."
  type        = string
  default     = "main"
}

variable "github_oauth_token" {
  description = "GitHub OAuth token used by Amplify to connect the repository."
  type        = string
  sensitive   = true
}

variable "create_domain_association" {
  description = "Whether to create a custom domain association in Amplify."
  type        = bool
  default     = true
}

variable "domain_name" {
  description = "Root domain managed by Route53 for Amplify custom domain association."
  type        = string
  default     = "jinyu-zhang.com"
}