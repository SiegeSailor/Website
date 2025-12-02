# Add an Article

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
   - Don't use `**<text>**` as titles or headings, such as `**<text>**:` followed by a paragraph or a list of bullet points. Use `#`, `##`, `###`, etc. instead
   - Draw diagrams using Mermaid syntax if needed (see `component/Mermaid.tsx` and `helper/client/chart.ts` for details)
   - Use ` `` ` to wrap inline code and mathematical expressions
5. Write a brief summary before the `<!-- description -->` tag, which should state the behind history and conclusion. You are feel to use any supported syntax here
6. Write the main content after the `<!-- description -->` tag. Make sure follow the writing style of existing articles in `public/article/`
   - Regardless what already there in the article, fix any inconsistent writing style mistakes, which means contradicting to this instruction or other articles in `public/article/`
   - Use proper human tone and avoid being too verbose
   - Conclusion or the last section should be brief. You may even skip it if not necessary
7. Run `npm run watch` and check the article in the local development server at `http://localhost:3000/blog/<YYYY-MM-DD>`. You can fine the console logs in the terminal
