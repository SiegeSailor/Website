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

  logging_config = {
    bucket = module.cloudfront_log_s3_bucket.s3_bucket_bucket_domain_name
  }

  origin = {
    alb = {
      domain_name = module.alb.dns_name
      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "alb"
    viewer_protocol_policy = "allow-all"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    query_string    = true
  }

  viewer_certificate = {
    acm_certificate_arn = module.acm.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  tags = local.shared_tags
}

module "alb" {
  source = "terraform-aws-modules/alb/aws"

  name    = "${local.project}-${local.environment}"
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets

  enable_deletion_protection = false

  security_group_ingress_rules = {
    http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      description = "Captures HTTP traffic."
      cidr_ipv4   = "0.0.0.0/0"
    }
    https = {
      from_port   = 443
      to_port     = 443
      ip_protocol = "tcp"
      description = "Captures HTTPS traffic."
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "10.0.0.0/16"
    }
  }

  access_logs = {
    bucket = module.alb_log_s3_bucket.s3_bucket_id
  }

  listeners = {
    http-https-redirect = {
      port     = 80
      protocol = "HTTP"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
    https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = module.acm.acm_certificate_arn

      forward = {
        target_group_key = local.module
      }
    }
  }

  target_groups = {
    (local.module) = {
      name_prefix          = "alb-"
      protocol             = "HTTP"
      port                 = local.port
      target_type          = "ip"
      deregistration_delay = 30

      health_check = {
        enabled             = true
        interval            = 30
        path                = "/health"
        port                = "traffic-port"
        healthy_threshold   = 2
        unhealthy_threshold = 2
        timeout             = 5
        protocol            = "HTTP"
        matcher             = "200"
      }

      create_attachment = false
    }
  }

  tags = local.shared_tags
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.5.1"

  name = "${local.project}-${local.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true

  tags = local.shared_tags
}
