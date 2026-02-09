#######################################
# App Runner IAM Role for ECR Access
#######################################
resource "aws_iam_role" "apprunner_ecr_access" {
  name = "${local.project}-${local.environment}-apprunner-ecr"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })

  tags = local.shared_tags
}

resource "aws_iam_role_policy_attachment" "apprunner_ecr_access" {
  role       = aws_iam_role.apprunner_ecr_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

#######################################
# App Runner Service
#######################################
resource "aws_apprunner_service" "this" {
  service_name = "${local.project}-${local.environment}-${local.module}"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr_access.arn
    }

    image_repository {
      image_configuration {
        port = tostring(local.port)

        runtime_environment_variables = {
          HOSTNAME = "0.0.0.0"
          NODE_ENV = "production"
          PORT     = tostring(local.port)
        }
      }

      image_identifier      = "${module.ecr.repository_url}:latest"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = false
  }

  instance_configuration {
    # Increased memory to prevent OOM kills
    # 0.25 vCPU with 1GB memory for Next.js SSR
    cpu    = "256"  # 0.25 vCPU
    memory = "1024" # 1 GB (minimum for Next.js apps)
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.this.arn

  health_check_configuration {
    protocol            = "HTTP"
    path                = "/"
    interval            = 20
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  tags = local.module_tags
}

#######################################
# App Runner Auto Scaling (Minimal)
#######################################
resource "aws_apprunner_auto_scaling_configuration_version" "this" {
  auto_scaling_configuration_name = "${local.project}-${local.environment}"

  # Cost optimization: minimum instances
  min_size = 1
  max_size = 2

  # Scale up at 80% concurrency (default is 100 concurrent requests per instance)
  max_concurrency = 100

  tags = local.shared_tags
}

#######################################
# Custom Domain for App Runner
#######################################
resource "aws_apprunner_custom_domain_association" "this" {
  domain_name          = local.domain
  service_arn          = aws_apprunner_service.this.arn
  enable_www_subdomain = true
}
