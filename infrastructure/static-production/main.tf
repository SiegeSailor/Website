provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.shared_tags
  }
}

resource "aws_amplify_app" "this" {
  name        = "${local.project}-${local.environment}-${local.module}"
  platform    = "WEB"
  repository  = "https://github.com/${var.github_repository}"
  oauth_token = var.github_oauth_token

  enable_branch_auto_deletion = true

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "docker-context"
    NEXT_BUILD_TARGET         = "static"
  }

  build_spec = <<-EOT
version: 1
applications:
  - appRoot: docker-context
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build:static
      artifacts:
        baseDirectory: export
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
EOT

  lifecycle {
    ignore_changes = [oauth_token]
  }

  tags = local.module_tags
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.this.id
  branch_name = var.github_branch
  framework   = "Next.js - SSG"
  stage       = "PRODUCTION"

  enable_auto_build = true

  tags = local.module_tags
}

resource "aws_amplify_domain_association" "this" {
  count = var.create_domain_association ? 1 : 0

  app_id      = aws_amplify_app.this.id
  domain_name = var.domain_name

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }

  wait_for_verification = false
}
