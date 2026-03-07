# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This is a containerized Next.js web application. To contribute to this project, please follow the guidelines below.

### Conventions

Following conventions are used in this project:

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style)
- [Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [AWS Tagging Best Practices and Strategies](https://docs.aws.amazon.com/tag-editor/latest/userguide/best-practices-and-strats.html)
  - [Cost Visibility](https://aws.amazon.com/blogs/aws-cloud-financial-management/gs-create-and-enforce-your-tagging-strategy-for-more-granular-cost-visibility/)

## Prerequisites

Required software:

- [AWS CLI](https://aws.amazon.com/cli/): `2.32.11`
- [Container Structure Test](https://github.com/GoogleContainerTools/container-structure-test): `1.19.3`
- [Docker](https://www.docker.com/): `28.5.2`
- [Hadolint](https://github.com/hadolint/hadolint): `2.14.0`
- [Terraform](https://developer.hashicorp.com/terraform): `1.14.1`
- [TFLint](https://github.com/terraform-linters/tflint): `0.60.0`

## Local Development

Work in the Next.js directory:

```shell
cd docker-context/
```

To set up the development environment, run the following commands:

```shell
npm ci
npm run watch
```

Build the client application to verify everything is working correctly:

```shell
npm run build
```

### Testing the Docker Image

Lint the Dockerfile using Hadolint:

```shell
bash scripts/hadolint.sh
```

Create a `.env` file in the project root. Fill in the values as needed:

```shell
cp .env.example .env
```

Build the image:

```shell
bash scripts/docker-build.sh "" "linux/arm64"
```

Test the Docker image structure with Container Structure Test:

```shell
bash scripts/container-structure-test.sh
```

Run the container:

```shell
bash scripts/docker-run.sh
```

### Troubleshooting

Next.js doesn't render `<title />` tags in `<head />` when there is an error in the pages. I am assuming that the page components are rendered before generating/aggregating all the head elements in `metadata`.

## Deployment

Retrieve AWS Access Key ID and Security Access Key from [IAM / Security Credentials / Create Access Key](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials/access-key-wizard) and configure AWS CLI by running the following to store credentials in `~/.aws/credentials`. This will allow Terraform to use the credentials automatically for `aws` provider:

```shell
aws configure
```

Verify the `AccessKeyId`, `SecretAccessKey` from your local default AWS CLI profile by running:

```shell
aws configure export-credentials \
    --profile default
```

> [!note]
> Run `aws sts get-caller-identity` to verify that the account and user identities.

### Workflow

Go to the desired infrastructure environment folder:

```shell
cd infrastructure/production/
```

Run the following commands to deploy the latest changes:

```shell
terraform init
terraform fmt
tflint
terraform validate
terraform plan
terraform apply
```

If any changes are made to [`docker-context/`](./docker-context/), go to the root directory, run the following commands to build and push the Docker image, and apply the Terraform configuration:

```shell
bash scripts/docker-build.sh
bash scripts/docker-push.sh
(cd infrastructure/production && \
    terraform apply -auto-approve)
```
