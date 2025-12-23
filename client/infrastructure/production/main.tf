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
      base   = 8
      weight = 40
    }
    FARGATE_SPOT = {
      weight = 60
    }
  }

  services = {
    (local.module) = {
      cpu    = 512
      memory = 2048

      tags = local.module_tags

      container_definitions = {
        fluent-bit = {
          cpu       = 256
          memory    = 512
          essential = true
          image     = "906394416424.dkr.ecr.${var.aws_region}.amazonaws.com/aws-for-fluent-bit:stable"
          firelensConfiguration = {
            type = "fluentbit"
          }
          memoryReservation = 50
        }

        (local.module) = {
          cpu       = 256
          memory    = 512
          essential = true
          image     = data.aws_ecr_image.latest_image.image_digest
          portMappings = [
            {
              name          = local.module
              containerPort = local.port
            }
          ]

          dependsOn = [{
            containerName = "fluent-bit"
            condition     = "START"
          }]

          enable_cloudwatch_logging = false
          logConfiguration = {
            logDriver = "awsfirelens"
            options = {
              name                    = "firehose"
              region                  = var.aws_region
              delivery_stream         = "${local.project}-${local.environment}-${local.module}-stream"
              log-driver-buffer-limit = "2000000"
            }
          }
          memoryReservation = 128
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
