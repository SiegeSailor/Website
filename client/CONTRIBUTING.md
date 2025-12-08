# Contributing

This is a containerized Next.js client for the SiegeSailor website. To contribute to this project, please follow the guidelines below.

### Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/): `2.32.11`
- [Container Structure Test](https://github.com/GoogleContainerTools/container-structure-test): `1.19.3`
- [Docker](https://www.docker.com/): `28.5.2`
- [Hadolint](https://github.com/hadolint/hadolint): `2.14.0`
- [Node.js](https://nodejs.org/): `25.2.1`
- [Terraform](https://developer.hashicorp.com/terraform): `1.14.1`

## Development

To set up the development environment, run the following commands:

```shell
cd ./client/
npm ci
npm run watch
```

## Building and Testing the Docker Image

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
