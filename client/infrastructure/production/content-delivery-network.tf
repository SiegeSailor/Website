module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 6.2.0"

  domain_name = data.aws_route53_zone.this.name
  zone_id     = data.aws_route53_zone.this.zone_id

  # ACM for CloudFront must be created in `us-east-1`.
  region = "us-east-1"

  validation_method = "DNS"

  subject_alternative_names = [
    "*.${data.aws_route53_zone.this.name}"
  ]

  wait_for_validation = true

  tags = local.shared_tags
}

module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 6.0.2"

  aliases = [data.aws_route53_zone.this.name, "*.${data.aws_route53_zone.this.name}"]

  # No S3 origin. Disable default origin access control.
  origin_access_control = {}

  origin = {
    apprunner = {
      domain_name = replace(module.app_runner_image_base.service_url, "https://", "")
      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "apprunner"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true

    # Disable caching. Next.js SSR handles its own caching headers.
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader
  }

  viewer_certificate = {
    acm_certificate_arn = module.acm.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  tags = local.shared_tags
}
