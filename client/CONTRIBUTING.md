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

### Building and Testing the Docker Image

Lint the Dockerfile with Hadolint:

```shell
hadolint \
    --config .hadolint.yml \
    Dockerfile
```

Build the Docker image with the following command:

```shell
cp -r ../.git .git
docker build \
    --build-arg COMMIT_SHORT=$(git rev-parse --short=8 HEAD) \
    --tag siegesailor-website/client \
    --file Dockerfile \
    .
rm -rf .git
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

Test the Docker image structure with Container Structure Test:

```shell
container-structure-test test \
    --image siegesailor-website/client \
    --config .container-structure-test.yml
```
