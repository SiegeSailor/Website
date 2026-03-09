module "ecr" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "~> 3.1.0"

  repository_name                 = local.ecr_repository_name
  repository_force_delete         = true
  repository_image_tag_mutability = "MUTABLE_WITH_EXCLUSION"
  repository_image_tag_mutability_exclusion_filter = [
    {
      filter      = "v*"
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
        description  = "Expire tagged images if more than 3 exist.",
        selection = {
          tagStatus     = "tagged",
          tagPrefixList = ["v"],
          countType     = "imageCountMoreThan",
          countNumber   = 3
        },
        action = {
          type = "expire"
        }
      }
    ]
  })

  tags = local.shared_tags
}
