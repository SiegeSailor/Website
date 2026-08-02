# CLAUDE.md — infrastructure

The single flat Terraform environment behind `jinyu-zhang.com`.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a `.tf` file**; it owns the credentials, the command flow, deploying by hand, and the naming, tagging, and `moved`-block rules
- [`README.md`](./README.md) — what is deployed and how a request is served

## Constraints That Must Never Break

**This is live production and it costs money.** Never run `terraform apply`, `terraform destroy`, or any mutating `aws` command without explicit confirmation from Ken. `plan`, `validate`, `fmt`, and `tflint` are always fine.

- **ACM for CloudFront Must Live in `us-east-1`**: Whatever `aws_region` says, which is why the `acm` module pins its own region
- **Both Buckets Set `force_destroy = true`**: A `terraform destroy` takes the site and the state with it, so treat the destroy path as unavailable
- **Editing the Routing Function Changes Every Route**: It is inline `cloudfront-js-2.0` in `content-delivery-network.tf`, so test a path with and without a trailing slash, a nested path, and a real file extension before applying
- **State Is Remote and Shared**: Never commit `*.tfstate`, `*.tfvars`, or `.terraform/`, and never repoint the backend to try something out
- **The Cache Policy Is `create_before_destroy`**: The distribution references it, so a replacement has to exist before the old one can be detached
- **The Hosted Zone Is Not Managed Here**: `jinyu-zhang.com` was purchased through Route 53 by hand and is read with a `data` block, so destroying this environment leaves the domain alone
