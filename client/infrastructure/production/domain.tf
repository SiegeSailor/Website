data "aws_route53_zone" "this" {
  name         = local.domain
  private_zone = false
  tags = {
    ManagedBy = "console"
  }
}

#######################################
# DNS Records for App Runner Custom Domain
#######################################
# Note: Certificate validation records are created manually via AWS CLI
# because they require the custom domain association to exist first.
# The App Runner service will handle SSL termination for the custom domain.

# WWW subdomain CNAME record - points to App Runner
resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = "www.${local.domain}"
  type    = "CNAME"
  ttl     = 300
  records = [aws_apprunner_custom_domain_association.this.dns_target]
}

# Root domain ALIAS record - App Runner hosted zone for us-east-1
# Reference: https://docs.aws.amazon.com/general/latest/gr/apprunner.html
resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = local.domain
  type    = "A"

  alias {
    name                   = aws_apprunner_service.this.service_url
    zone_id                = "Z01915732ZBZKC8D32TPT" # App Runner hosted zone for us-east-1
    evaluate_target_health = true
  }
}
