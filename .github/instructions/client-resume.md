---
applyTo: "docker-context/files/resume/*"
---

# Maintaining the Resume

Instructions for editing the resume source of truth. Full constraints live in [`CLAUDE.md`](./../../CLAUDE.md); the development flow lives in [`CONTRIBUTING.md`](./../../CONTRIBUTING.md).

## Source of Truth

`Resume.yaml` holds all resume and profile content. Almost any node (bullet, role, education entry, skills group, summary blurb, section) may carry a `variants:` list; a node without one appears in every variant:

- `professional`: one-page resume, impact and scale focus
- `academic`: two-page resume, systems and leadership focus
- `profile`: the website profile page only

## Workflow

1. Edit `Resume.yaml`
2. Run `npm run build:resume` and `npm run build:profile` from `docker-context/`
3. Confirm the build reports the expected page counts (`professional` must stay one US-Letter page; the build fails otherwise)
4. Review the regenerated sections in `files/documents/Profile.md`

## Rules

- Keep the layout ATS-safe: single column, no tables or text boxes, standard section names, native Word bullets, dates right-aligned with tab stops
- Never flatten the stacked role lines (CooperSurgical, Servicetech) into a single title and date range
- No visa or immigration information in resume content
- Don't change dates, rankings, or titles without explicit confirmation
