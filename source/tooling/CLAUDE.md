# CLAUDE.md — source/tooling

The builders that turn [`../content/`](../content/CLAUDE.md) into the resume, the profile README, and the version list.

| Document                                                     | Owns                                                                                                                                                                               |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md) | The resume constraints the builders serve                                                                                                                                          |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)                       | **Read before editing a builder or the `Dockerfile`**: the build commands, what a builder must not do, the 2-loader rule, the resume layout notes, and how to take a Debian update |
| [`README.md`](./README.md)                                   | What each script writes and why the Docker image exists                                                                                                                            |

The one that is silent when broken: the page-count check exits 0 when LibreOffice or poppler is missing, so a host build proves nothing about the one-page constraint — [why](./CONTRIBUTING.md#building).
