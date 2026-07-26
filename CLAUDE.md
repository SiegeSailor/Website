# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site
served from S3 behind CloudFront, plus a single-source résumé and profile build
system. This file orients you (and future contributors) to the repository; the
day-to-day development and deployment flow lives in
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Repository layout

The repository is an npm workspace: the root `package.json` owns the version
(bumped by semantic-release) and the single `package-lock.json`; `website/` and
`tooling/` are the two workspaces, and `content/` is plain data shared by both.

- **`content/`** — all authored content, shared by the other two folders and
  excluded from Prettier because it is hand-tuned prose and data:
  - `content/resume/` — the single source of truth for the résumé, the home and
    `/about` pages, and the generated GitHub profile README. One YAML file per
    top-level key, merged by each consumer (see its own
    [`CLAUDE.md`](./content/resume/CLAUDE.md)).
  - `content/articles/` — blog posts named `YYYY-MM-DD.md` (the folder's
    `CLAUDE.md` is the writing guide).
- **`website/`** — the Next.js application (see its own
  [`CLAUDE.md`](./website/CLAUDE.md) for the internal structure), built on the
  host with `npm run build`. Reads `content/resume/` through the `@content/*`
  alias and `content/articles/` from disk.
- **`tooling/`** — the `Dockerfile` and the three build scripts that render
  `content/` into the résumé document, the profile README, and the project
  version list. Deliberately depends on `js-yaml` and `docx` only, so the image
  installs ~22 packages instead of the website's ~1,400.
- **`infrastructure/`** — one flat Terraform environment: the site S3 bucket,
  CloudFront (with a viewer-request function that rewrites extensionless routes
  to `.html`), ACM, Route 53, and a budget alarm.
- **`scripts/`** — shell scripts following the Google Shell Style Guide, one
  function per script: `docker-copy.sh` (build the tooling image and copy its
  artifacts out), `hadolint.sh` (lint the Dockerfile), and
  `warm-up-cloudfront-cache.sh`.
- **`.github/workflows/`** — `ci.yml` runs format, lint, and typecheck on pull
  requests; `production.yml` builds and deploys the site, résumé, and profile
  README; `release.yml` runs semantic-release.
- Community health files follow GitHub standards: `README.md`,
  `CONTRIBUTING.md`, `LICENSE-MIT.md` (code), and `LICENSE-CC-BY.md` (docs and
  blog posts). There is no `CHANGELOG.md` or `SECURITY.md` — the repository has
  issues and pull requests disabled, and semantic-release publishes its notes on
  the GitHub Release instead of a checked-in changelog.

## Commands

Everything runs from the repository root; the root scripts delegate to the right
workspace, so there is no need to `cd` into one:

```bash
npm ci                    # install both workspaces from the single lockfile
npm run watch             # development server
npm run lint              # ESLint (eslint-config-next); lint:fix to autofix
npm run format            # Prettier write; format:check to verify only
npm run typecheck         # tsc --noEmit
npm run build             # build:versions, then static export to website/export/
npm run build:resume      # content/ -> tooling/export/resume/*.{docx,pdf}
npm run build:versions    # latest GitHub release per project -> content/resume/versions.generated.json
npm run build:readme      # content/ -> tooling/export/SiegeSailor-README.md
```

Node and npm are pinned: `.nvmrc` holds `26.5.0`, the `engines` fields require
it, CI reads `.nvmrc`, and the image is `node:26.5.0-trixie-slim`. Run
`nvm install` after pulling a change to `.nvmrc`.

`npm ci` also installs a Husky `pre-commit` hook (`.husky/`) that runs ESLint,
Prettier, and `tsc --noEmit` over staged files through lint-staged; the same
checks run in CI.

`bash scripts/docker-copy.sh [resume-target] [platform]` builds the résumé
document and profile README through Docker (no local LibreOffice needed), and
`bash scripts/hadolint.sh` lints the Dockerfile. Both run from the repository
root, which is also the Docker build context. Terraform runs from
`infrastructure/` (`init`, `fmt`, `tflint`, `validate`, `plan`, `apply`).

## Conventions

- Follow the Conventions section in `CONTRIBUTING.md`; update it there if a
  convention changes.
- Use Conventional Commits, one-line messages under 72 characters where
  possible. Commit types drive semantic-release: `fix:` → patch, `feat:` →
  minor, `BREAKING CHANGE` → major.
- Keep code comments minimal — state only the constraints the code cannot show.
- Match the format and style of adjacent files before adding or editing
  anything.
- Everything under `website/app/` must stay statically exportable: no Server
  Actions, API routes, or request-time rendering.

## Résumé, profile, and README

`content/resume/` feeds three outputs from one source:

1. the **PDF/DOCX résumé** — one document, for professional use — built by
   `tooling/scripts/build-resume.mjs`;
2. the website **home and `/about` pages**, read at build time by
   `website/helpers/server/resume.ts`; and
3. the **GitHub profile README** (`SiegeSailor/SiegeSailor`), built by
   `tooling/scripts/build-readme.mjs`.

`content/resume/` splits one file per top-level key and every consumer merges them, so a
key must appear in exactly one file. See [`content/resume/CLAUDE.md`](./content/resume/CLAUDE.md)
for the file-to-key map and which consumer reads what.

`content/resume/` holds more than fits on the one page, so any node may carry a
`labels:` list and **only nodes labelled `resume` are printed** — an unlabelled
node stays in the source for reference (the fuller bullets, the Publications and
Activities sections, the second summary). The website and profile README ignore
labels except to pick the summary, and read whole keys: `profile:`, `projects:`,
the `resume` entry of `summary:`, and the first `experience` entry (company and
website for the home-page hero).

### Résumé constraints — never break these

1. **The résumé must fit one US-Letter page.** `build-resume.mjs` verifies the
   page count with `pdfinfo`; the Docker `resume` stage and CI fail on a
   violation. The spacing is already tight (see the layout notes) — expect
   overflow when labelling more content. Note the check _fails open_: without
   LibreOffice or poppler it prints `skipped` and exits 0, so only the Docker
   path is guaranteed to verify.
2. **ATS safety**: single column; no tables, text boxes, or headers/footers;
   standard section names (Summary, Skills, Work Experience, Education,
   Certifications); native Word bullets via the numbering config — never insert
   literal `•` characters; dates right-aligned with tab stops, not spaces.
3. **`.docx` is the primary deliverable**; the PDF is a convenience.
4. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a
   single title/date range. Background-check vendors verify titles and dates;
   the stacked history is deliberate and factual. Servicetech's 2016–2017
   internship row is in the source but unlabelled; label it rather than widening
   the 2017–2018 range if it is ever needed.
5. **Facts in `content/resume/` are verified.** Do not alter dates, rankings, or
   titles without explicit confirmation from Ken.

### Résumé layout notes (hard-won — don't rediscover)

- `js-yaml` must be imported as `import { load } from "js-yaml"`; the default
  import fails under Node ESM.
- LibreOffice ignores the docx `PositionalTab`, so right-aligned dates use
  classic paragraph `tabStops` (`TabStopType.RIGHT` at 10656 twips) plus a
  literal `"\t"` in the `TextRun`.
- Typography constants sit at the top of `build-resume.mjs`: `SZ` (half-points;
  body 19 = 9.5 pt), `SPACE` (twips), line spacing 226, page margins 600/792
  twips. Don't drop the body below 9.5 pt. Spacing was already tightened to keep
  the Certifications section on one page, so headroom is small.
- On Linux, Calibri is absent — install `fonts-crosextra-carlito`
  (metric-compatible) or page breaks shift. The Docker `resume` stage does this.
- The image pins LibreOffice and Carlito against `snapshot.debian.org` so the
  rendered metrics cannot drift. A locally installed LibreOffice is a _different_
  version and may disagree on page counts — trust the Docker build.
- One-page fitting, in order of preference: drop a bullet's `resume` label >
  tighten wording > merge skill groups > shave `SPACE` constants > reduce font
  size (last resort).
- When text metrics matter, inspect visually:
  `pdftoppm -jpeg -r 80 tooling/export/resume/<file>.pdf /tmp/page`.
