# Contributing to infrastructure

Read the [root guide](../CONTRIBUTING.md) first — it lists the required Terraform, TFLint, and AWS CLI versions. The Terraform commands run from `infrastructure/`, unlike the rest of the repository.

> [!important]
> [`CLAUDE.md`](./CLAUDE.md) states what must never break here, starting with the one that costs money: no `apply`, no `destroy`, and no mutating `aws` command without explicit confirmation.

## Credentials

Create an access key under [IAM / Security Credentials](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials/access-key-wizard) and store it with `aws configure`; Terraform picks it up automatically for the `aws` provider.

```shell
aws configure
aws sts get-caller-identity  # verify the account and user
```

## The Command Flow

```shell
cd infrastructure/
terraform init
terraform fmt
tflint --init && tflint
terraform validate
terraform plan
terraform apply
```

[`main-deploy.yml`](../.github/workflows/main-deploy.yml) runs exactly this sequence with `-check` and `-auto-approve`, so a change that fails locally fails the deploy.

## Deploying by Hand

Only needed when the workflow cannot run. Build first, then sync the export and invalidate:

```shell
npm run build
bash scripts/docker-copy.sh "source/website/export/documents"
(cd infrastructure/
aws s3 sync ../source/website/export "s3://$(terraform output -raw site_bucket_name)" --delete --exclude "*.DS_Store"
aws cloudfront create-invalidation --distribution-id "$(terraform output -raw cloudfront_distribution_id)" --paths "/*")
```

An invalidation empties the edge caches, so the first visitor to each page pays for a full origin fetch. Running `cloudfront-warm.sh` afterwards absorbs that — [`scripts/README.md`](../scripts/README.md) says what it does and how to run it.

## Adding a Resource

- **Attach the Tags**: `local.shared_tags`, or `local.module_tags` when the resource belongs to the site itself rather than the account
- **Build the Name from `locals`**: Never write `siegesailor-website-production-…` into a resource
- **Move Rather Than Recreate**: Renaming a resource means adding a `moved` block, and the existing ones are there because addresses changed and the state must follow
- **Prefer a Well-Known Module**: A `terraform-aws-modules/*` module with a `~>` pin, as the existing S3, ACM, and CloudFront resources do
