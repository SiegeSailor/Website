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
      weight = 50
    }
    FARGATE_SPOT = {
      weight = 50
    }
  }

  services = {
    (local.module) = {
      cpu    = 512
      memory = 2048

      desired_count = 1

      deployment_minimum_healthy_percent = 100
      deployment_maximum_percent         = 200

      health_check_grace_period_seconds = 120

      tags = local.module_tags

      container_definitions = {
        (local.module) = {
          cpu       = 256
          memory    = 512
          essential = true
          image     = "${module.ecr.repository_url}@${data.aws_ecr_image.latest_image.image_digest}"
          portMappings = [
            {
              name          = local.module
              containerPort = local.port
            }
          ]

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
            }
          ]

          # Commented out due to none of the methods working. ALB health check is sufficient for routing:
          #   - Using `curl` with `127.0.0.1` and `localhost` shows Unknown, Unhealthy with `0.0.0.0`.
          #   - Using `wget` with `localhost` shows Unhealthy.
          #   - Using `ss -ltn` with `:3000` shows Unhealthy.
          # healthCheck = {
          #   command     = ["CMD-SHELL", "ss -ltn | grep -q ':3000 ' || exit 1"]
          #   interval    = 30
          #   timeout     = 5
          #   retries     = 3
          #   startPeriod = 60
          # }

          enable_cloudwatch_logging = true
          memoryReservation         = 128
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

      subnet_ids = module.vpc.private_subnets

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
