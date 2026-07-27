# source/website

The website itself: a TypeScript, TailwindCSS, and HeroUI application on the
Next.js App Router, built as a static export (`output: "export"`) and served
from S3 behind CloudFront. It is a deliberately minimal blog — a single-column
reading experience with a searchable post list, a compact `/about` page, and
clean article pages.

The workspace holds no authored content. Every word comes from
[`../content/`](../content/README.md): the resume source through the
`@content/*` alias, and the blog posts from disk.

## Structure

Folders and files are kebab-case, except `components/*`, which are PascalCase.

| Folder                         | Holds                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [`app/`](./app/)               | App Router routes, plus `manifest.ts`, `robots.ts`, `sitemap.ts`, and the error and loading boundaries |
| [`components/`](./components/) | Small, focused components                                                                              |
| [`helpers/`](./helpers/)       | Shared functions: `server/*` server-only, `client/*` client-only, `*` shared                           |
| [`public/`](./public/)         | Static assets; article images in `public/images/<YYYY-MM-DD>/` named `Pascal-Case.ext`                 |
| [`settings/`](./settings/)     | `constant.ts` (constants and route titles), `heads.ts` (metadata, viewport, fonts), `icons.ts`         |
| [`stores/`](./stores/)         | Zustand stores: `article` (post list, seeded by `Entry`) and `chart` (theme colours for Mermaid)       |
| [`styles/`](./styles/)         | Global CSS, the HeroUI theme plugin, and the markdown and code-block styling                           |

## Routes

| Route                | Source                             | Renders                                                       |
| -------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `/`                  | `app/page.tsx`                     | A short intro plus `PostList`, searchable and grouped by year |
| `/about`             | `app/(child)/about/page.tsx`       | The profile, composed from `getAbout()`                       |
| `/blog/<YYYY-MM-DD>` | `app/(child)/blog/[date]/page.tsx` | One article, with previous and next links                     |
| `/feed.xml`          | `app/feed.xml/route.ts`            | A static RSS feed (`export const dynamic = "force-static"`)   |

`layout.tsx` wraps every page in the narrow column with the header and footer;
`(child)/layout.tsx` is a thin wrapper for the sub-pages.

## Components

The site chrome is `Header`, `Footer`, and `PostList`. Article content is
rendered by `Markdown`, which composes `Heading`, `Link`, `Code` (inline),
`Callout`, `Mermaid`, `ModalImage`, and `ButtonCopy`. `ZoomPanModal` is the
shared enlarge, pan, and zoom dialog behind both `ModalImage` and `Mermaid`.
`Provider` sets up HeroUI and the theme; `Entry` seeds the article store on
load.

## Configuration worth knowing

[`next.config.mjs`](./next.config.mjs) makes four decisions the rest of the code
depends on: the export lands in `export/` rather than `out/`; `typedRoutes`
makes route paths type-checked, which is why paths stay in code while route
_titles_ come from content; SVGs import as React components through SVGR (with
`?url` for a plain URL); and `.yaml` files are loaded as raw text
(`asset/source`) so the dev server watches `../content/` and hot-reloads the
pages built from it.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) to work on it and
[`CLAUDE.md`](./CLAUDE.md) for the constraints.
