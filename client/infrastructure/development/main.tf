provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.shared_tags
  }
}

resource "aws_service_discovery_http_namespace" "this" {
  name = "${local.project}-${local.environment}"

  tags = local.shared_tags
}

data "aws_ssm_parameter" "aws_service_fluentbit" {
  name = "/aws/service/aws-for-fluent-bit/stable"
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
      # See https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html.
      # cpu    = 512
      # memory = 2048
      cpu    = 256
      memory = 1024

      enable_execute_command = true

      # Save budget.
      desired_count            = 1
      enable_autoscaling       = true
      autoscaling_min_capacity = 1
      autoscaling_max_capacity = 4 # Default 10. Multiples of 2 for AZs.
      autoscaling_policies = {
        cpu = {
          policy_type = "TargetTrackingScaling"
          target_tracking_scaling_policy_configuration = {
            predefined_metric_specification = {
              predefined_metric_type = "ECSServiceAverageCPUUtilization"
            }
            target_value = 80.0 # Default 75.0.
          }
        }
      }
      deployment_minimum_healthy_percent = 100
      deployment_maximum_percent         = 200

      health_check_grace_period_seconds = 60

      tags = local.module_tags

      container_definitions = {
        fluent-bit = {
          cpu       = 96
          memory    = 256
          essential = true
          image     = nonsensitive(data.aws_ssm_parameter.aws_service_fluentbit.value)

          firelensConfiguration = {
            type = "fluentbit"
          }

          memoryReservation = 64
          user              = "0"

          enable_cloudwatch_logging              = true
          cloudwatch_log_group_retention_in_days = 30

          # Always unhealthy.
          # healthCheck = {
          #   command     = ["CMD-SHELL", "wget -q -O - http://127.0.0.1:2020/api/v1/health || exit 1"]
          #   interval    = 30
          #   timeout     = 15
          #   retries     = 3
          #   startPeriod = 15
          # }
        }

        (local.module) = {
          cpu       = 160
          memory    = 766 # 2 MB less from 768 to account for Fluent Bit.
          essential = true
          image     = "${module.ecr.repository_url}@${data.aws_ecr_image.latest_image.image_digest}"
          portMappings = [
            {
              name          = local.module
              containerPort = local.port
            }
          ]

          memoryReservation = 512

          dependsOn = [{
            containerName = "fluent-bit"
            condition     = "START"
          }]

          enable_cloudwatch_logging = false
          logConfiguration = {
            logDriver = "awsfirelens"
            options = {
              Name                    = "stdout"
              log-driver-buffer-limit = "2097152" # 2 MB. Default 1048576. Max 536870912.
            }
          }

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
            startPeriod = 30
          }
        }
      }

      service_connect_configuration = {
        enabled   = true
        namespace = aws_service_discovery_http_namespace.this.name
        service = [{
          client_alias = {
            port     = local.port
            dns_name = local.module
          }
          port_name      = local.module
          discovery_name = "${local.project}-${local.environment}-${local.module}"
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
