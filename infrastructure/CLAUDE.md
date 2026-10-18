# CLAUDE.md — infrastructure

The single flat Terraform environment behind `jinyu-zhang.com`.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a `.tf` file**; it owns the credentials, the command flow, deploying by hand, and the naming, tagging, and `moved`-block rules
- [`README.md`](./README.md) — what is deployed and how a request is served

## Constraints That Must Never Break

**This is live production and it costs money.** Never run `terraform apply`, `terraform destroy`, or any mutating `aws` command without explicit confirmation from Jin Yu Zhang. `plan`, `validate`, `fmt`, and `tflint` are always fine.

- **ACM for CloudFront Must Live in `us-east-1`**: Whatever `aws_region` says, which is why the `acm` module pins its own region
- **Both Buckets Set `force_destroy = true`**: A `terraform destroy` takes the site and the state with it, so treat the destroy path as unavailable
- **CloudFront Replaces Every 403 and 404**: With `/404.html`, whatever the origin, so the comments function answers readers with 200, 202, 400, or 405 only
- **Editing the Routing Function Changes Every Route**: It is inline `cloudfront-js-2.0` in `content-delivery-network.tf`, so test a path with and without a trailing slash, a nested path, and a real file extension before applying, and never attach it to `/api/*`, where it would rewrite `/api/comments` to a file
- **Every Input Has a Default**: [`main-deploy.yml`](../.github/workflows/main-deploy.yml) plans and applies with only `aws_region` set, so a value CI cannot supply, such as the comments secrets, is generated with `random_password` instead of passed in
- **State Is Remote and Shared**: Never commit `*.tfstate`, `*.tfvars`, or `.terraform/`, and never repoint the backend to try something out
- **The Cache Policy Is `create_before_destroy`**: The distribution references it, so a replacement has to exist before the old one can be detached
- **The Hosted Zone Is Not Managed Here**: `jinyu-zhang.com` was purchased through Route 53 by hand and is read with a `data` block, so destroying this environment leaves the domain alone
