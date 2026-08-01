# CLAUDE.md — infrastructure

The single flat Terraform environment behind `jinyu-zhang.com`.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a `.tf` file**; it owns the credentials, the command flow, deploying by hand, the naming, tagging, and `moved`-block rules, and the gotchas
- [`README.md`](./README.md) — what is deployed and how a request is served

## Only Here

**This is live production and it costs money.** Never run `terraform apply`, `terraform destroy`, or any mutating `aws` command without explicit confirmation from Ken. `plan`, `validate`, `fmt`, and `tflint` are always fine.
