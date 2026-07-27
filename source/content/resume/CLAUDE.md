# CLAUDE.md — source/content/resume

The single source of truth for the résumé document, the website, and the
generated GitHub profile README. Nothing a reader sees is hard-coded in a
consumer: names, taglines, summaries, links, page titles, and section headings
all live here.

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
  résumé's order is ATS-sensitive and drives the one-page fit.
- **exactly one content key** per file. Two files declaring the same key is a
  build failure, not a silent last-write-wins.

Filenames are free — the loader takes the key from the file's contents, which is
why `site-identity.yaml` holds `site:` (a file named `site.yaml` trips a
SchemaStore schema in editors).

### Consumer names

| Consumer   | Output                                                       |
| ---------- | ------------------------------------------------------------ |
| `resume`   | `source/tooling/export/resume/*.{docx,pdf}`                         |
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

`versions.generated.json` is written here by `source/tooling/scripts/build-versions.mjs`
and is git-ignored — never edit or commit it.

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
Archived nodes are now the ones that carry an annotation, so the résumé's
held-back material is visible when reading the file rather than inferred from an
absence. What is archived today: the fuller experience bullets, four company
blurbs, DY Game, Servicetech's internship row, the split skill rows, the second
MIT and the NYU certificates, some education details, and the second `summary`.

Nesting still applies — a company is printed only if it is not archived, and so
is each of its roles, its blurb, and each of its bullets.

The trade-off to know: **archiving a node silently shortens a document.** After
editing, rebuild and check what appears.

## Who reads what

- **Résumé document** (`source/tooling/scripts/build-resume.mjs`) loads the `resume`
  consumer and renders what it gets; it no longer filters.
- **Profile README** (`source/tooling/scripts/build-readme.mjs`) loads `readme`.
- **Website** (`source/website/helpers/server/content.ts`) loads one consumer per
  surface: `getSite()`, `getHome()`, `getAbout()`. It globs this folder through
  webpack `require.context`, so a new file needs no code change and the dev
  server still hot-reloads. That module is **server-only** — importing it from a
  client component would ship `contact.yaml` to the browser.

Both loaders are the same ~50 lines twice over
(`source/tooling/scripts/load-content.mjs` and `source/website/helpers/server/content.ts`),
deliberately: the tooling workspace is pinned to `js-yaml` and `docx` to keep its
Docker image at ~22 packages, so the website cannot import it. Change one and
change the other.

## Constraints — never break these

The full list lives in the root [`CLAUDE.md`](../../CLAUDE.md); the ones that bite
when editing this folder:

1. **The résumé must fit one US-Letter page.** The build verifies the page count
   with `pdfinfo` and fails on a violation. Spacing is already tight, so expect
   overflow when un-archiving content. To fit, in order of preference: archive a
   bullet > tighten wording > merge skill groups.
2. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a
   single title and date range. Background-check vendors verify titles and dates;
   the stacked history is deliberate and factual.
3. **Facts here are verified.** Do not alter dates, rankings, or titles without
   explicit confirmation from Ken.

This folder is excluded from Prettier — it is hand-tuned authored content, and
reflowing it changes the rendered documents.
