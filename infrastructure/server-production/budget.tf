resource "aws_budgets_budget" "monthly" {
  name              = "${local.project}-${local.environment}"
  budget_type       = "COST"
  limit_amount      = "37.5"
  limit_unit        = "USD"
  time_period_start = "2026-02-01_00:00"
  time_unit         = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["siegesailor@gmail.com"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["siegesailor@gmail.com"]
  }

  tags = local.shared_tags
}
