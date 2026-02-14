#######################################
# ACM Certificate
#######################################
resource "aws_acm_certificate" "domain" {
  domain_name               = local.domain
  subject_alternative_names = ["www.${local.domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.shared_tags
}

resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.domain.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  zone_id         = data.aws_route53_zone.main.zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 60
  records         = [each.value.record]
}

resource "aws_acm_certificate_validation" "domain" {
  certificate_arn         = aws_acm_certificate.domain.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}

#######################################
# CloudFront Distribution
#######################################
resource "aws_cloudfront_distribution" "main" {
  enabled         = true
  is_ipv6_enabled = true
  aliases         = [local.domain, "www.${local.domain}"]
  comment         = "${local.project}-${local.environment}-${local.module}"

  origin {
    domain_name = module.app_runner_image_base.service_url != null ? replace(module.app_runner_image_base.service_url, "https://", "") : ""
    origin_id   = "apprunner"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "apprunner"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    # Disable caching — Next.js SSR handles its own caching headers.
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.domain.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = local.shared_tags

  depends_on = [aws_acm_certificate_validation.domain]
}
