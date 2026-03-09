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

resource "aws_cloudfront_cache_policy" "web_short_ttl" {
  name        = "${local.project}-${local.environment}-${local.module}-web-short-ttl"
  comment     = "Short TTL cache policy for HTML/Doc responses to reduce App Runner requests."
  default_ttl = 300
  max_ttl     = 3600
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }

    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 6.0.2"
  count   = var.enable_cloudfront ? 1 : 0

  aliases     = [data.aws_route53_zone.this.name, "*.${data.aws_route53_zone.this.name}"]
  price_class = "PriceClass_100"

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

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true

    # Keep HTML/Doc traffic cached briefly at edge to reduce repeated App Runner hits.
    cache_policy_id            = aws_cloudfront_cache_policy.web_short_ttl.id
    origin_request_policy_name = "Managed-AllViewerExceptHostHeader"
  }

  ordered_cache_behavior = [
    {
      path_pattern               = "/_next/static/*"
      target_origin_id           = "apprunner"
      viewer_protocol_policy     = "redirect-to-https"
      allowed_methods            = ["GET", "HEAD", "OPTIONS"]
      cached_methods             = ["GET", "HEAD"]
      compress                   = true
      cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
      origin_request_policy_name = "Managed-AllViewerExceptHostHeader"
    },
    {
      path_pattern               = "/images/*"
      target_origin_id           = "apprunner"
      viewer_protocol_policy     = "redirect-to-https"
      allowed_methods            = ["GET", "HEAD", "OPTIONS"]
      cached_methods             = ["GET", "HEAD"]
      compress                   = true
      cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
      origin_request_policy_name = "Managed-AllViewerExceptHostHeader"
    }
  ]

  viewer_certificate = {
    acm_certificate_arn = module.acm.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  tags = local.shared_tags
}
