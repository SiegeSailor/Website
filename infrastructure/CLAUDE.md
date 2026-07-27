# CLAUDE.md — infrastructure

The single flat Terraform environment behind `jinyu-zhang.com`. See
[`README.md`](./README.md) for what is deployed and
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for the command flow and the gotchas.

## Rules

- **This is live production and it costs money.** Never run `terraform apply`,
  `destroy`, or any mutating `aws` command without explicit confirmation from
  Ken. `plan`, `validate`, `fmt`, and `tflint` are always fine.
- **State is remote and shared.** Never commit `*.tfstate`, `*.tfvars`, or
  `.terraform/`; never point the backend somewhere else to "test something".
- **Both storage buckets have `force_destroy = true`**, so a `destroy` takes the
  site and the state with it. Treat the destroy path as unavailable.
- **Never hard-code a name or a region.** Names come from `locals`, the region
  from `var.aws_region` — except ACM, which must be `us-east-1` for CloudFront.
- **Every resource carries tags** (`local.shared_tags`, or `local.module_tags`
  for the site itself). The budget alarm is only meaningful while that holds.
- **Keep the `moved` blocks.** They map old addresses onto current ones; deleting
  one makes the next plan propose a destroy and recreate.
- **The Route 53 zone is read, not managed.** Do not convert the `data` block
  into a resource.
- **Run Terraform from `infrastructure/`**, the one exception to the
  run-from-the-root rule; the rest of the repository does not.
