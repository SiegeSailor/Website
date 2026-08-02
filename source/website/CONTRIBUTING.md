# Contributing to source/website

Read the [root guide](../../CONTRIBUTING.md) first for setup and for where commands run. Check `package.json` for exact dependency versions and use the matching APIs.

> [!important]
> [`CLAUDE.md`](./CLAUDE.md) states the 2 constraints this workspace cannot break: everything under `app/` stays statically exportable, and `content.ts` stays server-only.

## Working with Content

No page hard-codes a name, tagline, title, or link. Text comes from [`../content/`](../content/CONTRIBUTING.md) and reaches the app 2 ways:

- **`helpers/server/article.ts`**: Reads `../content/articles/` from disk and documents the front-matter fields, while the article images stay with the website because Next.js serves them — [`README.md`](./README.md#structure) gives the path
- **`helpers/server/content.ts`**: Globs `../content/resume/` with webpack `require.context` and parses each file as raw text, so adding, renaming, or deleting a YAML file needs no code change — each surface asks for its own consumer name, `getSite()` for the header, footer, and every `<head>`, `getHome()` for the home hero, and `getAbout()` for `/about`, and a page that needs a new key adds it to the right accessor

What deliberately stays in code: route **paths** (they are typed routing, unlike route titles), UI microcopy such as nav and button labels, the search placeholder, and the callout and error-page copy, plus `TECHNOLOGY_TO_ICON` and `MEDIA_TO_ICON`, which import React components.

`content.ts` is also a hand-kept twin of [`../tooling/scripts/load-content.mjs`](../tooling/CLAUDE.md#the-2-loaders-are-twins); changing one means changing the other.

## Adding a Page

1. Create the route under `app/`, inside `(child)/` unless it is the home page
2. Add its path to `settings/constant.ts` — paths are typed routing, so a typo is a type error — and its title to `routes.yaml` in the content folder
3. Give it `metadata` via `settings/heads.ts` rather than a literal `<title>`
4. Add a `loading.tsx` beside it if it does real work at build time

## Adding a Component

Components are PascalCase files directly in `components/`, or a folder with an `index.tsx` when they need a private child (see `Header/`). Keep them focused: one visual job each, composed by `Markdown` or a page rather than growing a mode flag. A component that reads content takes it as a prop from a server parent.

## Styling

Style with HeroUI theme tokens (`default-*`, `foreground`, `primary`) so both light and dark stay correct — never with a literal color. The accent is a petrol-teal defined in `styles/plugin-heroui.ts`; links, chips, and Mermaid accents all take it from there. The theme is HeroUI plus `next-themes` on the `class` strategy.

Code blocks use `rehype-pretty-code` with dual themes (`github-light` and `github-dark`) and `keepBackground: false`, so they sit on the site's own surface and follow the theme.

Mermaid renders client-side in `Mermaid.tsx`: each render uses a unique id (Strict Mode-safe), sizes the SVG to the column width with an explicit `aspect-ratio`, and reads teal and neutral colors from the `chart` store (`helpers/client/chart.ts`). Diagrams open in `ZoomPanModal`.

## Adding an Icon

`settings/icons.ts` maps names to components, which is why the mapping stays in code rather than in content. Prefer an icon from `@icons-pack/react-simple-icons`; if the technology has none, re-export a generic `lucide-react` icon in `LUCIDE_ICON` and map that.

## Troubleshooting

Next.js does not render `<title>` in `<head>` when a page throws — the page components appear to render before the head elements are aggregated from `metadata`. A missing title in development usually means an error further up the page, not a metadata problem.
