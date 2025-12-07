# Contributing

### Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/)
- [Terraform](https://developer.hashicorp.com/terraform)
- [Docker](https://www.docker.com/)

## Container

```shell
hadolint --config .hadolint.yml ./Dockerfile
```

```shell
container-structure-test test --image siegesailor-website/client --config .container-structure-test.yml
```

```shell
docker build --tag siegesailor-website/client .
```

```shell
docker run --detach --publish 3000:3000 --rm --name siegesailor-website-client siegesailor-website/client
# or
docker run --network host --rm --name siegesailor-website-client siegesailor-website/client
```
