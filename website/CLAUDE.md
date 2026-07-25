# CLAUDE.md — Next.js application

This is the website itself: a TypeScript + TailwindCSS + HeroUI app built as a
static export (`output: "export"`) and served from S3 behind CloudFront. It is a
deliberately minimal blog — a single-column reading experience with a
searchable post list, a compact `/about` page, and clean article pages. Check
`package.json` for exact dependency versions and use the matching APIs.

Everything under `app/` must stay statically exportable: no Server Actions, no
request-time rendering, and route handlers must be static (see `feed.xml`).

Code is formatted with Prettier (`.prettierrc.json`) and linted with ESLint
(`eslint.config.mjs`, `eslint-config-next`). A Husky `pre-commit` hook runs
both plus `tsc --noEmit` over staged files via lint-staged
(`.lintstagedrc.mjs`), and CI enforces them across the app. Both configs live at
the repository root, so run `npm run format` and `npm run lint` from there.
Prettier owns formatting, ESLint owns correctness, and authored content
(`../content/`) is excluded from Prettier.

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
- **`helpers/`** — shared functions. Same-domain helpers share a filename:
  `helpers/server/*` is server-only, `helpers/client/*` is client-only,
  `helpers/*` is shared.
- **`public/`** — static assets. Article images live in
  `public/images/<YYYY-MM-DD>/` named `Pascal-Case.ext`.
- **`settings/`** — `constant.ts` (global constants and route titles),
  `heads.ts` (metadata, viewport, fonts), `icons.ts` (icon mapping).
- **`stores/`** — Zustand stores: `article` (post list, seeded by `Entry`) and
  `chart` (theme-derived colors used by Mermaid).
- **`styles/`** — global CSS, including the theme plugin and the markdown /
  code-block styling.

## Reading `content/`

This workspace holds no authored content — it all lives in `../content/`, and
each subfolder has its own `CLAUDE.md`:

- `content/resume/` is reached through the `@content/*` tsconfig alias.
  `getResume` in `helpers/server/resume.ts` imports `profile.yaml`,
  `summary.yaml`, `experience.yaml`, and `projects.yaml` as **raw text** — a
  webpack `asset/source` rule in `next.config.mjs` — so the dev server watches
  them and hot-reloads. Adding a top-level key the website needs means adding an
  import there; the folder is not globbed. Résumé constraints live in the root
  `CLAUDE.md`.
- `content/articles/` is read from disk by `helpers/server/article.ts`, which
  documents the front-matter fields. Article images stay here in
  `public/images/<YYYY-MM-DD>/` because Next.js serves them.

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

The résumé documents and the profile README are built by `tooling/`, not here;
this workspace only builds the site, with `npm run build` from the repository
root.
