resource "aws_budgets_budget" "ec2" {
  name              = "Expected-Spend Budget"
  budget_type       = "COST"
  limit_amount      = "20"
  limit_unit        = "USD"
  time_period_start = "2026-01-01_00:00"
  time_unit         = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 20
    threshold_type             = "ABSOLUTE_VALUE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["siegesailor@gmail.com"]
  }

  tags = local.shared_tags
}
