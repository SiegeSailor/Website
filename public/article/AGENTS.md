# AGENTS Instructions

## Gathering Date

- Find the draft date in the prompt
- Date format is `YYYY-MM-DD`
- Check articles in `public/article/` for name conflicts

## Creating the Article

- Create a file in `public/article/` with the filename as `YYYY-MM-DD.md` using the draft date gathered in [Gathering Date](#gathering-date)
- Copy images in `input/` that are used in the article to `public/image/<YYYY-MM-DD>/` and name them in `Pascal-Case.ext`, e.g., `Branch-Name-LTS.png`

### Front-Matter Fields

- Check `getArticleByFilename` in `helper/server/article.ts` for required front-matter fields
- Don't use any symbols in the `title` field
- Try to use one of the existing categories in `public/article/` (case-sensitive)
- Check `setting/icon.ts` for existing technology icons and spelling (case-sensitive)
- To add a technology, find suitable icons from `@icons-pack/react-simple-icons` and map them in `TECHNOLOGY_TO_ICON` in `setting/icon.ts`
- If a technology is not found in `@icons-pack/react-simple-icons`, use a generic icon from `lucide-react` and re-export it in `LUCIDE_ICON` in `setting/icon.ts`

## Writing the Article

- Check the other articles in `public/article/` for writing style
- Prior `<!-- description -->`, write a brief summary stating the behind history and conclusion
- After `<!-- description -->`, write the main content
- Conclusion or the last section should be brief. You may even skip it if not necessary

### Content Structure and Organization

- Use `## <heading>` for main sections within the article (not `###`)
- You may use `### <heading>` as the first section if needed
- Keep section headings concise and descriptive
- Use numbered lists for process descriptions (e.g., "1. **HR Screening**: description")
- Group related content under logical headings

### Professional Tone and Voice

- Use first-person perspective when describing personal experiences
- Include specific details and numbers
- Balance professional tone with personal anecdotes
- Mention specific companies, technologies, and tools by name with proper links

### Markdown Syntax

- Check `helper/plugin.ts`, `component/Markdown.tsx`, and their dependencies for supported markdown features
- Use ` `` ` to wrap inline code and mathematical expressions
- Use callout `:::<type>` when needed (see `component/Callout.tsx` for available types)
- Use code snippet ` ```<language> ` with proper syntax highlighting
- Add `title="/path/to/<filename>"` to a code snippet where a file is being referenced (Prefer a relative path from root unless no file structure mentioned)
- Use `[<title>](/blog/YYYY-MM-DD#anchor)` for internal articles, where `#anchor` is optional and `<title>` is a placeholder (it will be parsed to the actual titles in `component/Link.tsx`)
- Draw diagrams using Mermaid syntax if needed

### Code Examples and Technical Content

- Include problem descriptions with proper formatting using **bold** for labels
- Show example inputs/outputs in code blocks with comments explaining the expected results
- Use descriptive function names that match the problem context
- Use backticks for inline code, variable names, and technical terms

### Formatting Consistency

- Use `[Company Name](URL)` format for company references
- Use proper spacing around code blocks and sections
- Maintain consistent indentation in nested lists

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
