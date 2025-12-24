# Website

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This is a monorepo for the SiegeSailor's personal website. Please see each modules' `README.md` for requirements, `CONTRIBUTING.md` for contribution guidelines, and [`instructions/`](./.github/instructions/) folder for detailed instructions on contributing to relevant parts of the project.

## Prerequisites

Required software for the every modules:

- [AWS CLI](https://aws.amazon.com/cli/): `2.32.11`
- [Container Structure Test](https://github.com/GoogleContainerTools/container-structure-test): `1.19.3`
- [Docker](https://www.docker.com/): `28.5.2`
- [Hadolint](https://github.com/hadolint/hadolint): `2.14.0`
- [Terraform](https://developer.hashicorp.com/terraform): `1.14.1`
- [TFLint](https://github.com/terraform-linters/tflint): `0.60.0`

## Modules

- [Client](./client/README.md): A SSR Web application

## Todos

- [ ] Add lint and checks
- [ ] Share OG images
- [ ] Tokenize articles for search
- [ ] Metadata files
- [x] Update profile: Vite, lints
- [ ] Finish drafts
- [~] Move page-only components to pages
- [~] Add cards: Git commits, LeetCode commits, articles number
- [x] Add feature articles in /blog
- [ ] Review feature (AI automated reviewers)
- [x] Mermaid charts are smaller if their size is bigger than the container and are not rendered as the first page (Maybe only in development). It is smaller when it is rendered as the first page in production.
- [x] article view scrollbar
- [x] table view 100%
- [x] issue board and Change log for features: subscribe for email notifications, articles, paper with Emma, compiling repo
- [x] AI documents
- [ ] Move this to README.md
- [ ] Change `-` to `/` for links
- [ ] Change `()` start word
- [ ] Cloudfront for Next.js static files
