provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.shared_tags
  }
}

module "app_runner_image_base" {
  source  = "terraform-aws-modules/app-runner/aws"
  version = "~> 1.2.2"

  service_name                   = local.module
  auto_scaling_configuration_arn = module.app_runner_shared_configs.auto_scaling_configurations["cost_optimized"].arn

  domain_name                      = var.enable_apprunner_custom_domain ? local.domain : null
  enable_www_subdomain             = var.enable_apprunner_custom_domain
  create_custom_domain_association = var.enable_apprunner_custom_domain

  create_access_iam_role = true
  private_ecr_arn        = local.ecr_repository_arn

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
          IMAGE    = "${local.ecr_repository_url}:latest"
        }
      }
      image_identifier      = "${local.ecr_repository_url}:latest"
      image_repository_type = "ECR"
    }
  }

  create_vpc_connector = false
  network_configuration = {
    egress_configuration = {
      egress_type = "DEFAULT"
    }
  }
  enable_observability_configuration = true

  tags = local.module_tags
}

module "app_runner_shared_configs" {
  source  = "terraform-aws-modules/app-runner/aws"
  version = "~> 1.2.2"

  create_service = false

  auto_scaling_configurations = {
    cost_optimized = {
      name            = "ss-web-prod-client-costopt"
      max_concurrency = 100
      max_size        = 1
      min_size        = 1
    }
  }

  tags = local.module_tags
}
