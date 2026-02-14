module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.5.1"

  name = "${local.project}-${local.environment}"
  cidr = "10.0.0.0/16"

  # Save budget.
  # azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  # private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  # public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  # Save budget.
  # enable_nat_gateway = true
  # single_nat_gateway = true
  map_public_ip_on_launch = true

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = local.shared_tags
}
