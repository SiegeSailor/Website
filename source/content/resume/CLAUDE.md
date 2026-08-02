# CLAUDE.md — source/content/resume

The single source of truth for the resume document, the website, and the generated README. Nothing a reader sees is hard-coded in a consumer: names, taglines, summaries, links, page titles, and section headings all live here.

[`../CONTRIBUTING.md`](../CONTRIBUTING.md#changing-what-appears-where) owns the file-consumers structure — the `consumers:`, `heading:`, and one-content-key shape, and what the loaders reject. **Read it before editing a file here.** This document is the map of what is already declared, and the constraints on what may change.

Filenames are free — the loader takes the key from the file's contents, which is why `site-identity.yaml` holds `site:` (a file named `site.yaml` trips a SchemaStore schema in editors).

## Consumer Names

| Consumer   | Output                                                        |
| ----------- | -------------------------------------------------------------- |
| `/`        | The home page                                                 |
| `/about`   | The `/about` page                                             |
| `readme`   | The `SiegeSailor/SiegeSailor` README                          |
| `resume`   | `source/tooling/export/resume/*.{docx,pdf}`                   |
| `site`     | Site-wide chrome and metadata: header, footer, every `<head>` |
| `versions` | `build-versions` resolving each project's latest release      |

## File Map

| File                  | Key              | Consumers                      |
| --------------------- | ---------------- | ------------------------------ |
| `activities.yaml`     | `activities`     | — (archived)                   |
| `certifications.yaml` | `certifications` | `resume`                       |
| `contact.yaml`        | `contact`        | `resume`                       |
| `education.yaml`      | `education`      | `resume`                       |
| `experience.yaml`     | `experience`     | `resume`, `/`                  |
| `identity.yaml`       | `identity`       | `resume`, `readme`, `site`     |
| `media.yaml`          | `media`          | `site`, `/about`, `readme`     |
| `profile.yaml`        | `profile`        | `/`, `/about`, `readme`        |
| `projects.yaml`       | `projects`       | `/about`, `readme`, `versions` |
| `publications.yaml`   | `publications`   | — (archived)                   |
| `routes.yaml`         | `routes`         | `site`                         |
| `site-identity.yaml`  | `site`           | `site`, `readme`               |
| `skills.yaml`         | `skills`         | `resume`                       |
| `summary.yaml`        | `summary`        | `resume`, `readme`, `/about`   |
| `timeline.yaml`       | `timeline`       | `/about`, `readme`             |

## What Is Archived Today

A node with no `consumers` inherits the file's; `consumers: []` archives it — verified material kept in the source and printed nowhere. This is the inverse of the old `labels: [resume]`, where silence meant hidden, so the resume's held-back material is visible when reading the file rather than inferred from an absence.

Archived today: the fuller experience bullets, 4 company blurbs, DY Game, Servicetech's internship row, the split skill rows, the second MIT and the NYU certificates, some education details, and the second `summary`.

Nesting applies — a company is printed only if it is not archived, and so is each of its roles, its blurb, and each of its bullets.

## Who Reads What

| Reader                                                      | Loads                                                                                                                                                                                               |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| README (`source/tooling/scripts/build-readme.mjs`)          | `readme`                                                                                                                                                                                            |
| Resume document (`source/tooling/scripts/build-resume.mjs`) | `resume`, rendering what it gets without filtering                                                                                                                                                  |
| Website (`source/website/helpers/server/content.ts`)        | One consumer per surface — `getSite()`, `getHome()`, `getAbout()` — globbing this folder through webpack `require.context`, so a new file needs no code change and the dev server still hot-reloads |

The 2 loaders are hand-kept twins — see [`../../tooling/CLAUDE.md`](../../tooling/CLAUDE.md#the-2-loaders-are-twins).

## Constraints That Must Never Break

1. **The resume must fit one US-Letter page** — spacing is already tight, so expect overflow when un-archiving content, and [`../../tooling/CONTRIBUTING.md`](../../tooling/CONTRIBUTING.md#resume-layout-notes) owns both how the page-count check behaves and the ladder for fitting content back
2. **Keep the resume ATS-safe** — single column; no tables, text boxes, or headers and footers; the standard section names (Summary, Skills, Work Experience, Education, Certifications)
3. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a single title and date range — background-check vendors verify titles and dates, and the stacked history is deliberate and factual; Servicetech's 2016–2017 internship row is in the source but archived, so un-archive it rather than widening the 2017–2018 range if it is ever needed
4. **The facts here are verified** — see [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
