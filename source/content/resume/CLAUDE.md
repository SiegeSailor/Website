# CLAUDE.md — source/content/resume

The single source of truth for the resume document, the website, and the
generated GitHub profile README. Nothing a reader sees is hard-coded in a
consumer: names, taglines, summaries, links, page titles, and section headings
all live here.

[`../CONTRIBUTING.md`](../CONTRIBUTING.md#changing-what-appears-where) owns the
file-consumers structure — the `consumers:`, `heading:`, and one-content-key
shape, and what the loaders reject. **Read it before editing a file here.** This
document is the map of what is already declared, and the constraints on what may
change.

Filenames are free — the loader takes the key from the file's contents, which is
why `site-identity.yaml` holds `site:` (a file named `site.yaml` trips a
SchemaStore schema in editors).

## Consumer names

| Consumer   | Output                                                        |
| ---------- | ------------------------------------------------------------- |
| `resume`   | `source/tooling/export/resume/*.{docx,pdf}`                   |
| `readme`   | the `SiegeSailor/SiegeSailor` profile README                  |
| `site`     | site-wide chrome and metadata: header, footer, every `<head>` |
| `/`        | the home page                                                 |
| `/about`   | the `/about` page                                             |
| `versions` | `build-versions` resolving each project's latest release      |

## File map

| File                  | Key              | Consumers                      |
| --------------------- | ---------------- | ------------------------------ |
| `identity.yaml`       | `identity`       | `resume`, `readme`, `site`     |
| `contact.yaml`        | `contact`        | `resume`                       |
| `site-identity.yaml`  | `site`           | `site`, `readme`               |
| `routes.yaml`         | `routes`         | `site`                         |
| `media.yaml`          | `media`          | `site`, `/about`, `readme`     |
| `profile.yaml`        | `profile`        | `/`, `/about`, `readme`        |
| `timeline.yaml`       | `timeline`       | `/about`, `readme`             |
| `summary.yaml`        | `summary`        | `resume`, `readme`, `/about`   |
| `skills.yaml`         | `skills`         | `resume`                       |
| `experience.yaml`     | `experience`     | `resume`, `/`                  |
| `education.yaml`      | `education`      | `resume`                       |
| `certifications.yaml` | `certifications` | `resume`                       |
| `projects.yaml`       | `projects`       | `/about`, `readme`, `versions` |
| `publications.yaml`   | `publications`   | — (archived)                   |
| `activities.yaml`     | `activities`     | — (archived)                   |

## What is archived today

A node with no `consumers` inherits the file's; `consumers: []` archives it —
verified material kept in the source and printed nowhere. This is the inverse of
the old `labels: [resume]`, where silence meant hidden, so the resume's held-back
material is visible when reading the file rather than inferred from an absence.

Archived today: the fuller experience bullets, four company blurbs, DY Game,
Servicetech's internship row, the split skill rows, the second MIT and the NYU
certificates, some education details, and the second `summary`.

Nesting applies — a company is printed only if it is not archived, and so is
each of its roles, its blurb, and each of its bullets.

## Who reads what

- **Resume document** (`source/tooling/scripts/build-resume.mjs`) loads the
  `resume` consumer and renders what it gets; it does not filter.
- **Profile README** (`source/tooling/scripts/build-readme.mjs`) loads `readme`.
- **Website** (`source/website/helpers/server/content.ts`) loads one consumer per
  surface: `getSite()`, `getHome()`, `getAbout()`. It globs this folder through
  webpack `require.context`, so a new file needs no code change and the dev
  server still hot-reloads.

The two loaders are hand-kept twins — see
[`../../tooling/CONTRIBUTING.md`](../../tooling/CONTRIBUTING.md#the-two-loaders-are-twins).

## Constraints that must never break

1. **The resume must fit one US-Letter page.** The build verifies the page count
   with `pdfinfo` and fails on a violation, but only where LibreOffice and
   poppler exist — elsewhere it skips silently, so trust the Docker build.
   Spacing is already tight, so expect overflow when un-archiving content. The
   ladder for fitting it back is in
   [`../../tooling/CONTRIBUTING.md`](../../tooling/CONTRIBUTING.md#resume-layout-notes).
2. **Keep the resume ATS-safe**: single column; no tables, text boxes, or
   headers and footers; the standard section names (Summary, Skills, Work
   Experience, Education, Certifications).
3. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a
   single title and date range. Background-check vendors verify titles and
   dates; the stacked history is deliberate and factual. Servicetech's 2016–2017
   internship row is in the source but archived; un-archive it rather than
   widening the 2017–2018 range if it is ever needed.
4. **The facts here are verified** — see
   [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
