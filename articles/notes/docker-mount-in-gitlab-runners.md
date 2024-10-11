---
tags: ["docker", "gitlab"]
---

# Docker Mount in GitLab Runners

When using Docker containers to generate files in a mounted location in a GitLab runner, if the cleanup or permission handling for the generated files are not done properly within the container, it creates a permission issue happens every time the runner checks out the repository, therefore stops the runner from running any future jobs. Consider this guide is helpful if the followings all are met:

- Developers don't have access to the runners
- Runners run as a non-root user, such as `gitlab-runner`
- `sudo` is not available in the runners
- Designated or onsite runners are used

:::note
The GitLab runners used during writing this guide are of Linux distributions. Through this might not be the case, different platforms can perform differently.
:::

## Reproduction

This section demonstrates how this issue happens.

### Generate Files via Docker

Here is a simplified project file structure, which only contains an empty `Dockerfile`:

```shell
└── Dockerfile
```

Update `Dockerfile` to create a folder and a file:

```dockerfile
FROM ubuntu:22.04
USER "root"
WORKDIR "/home/"
CMD mkdir --parent "foo" && touch "foo/bar.txt"
```

Create `helper-docker-operate.sh` to operate Docker containers and images:

```shell
└── Dockerfile
# highlight-next-line
└── helper-docker-operate.sh
```

```shell title="./helper-docker-operate.sh"
docker build \
    --tag "baz:latest" \
    "./"
docker run --rm \
    --volume "./home/:/home/" \
    "baz:latest"
```

### Run Docker in GitLab Runners

Create a `.gitlab-ci.yml`:

```shell
# highlight-next-line
└── .gitlab-ci.yml
└── Dockerfile
└── helper-docker-operate.sh
```

```yaml
stages:
  - "primary"
  - "secondary"

default:
  before_script: |
    echo "$CI_REGISTRY_PASSWORD" | \
    docker login \
      "$CI_REGISTRY" \
      --username "$CI_REGISTRY_USER" \
      --password-stdin

.demonstration: &demonstration
  stage: "$STAGE"
  tags:
    - "onsite-runner"
  services:
    - "docker:24.0.5-dind"
  script: |
    bash helper-docker-operate.sh
  dependencies: []

demonstration:first:
  <<: *demonstration
  variables:
    STAGE: "primary"

demonstration:second:
  <<: *demonstration
  variables:
    STAGE: "secondary"
```

Then trigger a pipeline by pushing a commit. After `demonstration:first` is done, the following error message will appear on the `demonstration:second`'s terminal when it starts:

```shell
Error: unable to remove file "./home/foo/bar.txt"
```

The issue is rooted to the file owner and its permission. Since the file-creating script is run by `root`, which causes the files created by mounting `./home/:/home/` belong to `root`, and the jobs are run by `gitlab-runner`, which doesn't have permission to modify `root` files, the cleanup performed automatically by the jobs will fail due to insufficient permission. This is how the project folder within the runner looks like now:

```shell
# highlight-start
└── 📁home
    └── foo
        └── bar.txt
# highlight-end
└── Dockerfile
└── helper-build.sh
└── helper-run.sh
```

## Solution

### Prerequesites

The permission issue happens every time the runner checks out the repository, which would stop the runner from running any of its job scripts. To resolve it, we need to first comment out the problematic jobs `demonstration:first` and `demonstration:second`, and then add the following to `.gitlab-ci.yml`:

```yaml
variables:
  GIT_STRATEGY: "fetch"

default:
  before_script: |
    bash helper-docker-permit.sh
    echo "$CI_REGISTRY_PASSWORD" | \
    docker login \
      "$CI_REGISTRY" \
      --username "$CI_REGISTRY_USER" \
      --password-stdin
  after_script: |
    bash helper-docker-permit.sh
```

After that, push to trigger a pipeline. The job will still fail, however, the newest commit has been checked out and available on the runner. Modify `GIT_STRATEGY` to `none` and push it again:

```yaml
variables:
  GIT_STRATEGY: "none"
```

The runners are now back to normal and the permission will not appear and stop the jobs from running.

### Own Dockerfile

```shell
docker run --rm \
    --user "root" \
    --volume "./home/:/home/" \
    "baz:latest" \
    "bash" "-c" \
        "
            sudo chmod --recursive 777 /home/ && \
            sudo chown --recursive gitlab-runner:gitlab-runner /home/
        "
```

:::info
You only need to run either `chmod` or `chown` to the mounted location. However, running both of them will still work.
:::

### Third-Party Dockerfile

```shell
docker pull \
    "$DOCKER_IMAGE_PROTOC_GEN_DOC"
    touch "./Dockerfile"
    echo "FROM $DOCKER_IMAGE_PROTOC_GEN_DOC" > "./Dockerfile"
    echo "USER $(id --user)" >> "./Dockerfile"
    docker build \
      --file "./Dockerfile" \
      --tag "$CI_PROJECT_NAME/protoc-gen-doc" \
      "./"
    mkdir --parent "./-/document/"
    chmod --recursive 777 "./-/document/"
    docker run \
      --volume "./-/document/:/out/" \
      --volume "./source/protocol-buffers/:/protos/" \
      --network "host" \
      --rm \
      "$CI_PROJECT_NAME/protoc-gen-doc"
```
