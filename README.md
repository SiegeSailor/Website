# Website

[![Production](https://github.com/SiegeSailor/Website/actions/workflows/production.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/production.yml)
[![Release](https://github.com/SiegeSailor/Website/actions/workflows/release.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/release.yml)
[![Resume: Professional](https://img.shields.io/badge/Resume-Professional-0078D4?logo=readdotcv&logoColor=white)](https://jinyu-zhang.com/documents/JinYu-Zhang-Resume-Professional.pdf)
[![Resume: Academic](https://img.shields.io/badge/Resume-Academic-A31F34?logo=readdotcv&logoColor=white)](https://jinyu-zhang.com/documents/JinYu-Zhang-Resume-Academic.pdf)

My personal website — a statically exported Next.js site served from S3 behind CloudFront. Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for development and deployment, and the `CLAUDE.md` files ([root](./CLAUDE.md), [application](./website/CLAUDE.md), [content](./content/CLAUDE.md), [articles](./website/files/articles/CLAUDE.md)) for detailed instructions on contributing to relevant parts of the project.

## Resume and Profile

[`content/`](./content/) is the single source of truth for four generated outputs, found at:

- **Professional resume** (one page): <https://jinyu-zhang.com/documents/JinYu-Zhang-Resume-Professional.pdf>
- **Academic resume** (two pages): <https://jinyu-zhang.com/documents/JinYu-Zhang-Resume-Academic.pdf>
- **Website profile**: <https://jinyu-zhang.com> and <https://jinyu-zhang.com/about>
- **GitHub profile README**: <https://github.com/SiegeSailor>

Resume documents are also attached to every [release](https://github.com/SiegeSailor/Website/releases). See [`CONTRIBUTING.md`](./CONTRIBUTING.md#building-the-resume-profile-and-readme) for how each output is built and published.

## License

This project is licensed with dual licenses:

- **Documentation and Blog Posts**: [CC BY 4.0](/LICENSE-CC-BY.md)
- **Code and Code Snippets**: [MIT](/LICENSE-MIT.md)
