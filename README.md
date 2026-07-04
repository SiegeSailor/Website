# Website

[![Static Production](https://github.com/SiegeSailor/Website/actions/workflows/static-production.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/static-production.yml)
[![Release](https://github.com/SiegeSailor/Website/actions/workflows/release.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/release.yml)
[![Version](https://img.shields.io/github/v/release/SiegeSailor/Website?logo=semanticrelease&logoColor=white)](https://github.com/SiegeSailor/Website/releases/latest)
[![Resume: Professional](https://img.shields.io/badge/Resume-Professional-0078D4?logo=readdotcv&logoColor=white)](https://github.com/SiegeSailor/Website/releases/latest/download/JinYu-Zhang-Resume-Professional.pdf)
[![Resume: Academic](https://img.shields.io/badge/Resume-Academic-A31F34?logo=readdotcv&logoColor=white)](https://github.com/SiegeSailor/Website/releases/latest/download/JinYu-Zhang-Resume-Academic.pdf)

My personal website. Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for development and deployment, and [`instructions/`](./.github/instructions/) folder for detailed instructions on contributing to relevant parts of the project.

## Resume

[`docker-context/files/resume/Resume.yaml`](./docker-context/files/resume/Resume.yaml) is the single source of truth for both the resume documents and the [profile page](https://jinyu-zhang.com/profile). The [`release.yml`](./.github/workflows/release.yml) workflow versions the project with [semantic-release](https://semantic-release.gitbook.io/) on every push to `main`, renders the resume into ATS-safe `.docx`, `.pdf`, and `.txt` documents in two variants, and attaches them to every [release](https://github.com/SiegeSailor/Website/releases); the badges above always link to the latest version:

- **Professional**: one page, impact and scale focus
- **Academic**: two pages, systems and leadership focus

## License

This project is licensed with dual licenses:

- **Documentation and Blog Posts**: [CC BY 4.0](/LICENSE-CC-BY.md)
- **Code and Code Snippets**: [MIT](/LICENSE-MIT.md)
