module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.5.1"

  name = "${local.project}-${local.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  # Save budget.
  # enable_nat_gateway = true
  # single_nat_gateway = true
  map_public_ip_on_launch = true

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = local.shared_tags
}

resource "aws_security_group" "vpc_connector" {
  name_prefix = "${local.project}-${local.environment}-vpc-connector-"
  description = "Security group for App Runner VPC connector."
  vpc_id      = module.vpc.vpc_id

  egress {
    description = "Allow all outbound."
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = local.shared_tags
}

resource "aws_apprunner_vpc_connector" "this" {
  vpc_connector_name = "${local.module}-${length(module.vpc.public_subnets)}az"
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.vpc_connector.id]

  lifecycle {
    create_before_destroy = true
  }

  tags = local.shared_tags
}
