data "aws_route53_zone" "this" {
  name = local.domain
}

resource "aws_route53_record" "root" {
  count   = var.enable_cloudfront ? 1 : 0
  zone_id = data.aws_route53_zone.this.zone_id
  name    = data.aws_route53_zone.this.name
  type    = "A"

  alias {
    name                   = module.cloudfront[0].cloudfront_distribution_domain_name
    zone_id                = module.cloudfront[0].cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "root_ipv6" {
  count   = var.enable_cloudfront ? 1 : 0
  zone_id = data.aws_route53_zone.this.zone_id
  name    = data.aws_route53_zone.this.name
  type    = "AAAA"

  alias {
    name                   = module.cloudfront[0].cloudfront_distribution_domain_name
    zone_id                = module.cloudfront[0].cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  count   = var.enable_cloudfront ? 1 : 0
  zone_id = data.aws_route53_zone.this.zone_id
  name    = "www.${data.aws_route53_zone.this.name}"
  type    = "A"

  alias {
    name                   = module.cloudfront[0].cloudfront_distribution_domain_name
    zone_id                = module.cloudfront[0].cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_ipv6" {
  count   = var.enable_cloudfront ? 1 : 0
  zone_id = data.aws_route53_zone.this.zone_id
  name    = "www.${data.aws_route53_zone.this.name}"
  type    = "AAAA"

  alias {
    name                   = module.cloudfront[0].cloudfront_distribution_domain_name
    zone_id                = module.cloudfront[0].cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
