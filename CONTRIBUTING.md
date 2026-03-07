# Contributing

This is a containerized Next.js client for the SiegeSailor website. To contribute to this project, please follow the guidelines below.

## Prerequisites

Required software:

- [AWS CLI](https://aws.amazon.com/cli/): `2.32.11`
- [Container Structure Test](https://github.com/GoogleContainerTools/container-structure-test): `1.19.3`
- [Docker](https://www.docker.com/): `28.5.2`
- [Hadolint](https://github.com/hadolint/hadolint): `2.14.0`
- [Terraform](https://developer.hashicorp.com/terraform): `1.14.1`
- [TFLint](https://github.com/terraform-linters/tflint): `0.60.0`

## Local Development

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

You can verify the `AccessKeyId`, `SecretAccessKey` from your local default AWS CLI profile by running:

```shell
aws configure export-credentials \
    --profile default
```

> [!note]
> Run `aws sts get-caller-identity` to verify that the account and user identities.

### Workflow

Go to the desired infrastructure environment folder, such as `infrastructure/production`, and run the following commands to deploy the latest changes:

```shell
terraform init
terraform fmt
tflint
terraform validate
terraform plan
terraform apply
```

A quick script:

```shell
bash scripts/docker-build.sh
bash scripts/docker-push.sh
(cd infrastructure/production && \
    terraform apply -auto-approve)
```
