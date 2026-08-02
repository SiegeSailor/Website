# source/tooling

Renders [`../content/`](../content/README.md) into the documents the website does not build: the resume, the README, and the project version list. It does **not** build the website, which is built on the host with `npm run build`.

| Script                                               | Reads Consumer | Writes                                        |
| ---------------------------------------------------- | -------------- | --------------------------------------------- |
| [`build-readme.mjs`](./scripts/build-readme.mjs)     | `readme`       | `export/SiegeSailor-README.md`                |
| [`build-resume.mjs`](./scripts/build-resume.mjs)     | `resume`       | `export/resume/JinYu-Zhang-Resume.{docx,pdf}` |
| [`build-versions.mjs`](./scripts/build-versions.mjs) | `versions`     | `../content/resume/versions.generated.json`   |
| [`load-content.mjs`](./scripts/load-content.mjs)     | —              | The loader the other 3 share                  |

`build-versions.mjs` runs first: the other 2 read the JSON it writes. It is resilient by design — any network, auth, or 404 failure is skipped, the existing JSON is preserved, and it always exits 0, so an offline build never fails and the affected project simply shows no version chip.

The workspace depends on `js-yaml` and `docx` only. That is deliberate: the Docker image installs ~22 packages instead of the website's ~1,400, which is also why `load-content.mjs` is a hand-kept twin rather than a shared import — [`CLAUDE.md`](./CLAUDE.md#the-2-loaders-are-twins) owns what that costs.

## The Docker Image

[`Dockerfile`](./Dockerfile) exists because the resume needs LibreOffice, poppler, and the Carlito font, none of which ship on a GitHub Actions runner. Pinning them is what makes the page-count check meaningful and keeps a rendered PDF identical between a laptop and CI — a locally installed LibreOffice is a different version and may disagree on page counts.

- The build context is the repository root with `source/tooling/Dockerfile`, and the root `.dockerignore` allowlists only `source/content/resume/`, `source/tooling/`, and the root manifests, so the context stays under 1 MB
- Only the `source/tooling` workspace is installed, with `--ignore-scripts` because the root `prepare` runs Husky and needs a `.git` the context excludes
- Apt packages resolve against [snapshot.debian.org](https://snapshot.debian.org) at the `DEBIAN_SNAPSHOT` timestamp, which freezes the entire dependency closure rather than the 3 named packages
- Building the image is what generates the artifacts: the `resume` stage runs `build:resume` and `build:readme`

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the commands, the resume layout notes, and how to take a Debian update.
