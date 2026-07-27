# Website

[![pull-request: Verify](https://github.com/SiegeSailor/Website/actions/workflows/pull-request-verify.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/pull-request-verify.yml)
[![main: Deploy](https://github.com/SiegeSailor/Website/actions/workflows/main-deploy.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/main-deploy.yml)
[![main: Profile](https://github.com/SiegeSailor/Website/actions/workflows/main-profile.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/main-profile.yml)
[![main: Release](https://github.com/SiegeSailor/Website/actions/workflows/main-release.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/main-release.yml)

The personal website of Jin Yu (Ken) Zhang: a statically exported Next.js site
served from S3 behind CloudFront. One folder of authored content feeds all three
published outputs, so a name, a title, or a link is written once and appears
everywhere.

| Output                | Published at                                                |
| --------------------- | ----------------------------------------------------------- |
| Website               | <https://jinyu-zhang.com> · <https://jinyu-zhang.com/about> |
| Resume (one page)     | <https://jinyu-zhang.com/documents/JinYu-Zhang-Resume.pdf>  |
| GitHub profile README | <https://github.com/SiegeSailor>                            |

The resume documents are also attached to every
[release](https://github.com/SiegeSailor/Website/releases).

## Documentation

Every scope carries the same three documents — `README.md` says what it is,
`CONTRIBUTING.md` says how to work on it, and `CLAUDE.md` states the rules that
must not be broken. Anything true of more than one scope lives at the root and
is linked from the scopes rather than repeated.

| Scope                                  | Contents                                          | Documents                                                                                                                      |
| -------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Root                                   | Shared setup, conventions, commits, and workflows | [CONTRIBUTING](./CONTRIBUTING.md) · [CLAUDE](./CLAUDE.md)                                                                      |
| [`source/website/`](./source/website/) | The Next.js application                           | [README](./source/website/README.md) · [CONTRIBUTING](./source/website/CONTRIBUTING.md) · [CLAUDE](./source/website/CLAUDE.md) |
| [`source/tooling/`](./source/tooling/) | The document builders and their image             | [README](./source/tooling/README.md) · [CONTRIBUTING](./source/tooling/CONTRIBUTING.md) · [CLAUDE](./source/tooling/CLAUDE.md) |
| [`source/content/`](./source/content/) | The authored resume source and blog posts         | [README](./source/content/README.md) · [CONTRIBUTING](./source/content/CONTRIBUTING.md) · [CLAUDE](./source/content/CLAUDE.md) |
| [`infrastructure/`](./infrastructure/) | The Terraform environment on AWS                  | [README](./infrastructure/README.md) · [CONTRIBUTING](./infrastructure/CONTRIBUTING.md) · [CLAUDE](./infrastructure/CLAUDE.md) |
| [`scripts/`](./scripts/)               | The shell scripts the npm scripts call            | [README](./scripts/README.md) · [CONTRIBUTING](./scripts/CONTRIBUTING.md) · [CLAUDE](./scripts/CLAUDE.md)                      |

## License

This project is licensed with dual licenses:

- **Documentation and Blog Posts**: [CC BY 4.0](./LICENSE-CC-BY.md)
- **Code and Code Snippets**: [MIT](./LICENSE-MIT.md)
