# CLAUDE.md — content/resume

The single source of truth for the résumé documents, the website home and
`/about` pages, and the generated GitHub profile README. One file per top-level
key; consumers merge them back into one object, so **a key must live in exactly
one file** — a duplicate silently wins or loses depending on filename order.

| File                 | Key               | Consumed by                              |
| -------------------- | ----------------- | ---------------------------------------- |
| `contact.yaml`       | `name`, `contact` | résumé documents                         |
| `profile.yaml`       | `profile`         | website, profile README                  |
| `summary.yaml`       | `summary`         | résumé (both variants), website, README  |
| `skills.yaml`        | `skills`          | résumé documents                         |
| `experience.yaml`    | `experience`      | résumé documents, website home-page hero |
| `publications.yaml`  | `publications`    | résumé documents (`academic` only)       |
| `education.yaml`     | `education`       | résumé documents                         |
| `certifications.yaml`| `certifications`  | résumé documents                         |
| `activities.yaml`    | `activities`      | résumé documents (`academic` only)       |
| `projects.yaml`      | `projects`        | website `/about`, profile README         |

`versions.generated.json` is written here by `tooling/scripts/build-versions.mjs`
and is git-ignored — never edit or commit it.

## Who reads what

- **Résumé documents** (`tooling/scripts/build-resume.mjs`) read every file and
  honour `variants:`.
- **Website** (`website/helpers/server/resume.ts`) imports only `profile.yaml`,
  `summary.yaml`, `experience.yaml`, and `projects.yaml`, as raw text so the dev
  server hot-reloads edits. It ignores variants and reads whole keys:
  `profile:`, `projects:`, `summary.professional`, and the first `experience`
  entry (company and website for the home-page hero).
- **Profile README** (`tooling/scripts/build-readme.mjs`) reads the same keys as
  the website and likewise ignores variants.

If you add a top-level key the website needs, add the matching import to
`resume.ts` — the website does not glob this folder.

## Variants

Résumé variants are `professional` (one page, impact and scale focus) and
`academic` (two pages, systems and leadership focus). Any node may carry a
`variants:` list; **a node with no list appears in BOTH documents.** Tag a node
to restrict it to one. The website and profile README ignore variants entirely.

## Constraints — never break these

The full list lives in the root [`CLAUDE.md`](../../CLAUDE.md); the ones that bite
when editing this folder:

1. **The `professional` variant must fit one US-Letter page.** The build verifies
   page counts with `pdfinfo` and fails on a violation. Spacing is already tight,
   so expect overflow when adding content. To fit, in order of preference: tag a
   bullet `variants: [academic]` > tighten wording > merge skill groups.
2. **Never re-flatten stacked role lines** (CooperSurgical, Servicetech) into a
   single title and date range. Background-check vendors verify titles and dates;
   the stacked history is deliberate and factual.
3. **Facts here are verified.** Do not alter dates, rankings, or titles without
   explicit confirmation from Ken.

This folder is excluded from Prettier — it is hand-tuned authored content, and
reflowing it changes the rendered documents.
