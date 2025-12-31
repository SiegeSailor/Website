resource "aws_iam_policy" "ecr_public_access" {
  name        = "${local.project}-${local.environment}-ECRPublicAccess"
  description = "Policy to allow public access to ECR repositories."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ],
        Resource = "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/*"
      }
    ]
  })

  tags = local.shared_tags
}

resource "aws_iam_policy" "logs_public_access" {
  name        = "${local.project}-${local.environment}-CloudWatchLogsPublicAccess"
  description = "Policy to allow public access to CloudWatch Logs."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:PutLogEvents",
          "logs:CreateLogStream",
          "logs:DescribeLogStreams"
        ],
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:*"
      }
    ]
  })

  tags = local.shared_tags
}
