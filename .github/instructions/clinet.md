---
applyTo: "client/**/*"
---

# Project Overview

This is a Next.js project that integrates TypeScript and TailwindCSS. The application is containerized using Docker (see [`Dockerfile`](./../../client/Dockerfile)).

> [!note]
> Refer to [`package.json`](./../../client/package.json) for the specific versions of the dependencies used in this project. Please ensure the correct syntax and features for the versions used when providing suggestions.

## Project Structure

The project is structured as follows. All the folder and file names are in kebab-case and singular form, except for `component/*`:

### `app/`

The routes that follow the Next.js App Router convention.

### `component/`

Reusable components. The components are formed as follows:

- The components are named using PascalCase:
  - `Content*`: Composite components
  - Most of components are named according to their outer element, usually a HeroUI component, e.g., `Card*`, `Button*`, etc.
- `component/*.tsx`: When a component is self-contained
- `component/*/index.tsx`: When a component contains sub-components
- `component/*/*.ts`: Sub-components in the same folder

### `helper/`

Contains functions that can work in both server and client environments. Helpers for the same domain are named using the same filename, e.g., `helper/article.ts` and `helper/server/article.ts`. The folder is further divided into:

- `helper/server/*.ts`: Contains server-only functions
- `helper/client/*.ts`: Contains client-only functions
- `helper/*.ts`: Contains functions that can work in both server and client environments

### `public/`

Static assets. While these files can be accessed directly via `/<folder>/<file>` (a Next.js feature), it is fetched using the full URL through helper functions for server-side rendering. The folder structure is as follows:

- `public/article/`: Markdown files that follow the naming convention of `YYYY-MM-DD.md`, where the filename represents the publication date. The articles uses some special front-matter fields and syntaxes (see `getArticleByFilename` in `helper/server/article.ts` for details)
- `public/document/`: Other markdown files. Every file has its own formatting and front-matter fields (see `getProfile` in `helper/server/document.ts` for details)
- `public/images/`: Images used in the website:
  - Article scoped images are stored in `public/images/<YYYY-MM-DD>/` and named in the `Pascal-Case.ext` way, e.g., `public/images/2024-08-19/Branch-Name-LTS.png`

### `setting/`

Configuration files and constants. The folder is split into:

- `setting/constant.ts`: Global constants used in both server and client environments
- `setting/home.ts`: Hardcoded data for the home page, which may be shared across multiple components
- `setting/icon.ts`: Icon mapping

### `store/`

Global state management using Zustand. Note that some of the states are parsed before everything is loaded in `component/Entry.tsx`, which is contained in the root layout `app/layout.tsx`.

### `style/`

Global CSS styles.
