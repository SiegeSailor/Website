# AGENTS Instructions

## Gathering Information

- Find the draft date and category of the article in the prompt
- Date format is `YYYY-MM-DD`
- Check existing articles in `public/article/` for name conflicts
- Category should be one of the existing categories in `public/article/` (case-sensitive)
- Ask for any missing information

## Creating the Article

- Create a file in `public/article/` with the filename as `YYYY-MM-DD.md` using the draft date gathered in [Gathering Information](#gathering-information)
- Copy images in `input/` that are used in the article to `public/image/<YYYY-MM-DD>/` and name them in `Pascal-Case.ext`, e.g., `Branch-Name-LTS.png`

### Front-Matter Fields

- Check `getArticleByFilename` in `helper/server/article.ts` for required front-matter fields
- Don't use any symbols in the `title` field
- If the article mentions new technologies, find suitable icons from `@icons-pack/react-simple-icons` and map them accordingly in `setting/icon.ts`
- If not found, use a generic icon from `lucide-react` and re-export them in `LUCIDE_ICON` so that `component/IconTechnology.tsx` can use it to filter and style correctly

## Writing the Article

- Check the other articles in `public/article/` for writing style
- Before `<!-- description -->`, write a brief summary stating the behind history and conclusion
- After `<!-- description -->`, write the main content
- Use proper human tone
- Conclusion or the last section should be brief. You may even skip it if not necessary

### Markdown Syntax

- Check `helper/plugin.ts`, `component/Markdown.tsx`, and their dependencies for supported markdown features
- Use ` `` ` to wrap inline code and mathematical expressions
- Use callout `:::<type>` when needed (see `component/Callout.tsx` for available types)
- Use code snippet ` ```<language> ` with proper syntax highlighting
- You may add `title="/path/to/<filename>"` to the code snippet for the file being referenced (preferably a relative path from root unless no file structure mentioned)
- Use `[<title>](/blog/YYYY-MM-DD#anchor)` for internal articles, where `#anchor` is optional and `<title>` is a placeholder (it is converted into `<a />` in `component/Markdown.tsx` and gets the actual titles from `component/Link.tsx`)
- Draw diagrams using Mermaid syntax if needed (see `component/Mermaid.tsx` and `helper/client/chart.ts` for details)

### Bullet Points

- Use `- **<title>**: <description>` if you can generalize the common topic of the bullet points
- Use `- [title](link): <description>` if you can find a reference link
- Use `- <description>` if the bullet points contain sentences that are not easily generalized

### Don'ts

- Don't use `**<title>**` as headings
- Don't end bullet points with `.`
- Don't use any symbols in headings
- Don't be too verbose

## Testing the Syntax

- Always review and fix the syntax and writing style following [Writing the Article](#writing-the-article)
- Run `npm run watch` to start a local development server
- Run Playwright to test `http://localhost:3000/blog/<YYYY-MM-DD>`
- Make sure there is no error console logs in the terminal
