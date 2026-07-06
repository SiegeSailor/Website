# CLAUDE.md — Next.js application

This is the website itself: a TypeScript + TailwindCSS + HeroUI app built as a
static export (`output: "export"`) and served from S3 behind CloudFront. It is a
deliberately minimal blog — a single-column reading experience with a
searchable post list, a compact `/about` page, and clean article pages. Check
`package.json` for exact dependency versions and use the matching APIs.

Everything under `app/` must stay statically exportable: no Server Actions, no
request-time rendering, and route handlers must be static (see `feed.xml`).

## Project structure

Folders and files are kebab-case, except `components/*`, which are PascalCase.

- **`app/`** — App Router routes:
  - `page.tsx` — the home page: a short intro plus `PostList` (all posts,
    searchable, grouped by year).
  - `(child)/about/page.tsx` — the `/about` page, composed from `getResume()`.
  - `(child)/blog/[date]/page.tsx` — a single article, with prev/next links.
  - `feed.xml/route.ts` — a static RSS feed (`export const dynamic = "force-static"`).
  - `layout.tsx` wraps every page in the narrow column with the header and
    footer; `(child)/layout.tsx` is a thin wrapper for the sub-pages.
- **`components/`** — small, focused components. The site chrome is `Header`,
  `Footer`, and `PostList`. Article content is rendered by `Markdown`, which
  composes `Heading`, `Link`, `Code` (inline), `Callout`, `Mermaid`,
  `ModalImage`, and `ButtonCopy`. `ZoomPanModal` is the shared enlarge/pan/zoom
  dialog used by both `ModalImage` and `Mermaid`. `Provider` sets up HeroUI and
  the theme; `Entry` seeds the article store on load.
- **`files/`** — content read through helper functions:
  - `files/articles/` — blog posts named `YYYY-MM-DD.md` (that folder's
    `CLAUDE.md` is the writing guide; `getArticleByFilename` in
    `helpers/server/article.ts` documents the front-matter fields).
  - `files/resume/Resume.yaml` — the résumé source of truth, plus the website
    `profile:` block and `projects:`, read via `getResume` in
    `helpers/server/resume.ts`. Résumé constraints live in the root `CLAUDE.md`.
- **`helpers/`** — shared functions. Same-domain helpers share a filename:
  `helpers/server/*` is server-only, `helpers/client/*` is client-only,
  `helpers/*` is shared.
- **`public/`** — static assets. Article images live in
  `public/images/<YYYY-MM-DD>/` named `Pascal-Case.ext`.
- **`scripts/`** — build scripts wired to npm scripts: `build-resume.mjs`,
  `build-versions.mjs` (project release versions), `build-readme.mjs` (profile
  README).
- **`settings/`** — `constant.ts` (global constants and route titles),
  `heads.ts` (metadata, viewport, fonts), `icons.ts` (icon mapping).
- **`stores/`** — Zustand stores: `article` (post list, seeded by `Entry`) and
  `chart` (theme-derived colors used by Mermaid).
- **`styles/`** — global CSS, including the theme plugin and the markdown /
  code-block styling.

## Rendering notes

- **Theme** is HeroUI + `next-themes` (`class` strategy). The accent is a
  petrol-teal defined in `styles/plugin-heroui.ts`; links, chips, and Mermaid
  accents use it. Style with theme tokens (`default-*`, `foreground`,
  `primary`) so both light and dark stay correct.
- **Code blocks** use `rehype-pretty-code` with dual themes
  (`github-light` / `github-dark`) and `keepBackground: false`, so they sit on
  the site's own surface and follow the theme.
- **Mermaid** renders client-side in `Mermaid.tsx`: each render uses a unique id
  (Strict Mode-safe), sizes the SVG to the column width via an explicit
  `aspect-ratio`, and reads teal/neutral theme colors from the `chart` store
  (`helpers/client/chart.ts`). Diagrams open in `ZoomPanModal` to enlarge, pan,
  and zoom.

The `Dockerfile` only builds the résumé documents and the profile README
(LibreOffice, pandoc, and fonts live in the image); the website itself is built
with `npm run build` on the host.
