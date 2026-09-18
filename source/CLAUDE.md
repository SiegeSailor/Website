# CLAUDE.md — source

The Next.js application.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing**; it owns what content may and may not be hard-coded, the naming, the theme-token rule, and how to add a page, a component, or an icon
- [`README.md`](./README.md) — the structure, the routes, and the 4 configuration decisions the code depends on

## Constraints That Must Never Break

- **`settings/content.ts` Is Server-Only**: Its accessors are `async` and read on the server; pass what a client component needs down from a server parent instead of importing it, and note that `app/global-error.tsx` cannot use it at all, because it must be a client component, so it carries a literal title
- **Everything under `app/` Must Survive `output: "export"`**: No Server Actions, no API routes, no request-time rendering, and route handlers must be static (see `feed.xml`) — the whole deployment is an export synced to S3, so a dynamic route does not fail loudly, it silently stops being deployable
