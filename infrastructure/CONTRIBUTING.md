# Contributing to infrastructure

Read the [root guide](../CONTRIBUTING.md) first — it lists the required Terraform, TFLint, and AWS CLI versions. Everything here runs from `infrastructure/`, unlike the rest of the repository.

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

An invalidation empties the edge caches, so the first visitor to each page pays for a full origin fetch. [`cloudfront-warm.sh`](../scripts/README.md) requests every page in the deployed sitemap afterwards to absorb that.

## Adding a Resource

- **Attach the Tags**: `local.shared_tags`, or `local.module_tags` when the resource belongs to the site itself rather than the account
- **Build the Name from `locals`**: Never write `siegesailor-website-production-…` into a resource
- **Move Rather Than Recreate**: Renaming a resource means adding a `moved` block, and the existing ones are there because addresses changed and the state must follow
- **Prefer a Well-Known Module**: A `terraform-aws-modules/*` module with a `~>` pin, as the existing S3, ACM, and CloudFront resources do

## Gotchas

- **Both Buckets Set `force_destroy = true`**: A `terraform destroy` takes the site and the state with it, so treat the destroy path as unavailable
- **ACM for CloudFront Must Live in `us-east-1`**: Whatever `aws_region` says, which is why the `acm` module pins its own region
- **Editing the Routing Function Changes Every Route**: It is inline `cloudfront-js-2.0` in `content-delivery-network.tf`, so test a path with and without a trailing slash, a nested path, and a real file extension before applying
- **State Is Remote and Shared**: Never commit `*.tfstate`, `*.tfvars`, or `.terraform/`, and never repoint the backend to try something out
- **The Cache Policy Is `create_before_destroy`**: The distribution references it, so a replacement has to exist before the old one can be detached
- **The Hosted Zone Is Not Managed Here**: `jinyu-zhang.com` was purchased through Route 53 by hand and is read with a `data` block, so destroying this environment leaves the domain alone
