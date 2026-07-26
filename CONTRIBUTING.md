# Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This is a statically exported Next.js website served from S3 behind CloudFront. To contribute to this project, please follow the guidelines below.

The repository is an npm workspace with three top-level folders: `website/` (the Next.js app), `tooling/` (the `Dockerfile` and the résumé / README build scripts), and `content/` (all authored content: `content/resume/`, the YAML single source of truth both consume, and `content/articles/`, the blog posts). The root `package.json` owns the version and the only `package-lock.json`; every command below runs from the repository root.

### Prerequisites

Required to develop the website:

- [Node.js](https://nodejs.org/): `26.5.0` and npm `11.17.0` — pinned in [`.nvmrc`](./.nvmrc), required by every `engines` field, read by CI, and matched by the image. Run `nvm install` to pick it up.

Required to generate the résumé documents and the profile README:

- [Docker](https://www.docker.com/): `29.4.0`
- [Hadolint](https://github.com/hadolint/hadolint): `2.14.0` (only to lint the `Dockerfile`)

Required to deploy:

- [AWS CLI](https://aws.amazon.com/cli/): `2.32.11`
- [Terraform](https://developer.hashicorp.com/terraform): `1.14.1`
- [TFLint](https://github.com/terraform-linters/tflint): `0.60.0`

## Development

To set up the development environment with hot-reloading, run the following from the repository root. A single `npm ci` installs both workspaces from the root lockfile:

```shell
npm ci
npm run watch
```

Editing anything in `content/` hot-reloads the pages built from it, because the website imports those files as raw text.

Build the static export to verify everything is working correctly; the artifacts are generated in `website/export/`:

```shell
npm run build
```

### Conventions

Following conventions are used in this project:

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [GitHub Community Standards](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions)
- [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/)
- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style)
- [Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [AWS Tagging Best Practices and Strategies](https://docs.aws.amazon.com/tag-editor/latest/userguide/best-practices-and-strats.html)
  - [Cost Visibility](https://aws.amazon.com/blogs/aws-cloud-financial-management/gs-create-and-enforce-your-tagging-strategy-for-more-granular-cost-visibility/)

### Linting and Formatting

The Next.js app is linted with ESLint (`eslint-config-next`) and formatted with
Prettier. Both run automatically on `git commit` through a Husky `pre-commit`
hook that calls [lint-staged](https://github.com/lint-staged/lint-staged):
staged files are formatted and autofixed in place and re-staged, `tsc --noEmit`
runs when a `.ts`/`.tsx` file is staged, and the commit is aborted if anything
fails. The hook is installed by `npm ci` at the root (the `prepare` script), so
no extra setup is needed — pass `--no-verify` to skip it, or set `HUSKY=0` to
stop installing it altogether.

Run the same checks by hand across the whole app at any time; CI runs them on
every pull request and blocks the production deploy if any fail:

```shell
npm run format        # Prettier: format code in place
npm run format:check  # Prettier: verify formatting (CI uses this)
npm run lint          # ESLint
npm run lint:fix      # ESLint with autofix
npm run typecheck     # tsc --noEmit
```

Prettier owns formatting; ESLint owns correctness. Prettier now runs from the
root and so covers `tooling/` and the root Markdown too; ESLint stays scoped to
`website/`, where its config lives. Authored content — all of
`content/` — is excluded from Prettier so prose and the hand-tuned résumé
source stay untouched, by the hook as well as by the manual commands. Terraform
and the shell scripts are covered by neither.

### Building the Resume, Profile, and README

[`content/resume/`](./content/resume/) is the single source of truth for four generated outputs. It is split one YAML file per top-level key (`profile.yaml`, `experience.yaml`, `skills.yaml`, …) and every consumer merges them back into one object, so **a key must appear in exactly one file**. [`content/resume/CLAUDE.md`](./content/resume/CLAUDE.md) maps each file to the outputs that read it.

| Output                         | Script                                                                                    | Local generated files                                                                                  | Published to the public by                                                                                                                                                                                                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Professional resume (one page) | `npm run build:resume` ([`build-resume.mjs`](./tooling/scripts/build-resume.mjs))         | `tooling/export/resume/JinYu-Zhang-Resume-Professional.{docx,pdf,txt}`                                 | [`production.yml`](./.github/workflows/production.yml) rebuilds it into `export/documents/` via [`docker-copy.sh`](./scripts/docker-copy.sh) and syncs to S3 → <https://jinyu-zhang.com/documents/JinYu-Zhang-Resume-Professional.pdf>; [`release.yml`](./.github/workflows/release.yml) also attaches it to every GitHub release |
| Academic resume (two pages)    | `npm run build:resume` ([`build-resume.mjs`](./tooling/scripts/build-resume.mjs))         | `tooling/export/resume/JinYu-Zhang-Resume-Academic.{docx,pdf,txt}`                                     | Same as the professional resume → <https://jinyu-zhang.com/documents/JinYu-Zhang-Resume-Academic.pdf>                                                                                                                                                                                                                             |
| Website profile pages          | `npm run build` (read at build time by [`resume.ts`](./website/helpers/server/resume.ts)) | `website/export/index.html` (hero) and `website/export/about.html`                                     | [`production.yml`](./.github/workflows/production.yml) syncs `export/` to S3 and invalidates CloudFront → <https://jinyu-zhang.com> and <https://jinyu-zhang.com/about>                                                                                                                                                           |
| GitHub profile README          | `npm run build:readme` ([`build-readme.mjs`](./tooling/scripts/build-readme.mjs))         | `tooling/export/SiegeSailor-README.md` (`docker-copy.sh` copies it to `website/SiegeSailor-README.md`) | [`production.yml`](./.github/workflows/production.yml) pushes it to `SiegeSailor/SiegeSailor` when it changed → <https://github.com/SiegeSailor>                                                                                                                                                                                  |

The resume documents render in two variants driven by `variants:` tags in the YAML — `professional` (one page, impact and scale focus) and `academic` (two pages, systems and leadership focus); a node without a `variants:` list appears in both. The website and the profile README don't use variants: they read whole keys — the `profile:` block, `projects:`, `summary.professional`, and the first `experience` entry for the home-page hero.

After editing `Resume.yaml`:

```shell
npm run build:resume      # .docx into tooling/export/resume/, plus .txt with pandoc and .pdf with LibreOffice
npm run build:versions    # latest GitHub release per project -> content/resume/versions.generated.json
npm run build:readme      # content/resume/ -> tooling/export/SiegeSailor-README.md (the GitHub profile README)
```

`build:resume` degrades instead of failing when a tool is absent: no pandoc means no `.txt`, no LibreOffice means no `.pdf`, and — because the page-count check reads the rendered PDF with `pdfinfo` — **no LibreOffice or no poppler also means no page-count check**. It prints `skipped ...` for each and still exits `0`, so a bare `npm run build:resume` on a host without those three tools produces a `.docx` whose one-page constraint was never verified. Build through Docker (below) to get the checked artifacts; that is the only path where the check is guaranteed to run, and the only one with pinned LibreOffice and font versions.

`build:versions` runs automatically before `build` and is resilient: if GitHub is unreachable it omits the missing versions (the `/about` chip falls back to the project stage) and never fails the build.

To run the full pipeline with pinned tool versions — and without needing local LibreOffice and pandoc — build the image and copy the artifacts out. This builds the image (which runs `build:resume` and `build:readme`) and copies the résumé documents plus the profile README (`website/SiegeSailor-README.md`) out:

```shell
bash scripts/docker-copy.sh "tooling/export/resume" "linux/arm64"
```

The Docker build context is the repository root with `tooling/Dockerfile`, and `.dockerignore` allowlists only what the image needs, so the context stays under 1 MB.

Resume constraints (see [`CLAUDE.md`](./CLAUDE.md) for the full list):

- The `professional` variant must fit one US-Letter page; `academic` is two pages by design. The build fails otherwise.
- Keep the layout ATS-safe: single column, no tables or text boxes, native Word bullets, dates right-aligned with tab stops.
- Never flatten the stacked role lines (CooperSurgical, Servicetech) into a single title and date range.

### The Docker image

[`tooling/Dockerfile`](./tooling/Dockerfile) builds the resume documents and the GitHub profile README — it does not build the website, which is built on the host with `npm run build`. It exists because those documents need LibreOffice, pandoc, poppler, and the Carlito font, none of which ship on the GitHub Actions runners; pinning them in an image is what keeps the résumé page-count check meaningful and the rendered PDFs identical between a laptop and CI. A locally installed LibreOffice is a different version and may disagree on page counts.

The image installs only the `tooling` workspace, so it pulls ~22 packages rather than the website's ~1,400, and the root `.dockerignore` allowlists only `content/resume/`, `tooling/`, and the root manifests.

Lint the Dockerfile using Hadolint from the root directory:

```shell
bash scripts/hadolint.sh
```

Apt packages resolve against [snapshot.debian.org](https://snapshot.debian.org) at the timestamp in the `DEBIAN_SNAPSHOT` build argument, which freezes the entire dependency closure rather than just the four packages named in the `apt-get install`. Taking Debian security updates is therefore a deliberate step, not something that happens on the next rebuild:

```shell
# Find the current candidate versions, then bump DEBIAN_SNAPSHOT and the pins together.
docker run --rm node:26.5.0-trixie-slim \
  bash -c 'apt-get update -qq && apt-cache policy libreoffice-writer pandoc poppler-utils fonts-crosextra-carlito'
```

The default timestamp matches the one the base image was built against, which the image records in the comments of `/etc/apt/sources.list.d/debian.sources`. After bumping, rebuild and confirm the page counts still pass — a LibreOffice or Carlito change can shift the résumé layout.

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
npm run build
bash scripts/docker-copy.sh "website/export/documents"
(cd infrastructure/
aws s3 sync ../website/export "s3://$(terraform output -raw site_bucket_name)" --delete --exclude "*.DS_Store"
aws cloudfront create-invalidation --distribution-id "$(terraform output -raw cloudfront_distribution_id)" --paths "/*")
```

### Automatic Production Deployment

GitHub Actions workflow [`production.yml`](./.github/workflows/production.yml) deploys on pushes to `main` when files under `website/`, `tooling/`, `content/`, or `infrastructure/` change: it builds the static site and resume documents, applies Terraform, syncs the export to S3, invalidates the CloudFront cache, and regenerates and pushes the GitHub profile README to `SiegeSailor/SiegeSailor` (only when it changed).

Configure these on the `production` environment:

- Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `SIEGESAILOR_PAT` (a Personal Access Token with `contents: write` on `SiegeSailor/SiegeSailor`, used only for the profile README sync)
- Variables: `AWS_REGION`

### Releases

GitHub Actions workflow [`release.yml`](./.github/workflows/release.yml) runs [semantic-release](https://semantic-release.gitbook.io/) (configured in [`release.config.mjs`](./release.config.mjs)) on every push to `main`. Commit messages determine the version bump per Conventional Commits: `fix:` patches, `feat:` minors, and `BREAKING CHANGE` majors; other types cut no release. Each release:

- Tags the commit `vX.Y.Z`, publishes a GitHub Release whose notes are generated from the commits, and updates the root `package.json` and `package-lock.json` back on `main`
- Builds the resume documents with [`docker-copy.sh`](./scripts/docker-copy.sh), stamping the version into the document metadata, and attaches them as release assets alongside workflow artifacts

The deployed site serves the resume documents at `https://jinyu-zhang.com/documents/<document>` — the URL the `README.md` badges and the profile page resume button link to. The repository is private, so release asset URLs only work for authenticated collaborators.
