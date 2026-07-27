# CLAUDE.md

The personal website of Jin Yu (Ken) Zhang — a statically exported Next.js site
served from S3 behind CloudFront, plus a single-source résumé and profile build
system. This file orients you (and future contributors) to the repository; the
day-to-day development and deployment flow lives in
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Repository layout

The repository is an npm workspace: the root `package.json` owns the version
(bumped by semantic-release) and the single `package-lock.json`;
`source/website/` and `source/tooling/` are the two workspaces, and
`source/content/` is plain data shared by both.

- **`source/`** — the three authored folders, nested under one parent so they
  stay adjacent in a file tree. Nothing else lives here, and the three keep
  their sibling relationship: the website reaches `../content/`, and the tooling
  scripts reach `../../content/resume/`.
  - **`source/content/`** — all authored content, shared by the other two folders
    and excluded from Prettier because it is hand-tuned prose and data:
    - `source/content/resume/` — the single source of truth for the résumé, the
      whole website, and the generated GitHub profile README. A **file-consumers
      structure**: every file declares in `consumers:` which outputs read it,
      optionally names its section in `heading:`, and holds exactly one content
      key (see its own [`CLAUDE.md`](./source/content/resume/CLAUDE.md)).
    - `source/content/articles/` — blog posts named `YYYY-MM-DD.md` (the folder's
      `CLAUDE.md` is the writing guide).
  - **`source/website/`** — the Next.js application (see its own
    [`CLAUDE.md`](./source/website/CLAUDE.md) for the internal structure), built
    on the host with `npm run build`. Reads `source/content/resume/` through the
    `@content/*` alias and `source/content/articles/` from disk.
  - **`source/tooling/`** — the `Dockerfile`, the three build scripts that render
    `source/content/` into the résumé document, the profile README, and the
    project version list, plus `load-content.mjs`, the loader they share.
    Deliberately depends on `js-yaml` and `docx` only, so the image installs ~22
    packages instead of the website's ~1,400.
- **`infrastructure/`** — one flat Terraform environment: the site S3 bucket,
  CloudFront (with a viewer-request function that rewrites extensionless routes
  to `.html`), ACM, Route 53, and a budget alarm.
- **`scripts/`** — shell scripts following the Google Shell Style Guide, one
  function per script: `docker-copy.sh` (build the tooling image and copy its
  artifacts out), `hadolint.sh` (lint the Dockerfile), `run-parallel.sh` (run
  several root npm scripts at once, which is how `watch` drives every `watch:*`
  target), and `warm-up-cloudfront-cache.sh`.
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
npm run watch             # every watch:* target at once, in one terminal
npm run watch:website     # development server only
npm run watch:resume      # rebuild the resume documents on a source/content/ change
npm run watch:readme      # rebuild the profile README on a source/content/ change
npm run lint              # ESLint (eslint-config-next); lint:fix to autofix
npm run format            # Prettier write; format:check to verify only
npm run typecheck         # tsc --noEmit
npm run build             # every build:* target, in dependency order
npm run build:website     # static export to source/website/export/
npm run build:resume      # source/content/ -> source/tooling/export/resume/*.{docx,pdf}
npm run build:versions    # latest GitHub release per project -> source/content/resume/versions.generated.json
npm run build:readme      # source/content/ -> source/tooling/export/SiegeSailor-README.md
```

`build` and `watch` are aggregates of their own `:*` variants, so a new variant
has to be added to the aggregate by hand — npm does not expand script globs.
`build` chains them with `&&` in dependency order (`build:versions` writes the
JSON the other three read); `watch` runs them concurrently through
`scripts/run-parallel.sh`. Because `build` now includes `build:resume`, a host
with its own LibreOffice verifies the one-page constraint on every site build
against a version Docker does not pin — see the résumé constraints below.

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
- Everything under `source/website/app/` must stay statically exportable: no Server
  Actions, API routes, or request-time rendering.

## Résumé, profile, and README

`source/content/resume/` feeds three outputs from one source:

1. the **PDF/DOCX résumé** — one document, for professional use — built by
   `source/tooling/scripts/build-resume.mjs`;
2. the **website** — every page's content and metadata, read at build time by
   `source/website/helpers/server/content.ts`; and
3. the **GitHub profile README** (`SiegeSailor/SiegeSailor`), built by
   `source/tooling/scripts/build-readme.mjs`.

Each consumer asks for itself by name and gets only the files that declare it, so
a section leaves a document by dropping a name from a `consumers:` list rather
than by editing a builder. The consumer names are `resume`, `readme`, `site`,
`/`, `/about`, and `versions`. See
[`source/content/resume/CLAUDE.md`](./source/content/resume/CLAUDE.md) for the file map, the
node-level rules, and the two loaders that must stay in step.

What stays in code, deliberately: section **order** (ATS-sensitive, drives the
one-page fit), the résumé's typography, UI microcopy (nav and button labels,
search placeholder, callout and error-page copy), route **paths** (they are
typed routing, unlike route titles), the scraper lists, `TECHNOLOGY_TO_ICON` and
`MEDIA_TO_ICON` (they import React components), and the HeroUI theme values.

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
5. **Facts in `source/content/resume/` are verified.** Do not alter dates, rankings, or
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
  `pdftoppm -jpeg -r 80 source/tooling/export/resume/<file>.pdf /tmp/page`.
