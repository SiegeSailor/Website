# CLAUDE.md — source/content/resume

The single source of truth for the resume document, the website, and the
generated GitHub profile README. Nothing a reader sees is hard-coded in a
consumer: names, taglines, summaries, links, page titles, and section headings
all live here. See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the
edit-and-rebuild loop.

## The file-consumers structure

Every file has the same three parts, and the loaders reject a file that does
not:

```yaml
consumers: # required — who reads this file
  - resume
  - /about

heading: Summary # optional — names this file's section in a document

summary: # exactly one content key
  - text: "…"
```

- **`consumers:`** names the documents that read the file. A file disappears from
  a document by dropping that name — nothing else changes. `consumers: []` means
  archived: verified material kept in the source and printed nowhere.
- **`heading:`** is the section title in whichever document renders it as a
  section. Section *order* is not here; it stays in the builders, because the
  resume's order is ATS-sensitive and drives the one-page fit.
- **exactly one content key** per file. Two files declaring the same key is a
  build failure, not a silent last-write-wins.

Filenames are free — the loader takes the key from the file's contents, which is
why `site-identity.yaml` holds `site:` (a file named `site.yaml` trips a
SchemaStore schema in editors).

### Consumer names

| Consumer   | Output                                                        |
| ---------- | ------------------------------------------------------------- |
| `resume`   | `source/tooling/export/resume/*.{docx,pdf}`                   |
| `readme`   | the `SiegeSailor/SiegeSailor` profile README                  |
| `site`     | site-wide chrome and metadata: header, footer, every `<head>` |
| `/`        | the home page                                                 |
| `/about`   | the `/about` page                                             |
| `versions` | `build-versions` resolving each project's latest release      |

### File map

| File                  | Key              | Consumers                        |
| --------------------- | ---------------- | -------------------------------- |
| `identity.yaml`       | `identity`       | `resume`, `readme`, `site`       |
| `contact.yaml`        | `contact`        | `resume`                         |
| `site-identity.yaml`  | `site`           | `site`, `readme`                 |
| `routes.yaml`         | `routes`         | `site`                           |
| `media.yaml`          | `media`          | `site`, `/about`, `readme`       |
| `profile.yaml`        | `profile`        | `/`, `/about`, `readme`          |
| `timeline.yaml`       | `timeline`       | `/about`, `readme`               |
| `summary.yaml`        | `summary`        | `resume`, `readme`, `/about`     |
| `skills.yaml`         | `skills`         | `resume`                         |
| `experience.yaml`     | `experience`     | `resume`, `/`                    |
| `education.yaml`      | `education`      | `resume`                         |
| `certifications.yaml` | `certifications` | `resume`                         |
| `projects.yaml`       | `projects`       | `/about`, `readme`, `versions`   |
| `publications.yaml`   | `publications`   | — (archived)                     |
| `activities.yaml`     | `activities`     | — (archived)                     |

`versions.generated.json` is written here by
`source/tooling/scripts/build-versions.mjs` and is git-ignored — never edit or
commit it.

## Node-level consumers

Nodes inside a file follow the same rule one level down, with one difference
worth internalising: **a node with no `consumers` inherits the file's**, and
`consumers: []` archives it.

```yaml
- text: "Printed wherever this file is consumed"
- consumers: []
  text: "Kept for reference; printed nowhere"
```

This is the inverse of the old `labels: [resume]`, where silence meant hidden.
Archived nodes are now the ones that carry an annotation, so the resume's
held-back material is visible when reading the file rather than inferred from an
absence. What is archived today: the fuller experience bullets, four company
blurbs, DY Game, Servicetech's internship row, the split skill rows, the second
MIT and the NYU certificates, some education details, and the second `summary`.

Nesting still applies — a company is printed only if it is not archived, and so
is each of its roles, its blurb, and each of its bullets.

## Who reads what

- **Resume document** (`source/tooling/scripts/build-resume.mjs`) loads the
  `resume` consumer and renders what it gets; it does not filter.
- **Profile README** (`source/tooling/scripts/build-readme.mjs`) loads `readme`.
- **Website** (`source/website/helpers/server/content.ts`) loads one consumer per
  surface: `getSite()`, `getHome()`, `getAbout()`. It globs this folder through
  webpack `require.context`, so a new file needs no code change and the dev
  server still hot-reloads. That module is **server-only** — importing it from a
  client component would ship `contact.yaml` to the browser.

The two loaders (`source/tooling/scripts/load-content.mjs` and
`source/website/helpers/server/content.ts`) are the same ~50 lines twice over,
deliberately: the tooling workspace is pinned to `js-yaml` and `docx` to keep
its Docker image small, so the website cannot import it. Change one and change
the other.

## Constraints — never break these

1. **The resume must fit one US-Letter page.** The build verifies the page count
   with `pdfinfo` and fails on a violation, but only where LibreOffice and
   poppler exist — elsewhere it skips silently, so trust the Docker build.
   Spacing is already tight, so expect overflow when un-archiving content. To
   fit, in order of preference: archive a bullet > tighten wording > merge skill
   groups. The rest of the ladder is in
   [`../../tooling/CONTRIBUTING.md`](../../tooling/CONTRIBUTING.md).
2. **Keep the resume ATS-safe**: single column; no tables, text boxes, or
   headers and footers; the standard section names (Summary, Skills, Work
   Experience, Education, Certifications).
3. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a
   single title and date range. Background-check vendors verify titles and
   dates; the stacked history is deliberate and factual. Servicetech's 2016–2017
   internship row is in the source but archived; un-archive it rather than
   widening the 2017–2018 range if it is ever needed.
4. **Facts here are verified.** Do not alter dates, rankings, or titles without
   explicit confirmation from Ken.

This folder is excluded from Prettier — it is hand-tuned authored content, and
reflowing it changes the rendered documents.
