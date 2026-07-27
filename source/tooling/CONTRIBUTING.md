# Contributing to source/tooling

Read the [root guide](../../CONTRIBUTING.md) first for setup and the full
command list. Everything here runs from the repository root.

## Building

```shell
npm run build:versions    # must run first; the other two read its JSON
npm run build:readme
npm run build:resume
```

`build:resume` degrades instead of failing when a tool is absent: no LibreOffice
means no `.pdf`, and — because the page-count check reads the rendered PDF with
`pdfinfo` — **no LibreOffice or no poppler also means no page-count check**. It
prints `skipped …` for each and still exits 0, so a bare `npm run build:resume`
can produce a `.docx` whose one-page constraint was never verified.

Build through Docker for the checked artifacts with pinned LibreOffice and font
versions. This builds the image (which runs both builders) and copies the resume
documents plus the profile README out:

```shell
bash scripts/docker-copy.sh "source/tooling/export/resume" "linux/arm64"
bash scripts/hadolint.sh   # lint the Dockerfile
```

`hadolint.sh` runs in both workflows, which install the pinned hadolint first;
locally it needs hadolint on the `PATH` and says so when it is missing.

Because `npm run build` includes `build:resume`, a host that _does_ have
LibreOffice and poppler runs the page-count check on every site build, against a
version this repository does not pin. When a local build disagrees, build
through Docker to settle whether the overflow is real.

## What a builder must not do

- **Never filter content.** A builder loads its consumer and renders what it
  gets; a section is absent because the content says so. Section **order** is
  the one deliberate exception and stays in code, because it is ATS-sensitive
  and drives the one-page fit.
- **Never emit a literal `•`** — bullets come from the numbering config as
  native Word bullets — and never add a table, a text box, or a header or
  footer. Dates are right-aligned with tab stops, not spaces. The `.docx` is the
  primary deliverable; the PDF is a convenience.
- **Never stamp a version from anywhere but the root `package.json`**, which
  semantic-release owns.

The resume constraints these serve are documented in
[`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md).

## The two loaders are twins

`scripts/load-content.mjs` and `../website/helpers/server/content.ts` are the
same ~50 lines written twice, deliberately: the website cannot import this
workspace, pinned to `js-yaml` and `docx` to keep the image at ~22 packages, and
it needs webpack to own the files for dev hot-reload.

**Change one and change the other in the same commit.** They must agree on what
`consumers:` means and that a file without it is rejected, that a file carries
exactly one content key and a key claimed twice is a build failure, and that a
node inheriting silence is printed while `consumers: []` is archived.

A divergence does not fail a build. It quietly gives the resume different
content from the website, which is the failure the structure exists to prevent.

## Resume layout notes

Hard-won; do not rediscover them.

- **`js-yaml` must be imported as `import { load } from "js-yaml"`.** The default
  import fails under Node ESM.
- **LibreOffice ignores the docx `PositionalTab`**, so right-aligned dates use
  classic paragraph `tabStops` (`TabStopType.RIGHT` at 10656 twips) plus a
  literal `"\t"` in the `TextRun`.
- **Typography constants sit at the top of `build-resume.mjs`**: `SZ`
  (half-points; body 19 = 9.5 pt), `SPACE` (twips), line spacing 226, page
  margins 600/792 twips. Spacing was already tightened to keep Certifications on
  the page, so headroom is small.
- **On Linux, Calibri is absent** — install `fonts-crosextra-carlito`
  (metric-compatible) or page breaks shift. The Docker `resume` stage does this.
- **Inspect visually when text metrics matter**:
  `pdftoppm -jpeg -r 80 source/tooling/export/resume/<file>.pdf /tmp/page`.

To fit one page, in order of preference: drop a bullet's `resume` consumer >
tighten wording > merge skill groups > shave `SPACE` constants > reduce font
size, as a last resort, but never below 9.5 pt body.

## Taking a Debian update

Apt pins are frozen at the `DEBIAN_SNAPSHOT` timestamp, so security updates are
a deliberate step rather than something the next rebuild picks up:

```shell
# Find the current candidate versions, then bump DEBIAN_SNAPSHOT and the pins together.
docker run --rm node:26.5.0-trixie-slim \
  bash -c 'apt-get update -qq && apt-cache policy libreoffice-writer poppler-utils fonts-crosextra-carlito'
```

The default timestamp matches the one the base image was built against, which
the image records in the comments of `/etc/apt/sources.list.d/debian.sources`.
After bumping, rebuild and confirm the page count still passes — a LibreOffice
or Carlito change can shift the layout.

## Adding a builder

A new output means a new consumer name, so it touches both sides:

1. Add the script under `scripts/`, loading its content with
   `loadContent("<consumer>")` rather than reading files itself.
2. Declare the consumer on the content files that feed it, and document it in
   [`../content/resume/CLAUDE.md`](../content/resume/CLAUDE.md).
3. Add `build:<name>` to this workspace's `package.json`, then to the root
   `package.json`, then to the root `build` aggregate — npm does not expand
   globs, and `build:versions` has to stay first.
4. Keep the dependency list at `js-yaml` and `docx`. A third dependency changes
   the image size argument and needs a reason.
