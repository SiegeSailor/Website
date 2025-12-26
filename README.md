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

- [ ] Add fluent-bit back for ECS (https://github.com/terraform-aws-modules/terraform-aws-ecs/issues/381#event-21751869604)
- [ ] Add lint and checks
- [ ] Slots for article and profile pages (https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)
- [ ] Tokenize articles for search
- [ ] Metadata files (https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [ ] Footer
- [ ] Realtime logs for Cloudfront
- [ ] Change `-` to `/` for links
- [ ] Change `()` start word
- [ ] Review feature (AI automated reviewers)
- [ ] Mermaid charts are smaller if their size is bigger than the container and are not rendered as the first page (Maybe only in development). It is smaller when it is rendered as the first page in production. Only the first time after pushing-refresh (cache invalid due to file changes, hence online website updates automatically)
- [x] Share OG images
- [x] Update profile: Vite, lints
- [x] Finish drafts
- [~] Move page-only components to pages
- [~] Add cards: Git commits, LeetCode commits, articles number
- [x] Add feature articles in /blog
- [x] article view scrollbar
- [x] table view 100%
- [x] issue board and Change log for features: subscribe for email notifications, articles, paper with Emma, compiling repo
- [x] AI documents
- [x] Move this to README.md
- [x] Cloudfront for Next.js static files
