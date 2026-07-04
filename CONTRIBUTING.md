# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This is a statically exported Next.js website served from S3 behind CloudFront. To contribute to this project, please follow the guidelines below.

### Conventions

Following conventions are used in this project:

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style)
- [Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [AWS Tagging Best Practices and Strategies](https://docs.aws.amazon.com/tag-editor/latest/userguide/best-practices-and-strats.html)
  - [Cost Visibility](https://aws.amazon.com/blogs/aws-cloud-financial-management/gs-create-and-enforce-your-tagging-strategy-for-more-granular-cost-visibility/)
- [GitHub Community Standards](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions) for community health files

## Prerequisites

Required software:

- [AWS CLI](https://aws.amazon.com/cli/): `2.32.11`
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

Build the static export to verify everything is working correctly; the artifacts are generated in `docker-context/export/`:

```shell
npm run build
```

### Building the Resume and Profile

[`docker-context/files/resume/Resume.yaml`](./docker-context/files/resume/Resume.yaml) is the single source of truth for the resume documents and the data-driven sections of the profile page. Almost any node in it can carry a `variants:` list; a node without one appears everywhere. Current variants:

- `professional`: one-page resume, impact and scale focus
- `academic`: two-page resume, systems and leadership focus
- `profile`: website profile page only

After editing `Resume.yaml`, rebuild the resume documents and the profile document:

```shell
npm run build:resume
npm run build:profile
```

`build:resume` writes `.docx` files to `export/resume/`, converting to `.pdf` (LibreOffice) and `.txt` (pandoc) when those tools are available, and verifies the page counts against the PDFs. `build:profile` regenerates the sections between the `generated` markers in [`files/documents/Profile.md`](./docker-context/files/documents/Profile.md), and runs automatically before `build`.

To run the full pipeline without local LibreOffice and pandoc, generate through the Docker image from the root directory:

```shell
bash scripts/generate-resume.sh "docker-context/export/resume" "linux/arm64"
```

Resume constraints (see [`CLAUDE.md`](./CLAUDE.md) for the full list):

- The `professional` variant must fit one US-Letter page; `academic` is two pages by design. The build fails otherwise.
- Keep the layout ATS-safe: single column, no tables or text boxes, native Word bullets, dates right-aligned with tab stops.
- Never flatten the stacked role lines (CooperSurgical, Servicetech) into a single title and date range.

### Linting the Dockerfile

The Docker image only builds the resume documents. Lint the Dockerfile using Hadolint from the root directory:

```shell
bash scripts/hadolint.sh
```

### Troubleshooting

Next.js doesn't render `<title />` tags in `<head />` when there is an error in the pages. I am assuming that the page components are rendered before generating/aggregating all the head elements in `metadata`.

## Deployment

The website is a static export stored in S3 and served by CloudFront; the deployment is defined in [`infrastructure/`](./infrastructure/) (a single flat Terraform environment) and applied automatically by CI.

### AWS Credentials

Retrieve AWS Access Key ID and Security Access Key from [IAM / Security Credentials / Create Access Key](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials/access-key-wizard) and configure AWS CLI by running the following to store credentials in `~/.aws/credentials`. This will allow Terraform to use the credentials automatically for the `aws` provider:

```shell
aws configure
```

> [!note]
> Run `aws sts get-caller-identity` to verify the account and user identities.

### Manual Deployment

Run the Terraform workflow from the infrastructure directory:

```shell
(cd infrastructure/
terraform init
terraform fmt
tflint
terraform validate
terraform plan
terraform apply)
```

To deploy content changes, build the site and resume documents, then sync to the site bucket and invalidate the cache:

```shell
(cd docker-context && npm run build)
bash scripts/generate-resume.sh "docker-context/export/documents"
(cd infrastructure/
aws s3 sync ../docker-context/export "s3://$(terraform output -raw site_bucket_name)" --delete --exclude "*.DS_Store"
aws cloudfront create-invalidation --distribution-id "$(terraform output -raw cloudfront_distribution_id)" --paths "/*")
```

### Automatic Production Deployment

GitHub Actions workflow [`production.yml`](./.github/workflows/production.yml) deploys on pushes to `main` when files under `docker-context/` or `infrastructure/` change: it builds the static site and resume documents, applies Terraform, syncs the export to S3, and invalidates the CloudFront cache.

Configure these on the `production` environment:

- Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Variables: `AWS_REGION`

### Releases

GitHub Actions workflow [`release.yml`](./.github/workflows/release.yml) runs [semantic-release](https://semantic-release.gitbook.io/) (configured in [`release.config.mjs`](./release.config.mjs)) on every push to `main`. Commit messages determine the version bump per Conventional Commits: `fix:` patches, `feat:` minors, and `BREAKING CHANGE` majors; other types cut no release. Each release:

- Tags the commit `vX.Y.Z` and updates [`CHANGELOG.md`](./CHANGELOG.md), `package.json`, and `package-lock.json` back on `main`
- Builds the resume documents with [`generate-resume.sh`](./scripts/generate-resume.sh), stamping the version into the document metadata, and attaches them as release assets alongside workflow artifacts

The deployed site serves the resume documents at `https://jinyu-zhang.com/documents/<document>` — the URL the `README.md` badges and the profile page resume button link to. The repository is private, so release asset URLs only work for authenticated collaborators.
