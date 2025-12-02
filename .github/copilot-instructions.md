# Copilot Instructions

This is a Next.js project that integrates TypeScript and TailwindCSS, and uses GitHub Actions to automate the build, test, and deployment processes. The application is containerized using Docker (see `Dockerfile`).

> [!note]
> Refer to `package.json` for the specific versions of the dependencies used in this project. Please ensure the correct syntax and features for the versions used when providing suggestions.

## Project Structure

The project is structured as follows. All the folder and file names are in kebab-case and singular form, except for `component/*`:

- `.github/workflows/`: WIP. This will contain GitHub Actions workflows and copilot instructions
- `app/`: The routes that follows the Next.js App Router convention
- `component/`: Reusable components. The components are formed as follows:
  - The components are named using PascalCase:
    - `Content*`: Composite components
    - Most of components are named according to their outer element, usually a HeroUI component, e.g., `Card*`, `Button*`, etc.
  - `component/*.tsx`: When a component is self-contained
  - `component/*/index.tsx`: When a component contains sub-components
    - `component/*/*.ts`: Sub-components in the same folder
- `helper/`: Contains functions that can work in both server and client environments. Helpers for the same domain are named using the same filename, e.g., `helper/article.ts` and `helper/server/article.ts`. The folder is further divided into:
  - `helper/server/`: Contains server-only functions
  - `helper/client/`: Contains client-only functions
- `public/`: Static assets. While these files can be accessed directly via `/<folder>/<file>` (a Next.js feature), it is fetched using the full URL through helper functions for server-side rendering. The folder structure is as follows:
  - `public/article/`: Markdown files that follow the naming convention of `YYYY-MM-DD.md`, where the filename represents the publication date. The articles uses some special front-matter fields and syntaxes (see `getArticleByFilename` in `helper/server/article.ts` for details)
  - `public/document/`: Other markdown files. Every file has its own formatting and front-matter fields (see `getProfile` in `helper/server/document.ts` for details)
  - `public/image/`: Images used in the website:
    - Article scoped images are stored in `public/image/<YYYY-MM-DD>/` and named in the `Pascal-Case.ext` way, e.g., `public/image/2024-08-19/Branch-Name-LTS.png`
- `setting/`: Configuration files and constants. The folder is split into:
  - `setting/constant.ts`: Global constants used in both server and client environments
  - `setting/home.ts`: Hardcoded data for the home page, which may be shared across multiple components
  - `setting/icon.ts`: Icon mapping
- `store/`: Global state management using Zustand. Note that some of the states are parsed before everything is loaded in `component/Entry.tsx`, which is contained in the root layout `app/layout.tsx`
- `style/`: Global CSS styles

## Add an Article

Some steps to check when adding a new article. You will find information, such as publication date and front-matter fields in the prompt, or you may find them in `input/`. Ask for any missing information:

1. Create a markdown file in `public/article/` with the filename as `YYYY-MM-DD.md`, where `YYYY-MM-DD` is the publication date. Make sure there is no name conflict
2. Add the front-matter fields as required. Refer to existing articles and `getArticleByFilename` in `helper/server/article.ts` for the necessary fields
   - Don't use special characters in the `title` field
   - You may need to add new icons in `setting/icon.ts` if the article mentions new technologies. Try to find suitable icons from `@icons-pack/react-simple-icons`. If not found, you can use a generic icon from `lucide-react`
     - Remember to re-export the `lucide-react` icons in `LUCIDE_ICON` in `setting/icon.ts` so that `component/IconTechnology.tsx` can use it to filter and style correctly
3. Copy images used in the article to `public/image/<YYYY-MM-DD>/` and name them in `Pascal-Case.ext`, e.g., `Branch-Name-LTS.png`
4. Follow the other articles in `public/article/` for the markdown syntax and writing style
   - Check `helper/plugin.ts`, `component/Markdown.tsx`, and their dependencies for supported markdown features
   - Use callout `:::<type>` when needed (see `component/Callout.tsx` for available types)
   - Add code snippets ` ```<language> ` with proper syntax highlighting. You may add `title="/path/to/<filename>"` to the file being referenced if needed (preferably a relative path from root unless just a common file)
   - All Markdown formats are supported
   - Use `[<title>](/blog/YYYY-MM-DD#anchor)` for internal links to other articles, where `#anchor` is optional and `<title>` is only a placeholder (see how links are converted into components in `component/Markdown.tsx` and gets the actual titles from `component/Link.tsx`)
   - Don't use `**<text>**` as titles or headings. Use `#`, `##`, `###`, etc.
   - Draw diagrams using Mermaid syntax if needed (see `component/Mermaid.tsx` and `helper/client/chart.ts` for details)
5. Write a brief summary before the `<!-- description -->` tag, which should state the behind history and conclusion. You are feel to use any supported syntax here
6. Write the main content after the `<!-- description -->` tag. Make sure follow the writing style of existing articles in `public/article/`
7. Run `npm run watch` and check the article in the local development server at `http://localhost:3000/blog/<YYYY-MM-DD>`
