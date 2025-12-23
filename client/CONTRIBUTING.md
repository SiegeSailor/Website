# Contributing Client

This is a containerized Next.js client for the SiegeSailor website. To contribute to this project, please follow the guidelines below.

### Prerequisites

Required software for the client module:

- [Node.js](https://nodejs.org/): `25.2.1`

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
bash scripts/docker-build.sh
```

Test the Docker image structure with Container Structure Test:

```shell
bash scripts/container-structure-test.sh
```

Run the container:

```shell
bash scripts/docker-run.sh
```

## Deployment

Retrieve AWS Access Key ID and Security Access Key from [IAM - Security Credentials - Create Access Key](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials/access-key-wizard) and configure AWS CLI by running the following to store credentials in `~/.aws/credentials`. This will allow Terraform to use the credentials automatically for `aws` provider:

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

Roughly the deployment workflow is as follows:

```shell
export ENVIRONMENT="development"

terraform init -backend-config="${ENVIRONMENT}.tfbackend"
terraform fmt
tflint
terraform validate
terraform plan -var "environment=${ENVIRONMENT}"
terraform apply -var "environment=${ENVIRONMENT}"
```
