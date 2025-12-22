# module "acm" {
#   source  = "terraform-aws-modules/acm/aws"
#   version = "~> 6.2.0"

#   domain_name = local.domain
#   zone_id     = local.domain_id

#   validation_method = "DNS"

#   subject_alternative_names = [
#     "*.${local.domain}"
#   ]

#   wait_for_validation = true

#   tags = {
#     CostCenter  = local.cost_center
#     Environment = var.environment
#     ManagedBy   = local.managed_by
#     Project     = local.project
#   }
# }

# module "cloudfront" {
#   source  = "terraform-aws-modules/cloudfront/aws"
#   version = "~> 6.0.2"

#   aliases = [local.domain, "*.${local.domain}"]

#   logging_config = {
#     bucket = "${local.project}-${var.environment}-cloudfront"
#   }

#   origin = {
#     something = {
#       domain_name = module.alb.dns_name
#       custom_origin_config = {
#         http_port              = 80
#         https_port             = 443
#         origin_protocol_policy = "match-viewer"
#         origin_ssl_protocols   = ["TLSv1.2"]
#       }
#     }
#   }

#   default_cache_behavior = {
#     target_origin_id       = "something"
#     viewer_protocol_policy = "allow-all"

#     allowed_methods = ["GET", "HEAD", "OPTIONS"]
#     cached_methods  = ["GET", "HEAD"]
#     compress        = true
#     query_string    = true
#   }

#   ordered_cache_behavior = [
#     {
#       path_pattern           = "/static/*"
#       target_origin_id       = "s3"
#       viewer_protocol_policy = "redirect-to-https"

#       allowed_methods = ["GET", "HEAD", "OPTIONS"]
#       cached_methods  = ["GET", "HEAD"]
#       compress        = true
#       query_string    = true
#     }
#   ]

#   viewer_certificate = {
#     acm_certificate_arn = "arn:aws:acm:us-east-1:135367859851:certificate/1032b155-22da-4ae0-9f69-e206f825458b"
#     ssl_support_method  = "sni-only"
#   }

#   tags = {
#     CostCenter  = local.cost_center
#     Environment = var.environment
#     ManagedBy   = local.managed_by
#     Project     = local.project
#   }
# }

# module "vpc" {
#   source  = "terraform-aws-modules/vpc/aws"
#   version = "~> 6.5.1"

#   name = "${local.project}-${var.environment}"
#   cidr = "10.0.0.0/16"

#   azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
#   private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
#   public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

#   enable_nat_gateway = true

#   tags = {
#     CostCenter  = local.cost_center
#     Environment = var.environment
#     ManagedBy   = local.managed_by
#     Project     = local.project
#   }
# }

# module "alb" {
#   source = "terraform-aws-modules/alb/aws"

#   name    = "${local.project}-${var.environment}"
#   vpc_id  = module.vpc.vpc_id
#   subnets = module.vpc.public_subnets

#   security_group_ingress_rules = {
#     http = {
#       from_port   = 80
#       to_port     = 80
#       ip_protocol = "tcp"
#       description = "Captures HTTP traffic."
#       cidr_ipv4   = "0.0.0.0/0"
#     }
#     https = {
#       from_port   = 443
#       to_port     = 443
#       ip_protocol = "tcp"
#       description = "Captures HTTPS traffic."
#       cidr_ipv4   = "0.0.0.0/0"
#     }
#   }
#   security_group_egress_rules = {
#     all = {
#       ip_protocol = "-1"
#       cidr_ipv4   = "10.0.0.0/16"
#     }
#   }

#   access_logs = {
#     bucket = "${local.project}-${var.environment}-alb"
#   }

#   listeners = {
#     ex-http-https-redirect = {
#       port     = 80
#       protocol = "HTTP"
#       redirect = {
#         port        = "443"
#         protocol    = "HTTPS"
#         status_code = "HTTP_301"
#       }
#     }
#     ex-https = {
#       port            = 443
#       protocol        = "HTTPS"
#       certificate_arn = "arn:aws:iam::123456789012:server-certificate/test_cert-123456789012"

#       forward = {
#         target_group_key = "ex-instance"
#       }
#     }
#   }

#   target_groups = {
#     ex-instance = {
#       name_prefix = "h1"
#       protocol    = "HTTP"
#       port        = 80
#       target_type = "instance"
#       target_id   = "i-0f6d38a07d50d080f"
#     }
#   }

#   tags = {
#     CostCenter  = local.cost_center
#     Environment = var.environment
#     ManagedBy   = local.managed_by
#     Project     = local.project
#   }
# }
