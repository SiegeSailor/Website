---
name: update-website
description: Use when refreshing the site from the profile repository, when profile facts have changed, or when a page needs a new section, a reordered layout, or a value the site does not yet render.
---

# Update Website

Brings Ken's profile facts across from [`SiegeSailor/SiegeSailor`](https://github.com/SiegeSailor/SiegeSailor) into [`source/settings/content.ts`](../../../source/settings/content.ts), and wires new values into the pages that show them.

This repository renders **constants**. There is no content loader and no build-time fetch, so `settings/content.ts` is a mirror — it goes stale until this skill runs.

## Process

1. **Fetch the facts.** `gh api repos/SiegeSailor/SiegeSailor/contents/profile/<file>` for each file you need, or clone into a temp directory. Record the commit SHA: `gh api repos/SiegeSailor/SiegeSailor/commits/main --jq '.sha'`.
2. **Read `profile/POLICY.md` and obey it.** It states the judgment calls the YAML alone does not show.
3. **Resolve project versions** with `gh api repos/{owner}/{repo}/releases/latest --jq '.tag_name'`, falling back to the tag list, then to no version. A project without one renders its stage instead. Network failure is not fatal — keep the value already in the file.
4. **Rewrite `source/settings/content.ts`**, stamping the source SHA and date in the header comment.
5. **Apply any structural instruction** given alongside: a new section, a reordered page, a value no page reads yet.
6. **Verify**: `npm run typecheck && npm run lint && npm run build`, then read the rendered `source/export/about.html` to confirm what changed actually reaches the page.
7. **Report what changed and leave the commit to Ken.**

## Checking Staleness

```shell
gh api repos/SiegeSailor/SiegeSailor/commits/main --jq '.sha'   # against the SHA in the file header
```

## Constraints That Must Never Break

- **Never copy contact details across**: the phone number and postal area belong to the résumé document only, and `POLICY.md` says so. `settings/content.ts` must never carry them
- **Never invent a fact**: every string here is verified and read by background-check vendors. Copy it, never rephrase it — if a value needs different wording for the site, ask Ken first
- **A new `media` entry needs an icon first**: `key` selects it in [`settings/icons.ts`](../../../source/settings/icons.ts), and the site will not render an entry without one
- **Keep everything under `app/` statically exportable**: the site is `next build` with no server at runtime
- **`settings/content.ts` is server-only**: its accessors are `async` and read on the server; pass values down from a server parent rather than importing it into a client component
