# Website

[![CI](https://github.com/SiegeSailor/Website/actions/workflows/ci.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/ci.yml)
[![Production](https://github.com/SiegeSailor/Website/actions/workflows/production.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/production.yml)
[![Release](https://github.com/SiegeSailor/Website/actions/workflows/release.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/release.yml)

My personal website. A statically exported Next.js site served from S3 behind CloudFront, including my resume and GitHub profile README. Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for development and deployment, and the `CLAUDE.md` files ([root](./CLAUDE.md), [application](./website/CLAUDE.md), [resume content](./content/resume/CLAUDE.md), [articles](./content/articles/CLAUDE.md)) for detailed instructions on contributing to relevant parts of the project.

## Resume and Profile

[`content/resume/`](./content/resume/) is the single source of truth for three generated outputs, found at:

- **Resume** (one page): <https://jinyu-zhang.com/documents/JinYu-Zhang-Resume.pdf>
- **Website profile**: <https://jinyu-zhang.com> and <https://jinyu-zhang.com/about>
- **GitHub profile README**: <https://github.com/SiegeSailor>

Resume documents are also attached to every [release](https://github.com/SiegeSailor/Website/releases). See [`CONTRIBUTING.md`](./CONTRIBUTING.md#building-the-resume-profile-and-readme) for how each output is built and published.

## License

This project is licensed with dual licenses:

- **Documentation and Blog Posts**: [CC BY 4.0](/LICENSE-CC-BY.md)
- **Code and Code Snippets**: [MIT](/LICENSE-MIT.md)
