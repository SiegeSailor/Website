# Contributing to infrastructure

Read the [root guide](../CONTRIBUTING.md) first — it lists the required
Terraform, TFLint, and AWS CLI versions. Everything here runs from
`infrastructure/`, unlike the rest of the repository.

## Credentials

Create an access key under
[IAM / Security Credentials](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials/access-key-wizard)
and store it with `aws configure`; Terraform picks it up automatically for the
`aws` provider.

```shell
aws configure
aws sts get-caller-identity  # verify the account and user
```

## The command flow

```shell
cd infrastructure/
terraform init
terraform fmt
tflint --init && tflint
terraform validate
terraform plan
terraform apply
```

[`main-deploy.yml`](../.github/workflows/main-deploy.yml) runs exactly this
sequence with `-check` and `-auto-approve`, so a change that fails locally fails
the deploy.

## Deploying by hand

Only needed when the workflow cannot run. Build first, then sync the export and
invalidate:

```shell
npm run build
bash scripts/docker-copy.sh "source/website/export/documents"
(cd infrastructure/
aws s3 sync ../source/website/export "s3://$(terraform output -raw site_bucket_name)" --delete --exclude "*.DS_Store"
aws cloudfront create-invalidation --distribution-id "$(terraform output -raw cloudfront_distribution_id)" --paths "/*")
```

An invalidation empties the edge caches, so the first visitor to each page pays
for a full origin fetch. [`warm-up-cloudfront-cache.sh`](../scripts/README.md)
requests every page afterwards to absorb that.

## Adding a resource

- Build the name from `locals` — never write `siegesailor-website-production-…`
  into a resource.
- Attach `local.shared_tags`, or `local.module_tags` when the resource belongs
  to the site itself rather than the account.
- Prefer a well-known `terraform-aws-modules/*` module with a `~>` pin, as the
  existing S3, ACM, and CloudFront resources do.
- Renaming a resource means adding a `moved` block, not destroying and
  recreating it; the existing ones are there because addresses changed and the
  state must follow.

## Gotchas

- **ACM for CloudFront must live in `us-east-1`**, whatever `aws_region` says —
  the `acm` module pins its own region for that reason.
- **The hosted zone is not managed here.** `jinyu-zhang.com` was purchased
  through Route 53 by hand and is read with a `data` block; destroying this
  environment leaves the domain alone.
- **The cache policy is `create_before_destroy`** because the distribution
  references it: a replacement has to exist before the old one can be detached.
- **Editing the routing function changes every route.** It is inline
  `cloudfront-js-2.0` in `content-delivery-network.tf`; test a path with and
  without a trailing slash, a nested path, and a real file extension before
  applying.
