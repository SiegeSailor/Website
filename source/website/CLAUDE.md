# CLAUDE.md — source/website

The Next.js application. See [`README.md`](./README.md) for the structure and
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for how to add to it. Check
`package.json` for exact dependency versions and use the matching APIs.

## Rules

- **Everything under `app/` must stay statically exportable.** No Server
  Actions, no API routes, no request-time rendering; route handlers must be
  static (see `feed.xml`). The whole deployment is `output: "export"` synced to
  S3 — a dynamic route does not fail loudly, it silently stops being deployable.
- **`helpers/server/content.ts` is server-only.** `require.context` inlines
  every file in `../content/resume/`, so importing it from a client component
  ships `contact.yaml` — a phone number and a postal area — to the browser. Pass
  content down from a server parent instead. `app/global-error.tsx` is the one
  document that cannot use it, because it must be a client component; it carries
  a literal title.
- **Never hard-code text a reader sees.** Names, taglines, summaries, links,
  page titles, and section headings come from `../content/`. Route _paths_, UI
  microcopy, and the icon maps deliberately stay in code.
- **Keep `content.ts` in step with `../tooling/scripts/load-content.mjs`.** They
  are the same loader written twice on purpose; changing one means changing the
  other.
- **Style with theme tokens**, never literal colours, so light and dark both
  stay correct.
- **Naming**: folders and files kebab-case, `components/*` PascalCase.
- Configs live at the repository root, so run `npm run format`, `npm run lint`,
  and `npm run typecheck` from there.
