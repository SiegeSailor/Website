# Contributing to source/tooling

Read the [root guide](../../CONTRIBUTING.md) first for setup and for where commands run.

## Building

```shell
npm run build:versions    # must run first; the other 2 read its JSON
npm run build:readme
npm run build:resume
```

`build:resume` degrades instead of failing when a tool is absent: no LibreOffice means no `.pdf`, and — because the page-count check reads the rendered PDF with `pdfinfo` — **no LibreOffice or no poppler also means no page-count check**. It prints `skipped …` for each and still exits 0, so a bare `npm run build:resume` can produce a `.docx` whose one-page constraint was never verified.

Build through Docker for the checked artifacts with pinned LibreOffice and font versions. This builds the image, which runs both builders, and copies the resume documents plus the README out:

```shell
bash scripts/docker-copy.sh "source/tooling/export/resume" "linux/arm64"
bash scripts/hadolint.sh   # lint the Dockerfile
```

`hadolint.sh` needs hadolint on the `PATH` locally and says so when it is missing — [`scripts/CLAUDE.md`](../../scripts/CLAUDE.md#per-script-constraints) owns how it runs in CI.

Because `npm run build` includes `build:resume`, a host that _does_ have LibreOffice and poppler runs the page-count check on every site build, against a version this repository does not pin. When a local build disagrees, build through Docker to settle whether the overflow is real.

> [!important]
> [`CLAUDE.md`](./CLAUDE.md) states what a builder must never do and why the 2 loaders are hand-kept twins. The resume constraints they serve are in [`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md).

## Resume Layout Notes

Hard-won; do not rediscover them.

- **Import `js-yaml` as `import { load } from "js-yaml"`**: The default import fails under Node.js ESM
- **Inspect Visually When Text Metrics Matter**: `pdftoppm -jpeg -r 80 source/tooling/export/resume/<file>.pdf /tmp/page`
- **LibreOffice Ignores the `docx` `PositionalTab`**: Right-aligned dates use classic paragraph `tabStops` (`TabStopType.RIGHT` at 10656 twips) plus a literal `"\t"` in the `TextRun`
- **On Linux, Calibri Is Absent**: Install `fonts-crosextra-carlito`, which is metric-compatible, or page breaks shift; the Docker `resume` stage does this
- **Typography Constants Sit at the Top of `build-resume.mjs`**: `SZ` (half-points; body 19 = 9.5 pt), `SPACE` (twips), line spacing 226, and page margins 600/792 twips — spacing was already tightened to keep Certifications on the page, so headroom is small

To fit one page, in order of preference: drop a bullet's `resume` consumer > tighten wording > merge skill groups > shave `SPACE` constants > reduce font size, as a last resort, but never below 9.5 pt body.

## Taking a Debian Update

Apt pins are frozen at the `DEBIAN_SNAPSHOT` timestamp, so security updates are a deliberate step rather than something the next rebuild picks up:

```shell
# Find the current candidate versions, then bump DEBIAN_SNAPSHOT and the pins together.
docker run --rm node:26.5.0-trixie-slim \
  bash -c 'apt-get update -qq && apt-cache policy libreoffice-writer poppler-utils fonts-crosextra-carlito'
```

The default timestamp matches the one the base image was built against, which the image records in the comments of `/etc/apt/sources.list.d/debian.sources`. After bumping, rebuild and confirm the page count still passes — a LibreOffice or Carlito change can shift the layout.

## Adding a Builder

A new output means a new consumer name, so it touches both sides:

1. Add the script under `scripts/`, loading its content with `loadContent("<consumer>")` rather than reading files itself
2. Declare the consumer on the content files that feed it, and document it in [`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md)
3. Wire `build:<name>` through the 4 places [`npm-script.md`](../../.claude/rules/npm-script.md#adding-a-command) lists, keeping `build:versions` first
4. Keep the dependency list at `js-yaml` and `docx`, since a third dependency changes the image size argument and needs a reason
