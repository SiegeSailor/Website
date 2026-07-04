data "aws_route53_zone" "this" {
  name = local.domain
}

moved {
  from = aws_route53_record.root[0]
  to   = aws_route53_record.root
}

resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = data.aws_route53_zone.this.name
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

moved {
  from = aws_route53_record.root_ipv6[0]
  to   = aws_route53_record.root_ipv6
}

resource "aws_route53_record" "root_ipv6" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = data.aws_route53_zone.this.name
  type    = "AAAA"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

moved {
  from = aws_route53_record.www[0]
  to   = aws_route53_record.www
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = "www.${data.aws_route53_zone.this.name}"
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

moved {
  from = aws_route53_record.www_ipv6[0]
  to   = aws_route53_record.www_ipv6
}

resource "aws_route53_record" "www_ipv6" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = "www.${data.aws_route53_zone.this.name}"
  type    = "AAAA"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
