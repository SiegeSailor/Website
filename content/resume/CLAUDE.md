# CLAUDE.md — content/resume

The single source of truth for the résumé document, the website home and
`/about` pages, and the generated GitHub profile README. One file per top-level
key; consumers merge them back into one object, so **a key must live in exactly
one file** — a duplicate silently wins or loses depending on filename order.

| File                 | Key               | Consumed by                              |
| -------------------- | ----------------- | ---------------------------------------- |
| `contact.yaml`       | `name`, `contact` | résumé document                          |
| `profile.yaml`       | `profile`         | website, profile README                  |
| `summary.yaml`       | `summary`         | résumé document, website, README         |
| `skills.yaml`        | `skills`          | résumé document                          |
| `experience.yaml`    | `experience`      | résumé document, website home-page hero  |
| `publications.yaml`  | `publications`    | résumé document                          |
| `education.yaml`     | `education`       | résumé document                          |
| `certifications.yaml`| `certifications`  | résumé document                          |
| `activities.yaml`    | `activities`      | résumé document                          |
| `projects.yaml`      | `projects`        | website `/about`, profile README         |

`versions.generated.json` is written here by `tooling/scripts/build-versions.mjs`
and is git-ignored — never edit or commit it.

## Labels

This folder holds more material than fits on the one-page résumé, so any node
may carry a `labels:` list and **only nodes labelled `resume` are printed**:

```yaml
- text: "Rendered on the resume"
  labels: [resume]
- text: "Kept here for reference; never printed"
```

An unlabelled node is archived, not dead — it is verified material waiting for a
label (today: the fuller experience bullets, the full IEEE citation in
`publications.yaml`, `activities.yaml`, the split skill rows, the second MIT and
the NYU certificates, Servicetech's internship row, DY Game, and the second
`summary` entry). Labels nest: a company is printed only if it is labelled, and
so is each of its roles, its blurb, and each of its bullets.

The trade-off to know: **forgetting the label silently omits new content** from
the document. After adding anything, rebuild and check it appears.

## Who reads what

- **Résumé document** (`tooling/scripts/build-resume.mjs`) reads every file and
  honours `labels:`.
- **Website** (`website/helpers/server/resume.ts`) imports only `profile.yaml`,
  `summary.yaml`, `experience.yaml`, and `projects.yaml`, as raw text so the dev
  server hot-reloads edits. It ignores labels except to pick the summary, and
  reads whole keys: `profile:`, `projects:`, the `resume` entry of `summary:`,
  and the first `experience` entry (company and website for the home-page hero).
- **Profile README** (`tooling/scripts/build-readme.mjs`) reads the same keys as
  the website.

If you add a top-level key the website needs, add the matching import to
`resume.ts` — the website does not glob this folder.

## Constraints — never break these

The full list lives in the root [`CLAUDE.md`](../../CLAUDE.md); the ones that bite
when editing this folder:

1. **The résumé must fit one US-Letter page.** The build verifies the page count
   with `pdfinfo` and fails on a violation. Spacing is already tight, so expect
   overflow when labelling more content. To fit, in order of preference: drop a
   bullet's `resume` label > tighten wording > merge skill groups.
2. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a
   single title and date range. Background-check vendors verify titles and dates;
   the stacked history is deliberate and factual.
3. **Facts here are verified.** Do not alter dates, rankings, or titles without
   explicit confirmation from Ken.

This folder is excluded from Prettier — it is hand-tuned authored content, and
reflowing it changes the rendered documents.
