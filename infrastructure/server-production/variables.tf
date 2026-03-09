variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "enable_cloudfront" {
  description = "Whether to provision CloudFront and Route53 alias records for the app domain."
  type        = bool
  default     = true
}

variable "enable_apprunner_custom_domain" {
  description = "Whether App Runner should manage the custom domain association directly."
  type        = bool
  default     = false
}
