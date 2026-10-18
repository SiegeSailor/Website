# source

The website itself: a TypeScript, TailwindCSS, and HeroUI application on the Next.js App Router, built as a static export (`output: "export"`) and served from S3 behind CloudFront. It is a deliberately minimal blog — a single-column reading experience with a searchable article list, a compact `/about` page, and clean article pages.

Site copy lives in [`settings/content.ts`](./settings/content.ts) as plain typed constants; the posts live in [`articles/`](./articles/) as Markdown read from disk at build time.

## Structure

Folders and files are kebab-case, except `components/*`, which are PascalCase.

| Folder                         | Holds                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [`app/`](./app/)               | App Router routes, plus `manifest.ts`, `robots.ts`, `sitemap.ts`, and the error and loading boundaries |
| [`components/`](./components/) | Small, focused components                                                                              |
| [`helpers/`](./helpers/)       | Shared functions: `server/*` server-only, `client/*` client-only, `*` shared                           |
| [`public/`](./public/)         | Static assets; article images in `public/images/<YYYY-MM-DD>/` named `Pascal-Case.ext`                 |
| [`settings/`](./settings/)     | `constant.ts` (constants and route titles), `heads.ts` (metadata, viewport, fonts), `icons.ts`         |
| [`stores/`](./stores/)         | Zustand stores: `article` (article list, seeded by `Entry`) and `chart` (theme colors for Mermaid)     |
| [`styles/`](./styles/)         | Global CSS, the HeroUI theme plugin, and the Markdown and code-block styling                           |

## Routes

| Route                | Source                             | Renders                                                                                        |
| -------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `/`                  | `app/page.tsx`                     | A short intro plus `PostList`, filtered by text, category, and technology, and grouped by year |
| `/about`             | `app/(child)/about/page.tsx`       | The profile, composed from `getAbout()`                                                        |
| `/blog/<YYYY-MM-DD>` | `app/(child)/blog/[date]/page.tsx` | One article, with its sections, previous and next links, and comments                          |
| `/feed.xml`          | `app/feed.xml/route.ts`            | A static RSS feed (`export const dynamic = "force-static"`)                                    |

`PostList` keeps its filters in the URL — `/?q=release&category=DevOps&tech=GitLab,NPM` — so an article's category and technology links open it pre-filtered. A category or technology typed as a whole phrase selects its chip.

`layout.tsx` wraps every page in the narrow column with the header and footer; `(child)/layout.tsx` is a thin wrapper for the sub-pages.

## Components

The site chrome is `Header`, `Footer`, and `PostList`. Article content is rendered by `Markdown`, which composes `Heading`, `Link`, `Code` (inline), `Callout`, `Mermaid`, `ModalImage`, and `ButtonCopy`. `ZoomPanModal` is the shared enlarge, pan, and zoom dialog behind both `ModalImage` and `Mermaid`. `Provider` sets up HeroUI and the theme; `Entry` seeds the article store on load.

An article page adds `TableOfContents`, every heading indented by its depth plus a final "Comments" link, in the right gutter on wide screens and a disclosure on narrow ones, and `Comments`, which calls `/api/comments` from the browser. A comment is GitHub Markdown, rendered through `remark-html`, whose default sanitizing drops raw HTML, event handlers, and `javascript:` links, and the form previews it before posting. The section keeps one height until a reader expands it, so loading comments never shifts the page. That API is not part of the export: it lives in [`../infrastructure/`](../infrastructure/README.md).

## Configuration Worth Knowing

[`next.config.mjs`](./next.config.mjs) makes 5 decisions the rest of the code depends on:

| Decision                                         | Consequence                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `.yaml` files load as raw text (`asset/source`)  | The dev server watches `../content/` and hot-reloads the pages built from it            |
| Development proxies `/api/*` to the live site    | `npm run watch` loads real comments, and a comment posted locally is real and pending   |
| SVGs import as React components through SVGR     | A `?url` suffix gives a plain URL instead                                               |
| The export lands in `export/` rather than `out/` | Every deploy syncs `source/export/`                                                     |
| `typedRoutes` type-checks route paths            | Paths stay in code while route _titles_ come from content, where a typo is a type error |

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) to work on it and [`CLAUDE.md`](./CLAUDE.md) for the constraints.
