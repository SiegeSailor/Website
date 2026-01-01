provider "aws" {
  region = var.aws_region
}

resource "aws_service_discovery_http_namespace" "this" {
  name = "${local.project}-${local.environment}"

  tags = local.shared_tags
}

module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "~> 6.10.0"

  cluster_name = "${local.project}-${local.environment}"

  cluster_configuration = {
    execute_command_configuration = {
      logging = "OVERRIDE"
      log_configuration = {
        cloud_watch_log_group_name = "/${local.project}-${local.environment}"
      }
    }
  }

  default_capacity_provider_strategy = {
    FARGATE = {
      base   = 1
      weight = 25
    }
    FARGATE_SPOT = {
      weight = 75
    }
  }

  services = {
    (local.module) = {
      # Save budget.
      # cpu    = 512
      # memory = 2048
      cpu    = 256
      memory = 1024

      # Save budget.
      desired_count = 1

      deployment_minimum_healthy_percent = 100
      deployment_maximum_percent         = 200

      health_check_grace_period_seconds = 120

      tags = local.module_tags

      container_definitions = {
        (local.module) = {
          # Save budget.
          # cpu       = 256
          # memory    = 512
          # Tune performance.
          # cpu       = 128
          # memory    = 384
          cpu       = 256
          memory    = 1024
          essential = true
          image     = "${module.ecr.repository_url}@${data.aws_ecr_image.latest_image.image_digest}"
          portMappings = [
            {
              name          = local.module
              containerPort = local.port
            }
          ]

          memoryReservation         = 512
          enable_cloudwatch_logging = true

          # Defining `ENV` in `Dockerfile` isn't sufficient.
          environment = [
            {
              name  = "HOSTNAME"
              value = "0.0.0.0"
            },
            {
              name  = "NODE_ENV"
              value = "production"
            },
            {
              name  = "PORT"
              value = tostring(local.port)
            },
            {
              name  = "IMAGE"
              value = "${module.ecr.repository_url}@${data.aws_ecr_image.latest_image.image_digest}"
            }
          ]

          healthCheck = {
            command     = ["CMD-SHELL", "curl -f http://127.0.0.1:${local.port} || exit 1"]
            interval    = 30
            timeout     = 5
            retries     = 3
            startPeriod = 60
          }
        }
      }

      service_connect_configuration = {
        namespace = aws_service_discovery_http_namespace.this.name
        service = [{
          client_alias = {
            port     = local.port
            dns_name = local.module
          }
          port_name      = local.module
          discovery_name = "${local.project}-${local.environment}-${local.module}"
          tags           = local.module_tags
        }]
      }

      load_balancer = {
        service = {
          target_group_arn = module.alb.target_groups[local.module].arn
          container_name   = local.module
          container_port   = local.port
        }
      }

      # Save budget.
      subnet_ids       = module.vpc.public_subnets
      assign_public_ip = true

      security_group_ingress_rules = {
        alb = {
          from_port                    = local.port
          ip_protocol                  = "tcp"
          referenced_security_group_id = module.alb.security_group_id
        }
      }
      security_group_egress_rules = {
        all = {
          ip_protocol = "-1"
          cidr_ipv4   = "0.0.0.0/0"
        }
      }
    }
  }

  tags = local.module_tags
}
