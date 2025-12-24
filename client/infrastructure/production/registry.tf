module "ecr" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "~> 3.1.0"

  repository_name                 = "${local.project}-${local.environment}-${local.module}"
  repository_force_delete         = true
  repository_image_tag_mutability = "MUTABLE_WITH_EXCLUSION"
  repository_image_tag_mutability_exclusion_filter = [
    {
      filter      = "latest"
      filter_type = "WILDCARD"
    },
  ]
  repository_lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images older than 1 day."
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2,
        description  = "Expire tagged images if more than 5 exist.",
        selection = {
          tagStatus     = "tagged",
          tagPrefixList = ["v"],
          countType     = "imageCountMoreThan",
          countNumber   = 5
        },
        action = {
          type = "expire"
        }
      }
    ]
  })

  tags = local.shared_tags
}

data "aws_ecr_image" "latest_image" {
  repository_name = module.ecr.repository_name
  image_tag       = "latest"
}
