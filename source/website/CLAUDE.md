# CLAUDE.md — source/website

The Next.js application.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing**; it owns the static-export constraint, what content may and may not be hard-coded, the server-only warning on `content.ts`, the naming, the theme-token rule, and how to add a page, a component, or an icon
- [`README.md`](./README.md) — the structure, the routes, and the 4 configuration decisions the code depends on

The one that is silent when broken: a dynamic route does not fail the build, it just stops being deployable — [staying statically exportable](./CONTRIBUTING.md#staying-statically-exportable).
