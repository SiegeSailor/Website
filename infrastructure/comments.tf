#######################################
# Storage
#######################################
resource "aws_dynamodb_table" "comments" {
  name                        = local.comments_name
  billing_mode                = "PAY_PER_REQUEST"
  hash_key                    = "post"
  range_key                   = "id"
  deletion_protection_enabled = true

  attribute {
    name = "post"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.comments_tags
}

#######################################
# Secrets
#######################################
# Sent by CloudFront on every origin request, so the public `execute-api` URL
# is refused on its own.
resource "random_password" "comments_origin" {
  length  = 32
  special = false
}

# Keys the stored IP hashes, so repeat senders are visible without keeping
# addresses.
resource "random_password" "comments_hash" {
  length  = 32
  special = false
}

#######################################
# Function
#######################################
data "archive_file" "comments" {
  type             = "zip"
  source_file      = "${path.module}/functions/comments/index.mjs"
  output_path      = "${path.module}/.terraform/functions/comments.zip"
  output_file_mode = "0666"
}

data "aws_iam_policy_document" "comments_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "comments" {
  statement {
    actions   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:Query"]
    resources = [aws_dynamodb_table.comments.arn]
  }

  statement {
    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.comments.arn]
  }

  statement {
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.comments.arn}:*"]
  }
}

resource "aws_iam_role" "comments" {
  name               = local.comments_name
  assume_role_policy = data.aws_iam_policy_document.comments_assume.json

  tags = local.comments_tags
}

resource "aws_iam_role_policy" "comments" {
  name   = local.comments_name
  role   = aws_iam_role.comments.id
  policy = data.aws_iam_policy_document.comments.json
}

resource "aws_cloudwatch_log_group" "comments" {
  name              = "/aws/lambda/${local.comments_name}"
  retention_in_days = 14

  tags = local.comments_tags
}

resource "aws_lambda_function" "comments" {
  function_name    = local.comments_name
  role             = aws_iam_role.comments.arn
  runtime          = "nodejs24.x"
  architectures    = ["arm64"]
  handler          = "index.handler"
  filename         = data.archive_file.comments.output_path
  source_code_hash = data.archive_file.comments.output_base64sha256
  memory_size      = 128
  timeout          = 5

  environment {
    variables = {
      DOMAIN        = local.domain
      HASH_KEY      = random_password.comments_hash.result
      ORIGIN_SECRET = random_password.comments_origin.result
      TABLE_NAME    = aws_dynamodb_table.comments.name
      TOPIC_ARN     = aws_sns_topic.comments.arn
    }
  }

  depends_on = [aws_cloudwatch_log_group.comments, aws_iam_role_policy.comments]

  tags = local.comments_tags
}

#######################################
# API
#######################################
resource "aws_apigatewayv2_api" "comments" {
  name          = local.comments_name
  protocol_type = "HTTP"

  tags = local.comments_tags
}

resource "aws_apigatewayv2_integration" "comments" {
  api_id                 = aws_apigatewayv2_api.comments.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.comments.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "comments" {
  for_each = toset(["GET", "POST"])

  api_id    = aws_apigatewayv2_api.comments.id
  route_key = "${each.key} /api/comments"
  target    = "integrations/${aws_apigatewayv2_integration.comments.id}"
}

# The throttle is shared by every reader; it caps cost, not one sender.
resource "aws_apigatewayv2_stage" "comments" {
  api_id      = aws_apigatewayv2_api.comments.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 5
    throttling_rate_limit  = 2
  }

  tags = local.comments_tags
}

resource "aws_lambda_permission" "comments" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.comments.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.comments.execution_arn}/*/*/api/comments"
}

#######################################
# Notification
#######################################
resource "aws_sns_topic" "comments" {
  name = local.comments_name

  tags = local.comments_tags
}

# Stays "pending confirmation" until the link in the first email is clicked.
resource "aws_sns_topic_subscription" "comments" {
  topic_arn = aws_sns_topic.comments.arn
  protocol  = "email"
  endpoint  = "siegesailor@gmail.com"
}
