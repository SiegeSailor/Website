provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.shared_tags
  }
}

module "app_runner_image_base" {
  source  = "terraform-aws-modules/app-runner/aws"
  version = "~> 1.2.2"

  service_name = local.module

  domain_name                      = local.domain
  enable_www_subdomain             = true
  create_custom_domain_association = true

  create_access_iam_role = true
  private_ecr_arn        = module.ecr.repository_arn

  source_configuration = {
    auto_deployments_enabled     = false
    authentication_configuration = {}
    image_repository = {
      image_configuration = {
        port = local.port
        runtime_environment_variables = {
          HOSTNAME = "0.0.0.0",
          NODE_ENV = "production",
          PORT     = tostring(local.port),
          IMAGE    = "${module.ecr.repository_url}@${data.aws_ecr_image.latest_image.image_digest}"
        }
      }
      image_identifier      = "${module.ecr.repository_url}@${data.aws_ecr_image.latest_image.image_digest}"
      image_repository_type = "ECR"
    }
  }

  create_vpc_connector          = true
  vpc_connector_subnets         = module.vpc.public_subnets
  vpc_connector_security_groups = [module.vpc.default_security_group_id]
  network_configuration = {
    egress_configuration = {
      egress_type = "VPC"
    }
  }

  enable_observability_configuration = true

  tags = local.module_tags
}
