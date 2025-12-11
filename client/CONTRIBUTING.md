# Contributing

This is a containerized Next.js client for the SiegeSailor website. To contribute to this project, please follow the guidelines below.

> [!tip]
> Stay in the project root folder for any commands.

### Prerequisites

Required software for the client module:

- [Node.js](https://nodejs.org/): `25.2.1`

## Local Development

To set up the development environment, run the following commands:

```shell
cd ./client/
npm ci
npm run watch
```

### Building and Testing the Docker Image

Build the Docker image with the following command:

```shell
docker build \
    --build-arg COMMIT_SHORT=$(git rev-parse --short HEAD) \
    --tag siegesailor-website/client \
    --file ./client/Dockerfile \
    .
```

Run the Docker container with the following command:

```shell
docker run \
    --network host \
    --rm \
    --name siegesailor-website-client \
    siegesailor-website/client
```

You can also run the container in detached mode:

```shell
docker run \
    --detach \
    --publish 3000:3000 \
    --rm \
    --name siegesailor-website-client \
    siegesailor-website/client
```

Lint the Dockerfile with Hadolint:

```shell
hadolint \
    --config ./client/.hadolint.yml \
    ./client/Dockerfile
```

Test the Docker image structure with Container Structure Test:

```shell
container-structure-test test \
    --image siegesailor-website/client \
    --config ./client/.container-structure-test.yml
```

### Deployment

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

#### Workflow

Roughly the deployment workflow is as follows:

```shell
terraform init
terraform fmt
tflint
terraform validate
terraform plan
terraform apply
```
