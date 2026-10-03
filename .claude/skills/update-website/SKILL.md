---
name: update-website
description: Use when refreshing the site from the profile repository, when profile facts have changed, or when a page needs a new section, a reordered layout, or a value the site does not yet render.
---

# Update Website

Brings Jin Yu Zhang's profile facts across from [`SiegeSailor/SiegeSailor`](https://github.com/SiegeSailor/SiegeSailor) into [`source/settings/content.ts`](../../../source/settings/content.ts), and wires new values into the pages that show them.

This repository renders **constants**. There is no content loader and no build-time fetch, so `settings/content.ts` is a mirror — it goes stale until this skill runs.

## Process

1. **Fetch the facts.** `gh api repos/SiegeSailor/SiegeSailor/contents/profile/<file>` for each file you need, or clone into a temp directory. Record the commit SHA: `gh api repos/SiegeSailor/SiegeSailor/commits/main --jq '.sha'`.
2. **Read `profile/CLAUDE.md` and obey it.** It states the judgment calls the YAML alone does not show, including its **Audience** rules: ask Jin Yu Zhang for the site's audience when the request names no purpose, posting, or audience, and write `SUMMARY` and `PROFILE`'s `headlines`, `tagline`, and `intro` for that audience.
3. **Resolve project versions** with `gh api repos/{owner}/{repo}/releases/latest --jq '.tag_name'`, falling back to the tag list, then to no version. A project without one renders its stage instead. Network failure is not fatal — keep the value already in the file.
4. **Rewrite `source/settings/content.ts`**, stamping the source SHA and date in the header comment. `PROFILE.status` is `contact.yaml`'s `area` and the current title in `experience.yaml`, and `PROFILE.picture` is this site's own image, not a profile fact. Show Jin Yu Zhang the written `SUMMARY`, headlines, tagline, and intro, with each number, title, and claim it states beside the `profile/` value it comes from, and write it only once he approves.
5. **Apply any structural instruction** given alongside: a new section, a reordered page, a value no page reads yet.
6. **Verify**: `npm run typecheck && npm run lint && npm run build`, then read the rendered `source/export/about.html` to confirm what changed actually reaches the page.
7. **Report what changed and leave the commit to Jin Yu Zhang.**

## Checking Staleness

```shell
gh api repos/SiegeSailor/SiegeSailor/commits/main --jq '.sha'   # against the SHA in the file header
```

## Constraints That Must Never Break

- **Never copy contact details across**: `contact.yaml`'s `phone` and `location` belong to the résumé document only, and `profile/CLAUDE.md` says so. `settings/content.ts` must never carry them
- **Never invent a fact**: every string here is verified and read by background-check vendors. Copy it, never rephrase it — `SUMMARY` and `PROFILE`'s `headlines`, `tagline`, and `intro` are the values written per run, from facts in `profile/` only, and if any other value needs different wording for the site, ask Jin Yu Zhang first
- **A new `media` entry needs an icon first**: `key` selects it in [`settings/icons.ts`](../../../source/settings/icons.ts), and the site will not render an entry without one. Skip `media.yaml`'s `website` entry, which links to this site
- **Keep everything under `app/` statically exportable**: the site is `next build` with no server at runtime
- **`settings/content.ts` is server-only**: its accessors are `async` and read on the server; pass values down from a server parent rather than importing it into a client component
