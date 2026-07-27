# infrastructure

One flat Terraform environment — `production` — that serves the static export
from S3 through CloudFront on `jinyu-zhang.com`. There are no modules of our
own and no workspaces: every file here describes one part of that single
environment.

| File                                                            | Describes                                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`terraform.tf`](./terraform.tf)                                | Required Terraform (`~> 1.14.1`) and AWS provider (`~> 6.32`) versions   |
| [`backend.tf`](./backend.tf)                                    | The S3 state backend, with `use_lockfile`                                |
| [`main.tf`](./main.tf)                                          | The AWS provider and its `default_tags`                                  |
| [`variables.tf`](./variables.tf) / [`outputs.tf`](./outputs.tf) | `aws_region` in; region, environment, bucket name, distribution ID out   |
| [`locals.tf`](./locals.tf)                                      | Naming and tagging: `project`, `environment`, `module`, `domain`         |
| [`storage.tf`](./storage.tf)                                    | The state bucket, the site bucket, and the CloudFront-only bucket policy |
| [`content-delivery-network.tf`](./content-delivery-network.tf)  | ACM, the cache policy, the routing function, and the distribution        |
| [`domain.tf`](./domain.tf)                                      | Route 53 A and AAAA aliases for the apex and `www`                       |
| [`budget.tf`](./budget.tf)                                      | A \$10/month budget with alerts at 80% and 100%                          |

## How a request is served

The site bucket blocks all public access; only CloudFront can read it, through
an Origin Access Control granted by the bucket policy. A viewer-request
CloudFront function rewrites extensionless routes to the exported files —
`/about` to `/about.html`, `/` to `/index.html` — because a static export has no
server to do it. Missing keys come back from S3 as `403`, so both `403` and
`404` map to `/404.html`.

Caching is split by path: HTML and documents use a short-TTL policy (300s
default, 3600s max) since deploys invalidate the distribution anyway, while
`/_next/static/*` and `/images/*` use the AWS-managed `CachingOptimized` policy.

## Naming, tagging, and cost

Every resource name is built from `locals`, so nothing is spelled out twice:
`${project}-${environment}-${module}` gives `siegesailor-website-production-client`.
The provider applies `CostCenter`, `Environment`, `ManagedBy`, and `Project` as
`default_tags`; resources belonging to the site itself add `Module`. That is
what makes the budget attributable, and the budget is what keeps a
misconfiguration from being expensive quietly.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for credentials, the command flow,
and deploying by hand.
