# CLAUDE.md — infrastructure

The single flat Terraform environment behind `jinyu-zhang.com`.

- [`README.md`](./README.md) — what is deployed and how a request is served.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a `.tf` file.**
  It owns the credentials, the command flow, deploying by hand, the naming,
  tagging, and `moved`-block rules, and the gotchas.

## Only here

- **This is live production and it costs money.** Never run `terraform apply`,
  `terraform destroy`, or any mutating `aws` command without explicit
  confirmation from Ken. `plan`, `validate`, `fmt`, and `tflint` are always
  fine.
