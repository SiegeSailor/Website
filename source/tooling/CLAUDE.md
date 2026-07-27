# CLAUDE.md — source/tooling

The builders that turn [`../content/`](../content/CLAUDE.md) into the resume,
the profile README, and the version list.

- [`README.md`](./README.md) — what each script writes and why the Docker image
  exists.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a builder or
  the `Dockerfile`.** It owns the build commands, what a builder must not do,
  the two-loader rule, the resume layout notes, and how to take a Debian update.
- [`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md) — the resume
  constraints the builders serve.

The one that is silent when broken: the page-count check exits 0 when
LibreOffice or poppler is missing, so a host build proves nothing about the
one-page constraint — [why](./CONTRIBUTING.md#building).
