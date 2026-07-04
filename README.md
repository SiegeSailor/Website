# Website

[![Static Production](https://github.com/SiegeSailor/Website/actions/workflows/static-production.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/static-production.yml)
[![Resume](https://github.com/SiegeSailor/Website/actions/workflows/resume.yml/badge.svg)](https://github.com/SiegeSailor/Website/actions/workflows/resume.yml)
[![Resume: Professional](https://img.shields.io/badge/Resume-Professional-0078D4?logo=readdotcv&logoColor=white)](https://github.com/SiegeSailor/Website/releases/download/resume/JinYu-Zhang-Resume-Professional.pdf)
[![Resume: Academic](https://img.shields.io/badge/Resume-Academic-A31F34?logo=readdotcv&logoColor=white)](https://github.com/SiegeSailor/Website/releases/download/resume/JinYu-Zhang-Resume-Academic.pdf)

My personal website. Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for development and deployment, and [`instructions/`](./.github/instructions/) folder for detailed instructions on contributing to relevant parts of the project.

## Resume

[`docker-context/files/resume/Resume.yaml`](./docker-context/files/resume/Resume.yaml) is the single source of truth for both the resume documents and the [profile page](https://jinyu-zhang.com/profile). The [`resume.yml`](./.github/workflows/resume.yml) workflow renders it into ATS-safe `.docx`, `.pdf`, and `.txt` documents in two variants, uploads them as workflow artifacts, and publishes them to the rolling [`resume`](https://github.com/SiegeSailor/Website/releases/tag/resume) release that the badges above link to:

- **Professional**: one page, impact and scale focus
- **Academic**: two pages, systems and leadership focus

## License

This project is licensed with dual licenses:

- **Documentation and Blog Posts**: [CC BY 4.0](/LICENSE-CC-BY.md)
- **Code and Code Snippets**: [MIT](/LICENSE-MIT.md)
