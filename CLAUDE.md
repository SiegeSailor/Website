# CLAUDE.md

Personal website of Jin Yu (Ken) Zhang — a containerized Next.js application deployed to AWS, plus a single-source resume build system. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full development and deployment flow.

## Repository Layout

- `.github/` — GitHub-related files: workflows (`static-production.yml` deploys the static site, `resume.yml` publishes resume documents), Copilot instruction files in `instructions/`.
- `docker-context/` — the Next.js application; everything included in the generated Docker image.
  - `app/` — Next.js App Router routes; `components/`, `helpers/`, `settings/`, `stores/`, `styles/` follow the structure described in `.github/instructions/client.md`.
  - `files/articles/` — blog posts named `YYYY-MM-DD.md`.
  - `files/documents/Profile.md` — profile page document; the sections between `<!-- generated:*:start/end -->` markers are generated from the resume source, never edit them by hand.
  - `files/resume/Resume.yaml` — single source of truth for all resume variants and the profile page data.
  - `scripts/` — build scripts run through npm (`build-static.mjs`, `build-resume.mjs`, `build-profile.mjs`).
- `infrastructure/` — Terraform deployment, one folder per environment (`server-production/`, `server-development/`, `static-production/`).
- `scripts/` — shell scripts following the Google Shell Style Guide; one script contains one function, used in CI/CD or in the terminal on the fly.
- Community files follow GitHub standards: `README.md`, `CONTRIBUTING.md`, `LICENSE-MIT.md` (code), `LICENSE-CC-BY.md` (documentation and blog posts), `.github/SECURITY.md`.

## Commands

```bash
cd docker-context/
npm ci                    # setup
npm run watch             # development server
npm run build:server      # container build target
npm run build:static      # static export to export/
npm run build:resume      # Resume.yaml -> export/resume/*.{docx,pdf,txt}
npm run build:profile     # Resume.yaml -> generated sections of files/documents/Profile.md
```

From the root directory: `bash scripts/generate-resume.sh [target] [platform]` runs the full resume pipeline through Docker (needs no local LibreOffice/pandoc); `bash scripts/hadolint.sh`, `bash scripts/docker-build.sh`, `bash scripts/container-structure-test.sh` lint, build, and test the Docker image.

## Conventions

- Follow the Conventions section in `CONTRIBUTING.md`. Update it there if a convention changes.
- Conventional Commits, one-line messages under 72 characters when possible.
- Keep code comments minimal — only state constraints the code cannot show.
- Check adjacent files and match their format and style before adding or editing anything.

## Resume Constraints — never break these

1. **The `professional` variant must fit one US-Letter page** (`academic` is two pages by design). `build-resume.mjs` verifies page counts via `pdfinfo` when PDFs are generated; the Docker `resume` stage and CI fail on violation.
2. **ATS safety**: single column; no tables, text boxes, or headers/footers; standard section names (Summary, Skills, Work Experience, Education); native Word bullets via the numbering config in `build-resume.mjs` — never insert literal `•` characters; dates right-aligned with tab stops, not spaces.
3. **`.docx` is the primary deliverable.** PDF and txt are conveniences.
4. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a single title/date range. Background-check vendors verify titles and dates; the stacked history is deliberate and factual.
5. No visa/immigration information anywhere in resume content (the profile page `status` frontmatter is the only allowed place).
6. Facts in `Resume.yaml` are verified; do not alter dates, rankings, or titles without explicit confirmation from Ken.

## Resume Layout Knowledge (hard-won — don't rediscover)

- Variant model: any node in `Resume.yaml` may carry `variants: [professional]` / `[academic]` / `[profile]`; untagged nodes appear everywhere. `profile` is rendered only by `build-profile.mjs` into `Profile.md`. New variants: tag lines in YAML and add the name to `VARIANT_TO_LABEL` (and its page count to `VARIANT_TO_PAGES`) in `build-resume.mjs`.
- `js-yaml` must be imported as `import { load } from "js-yaml"`; the default import fails under Node ESM.
- LibreOffice ignores docx `PositionalTab`. Right-aligned dates use classic paragraph `tabStops` (`TabStopType.RIGHT` at 10656 twips) plus a literal `"\t"` in the TextRun.
- Typography constants live at the top of `build-resume.mjs`: `SZ` (half-points, body 19 = 9.5 pt), `SPACE` (twips), line spacing 230, page margins 600/792 twips. Don't reduce body size below 9.5 pt.
- On Linux, Calibri is absent; install `fonts-crosextra-carlito` (metric-compatible) or page breaks will shift. The Docker `resume` stage does this.
- One-page fitting, in order of preference: tag a bullet `variants: [academic]` > tighten wording > merge skill groups > shave `SPACE` constants > font size (last resort).
- Visual check when text metrics matter: `pdftoppm -jpeg -r 80 export/resume/<file>.pdf /tmp/page` then inspect.
