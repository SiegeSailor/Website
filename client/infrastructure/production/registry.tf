module "ecr" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "~> 3.1.0"

  repository_name         = "${local.project}-${local.environment}-${local.module}"
  repository_force_delete = true
  repository_lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep last 5 images.",
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
