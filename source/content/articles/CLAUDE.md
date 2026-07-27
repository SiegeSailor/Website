# CLAUDE.md — source/content/articles

The blog posts, one file per post named `YYYY-MM-DD.md`. This is the writing
guide; see [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the edit-and-rebuild
loop and [`../CLAUDE.md`](../CLAUDE.md) for the rules that cover all content.

Follow every rule here. Ask before proceeding when a rule is unclear for the
article at hand, and say so when a rule reads as ambiguous or contradictory.

## Voice

Half professional, half conversational, with the occasional international
software engineer joke. First person for personal experience, specific details
and numbers over generalities, and companies, technologies, and tools named
with links. Read a few neighbouring posts before starting — they are the style
reference.

## Workflow

1. **Date** — take the draft date from the prompt, in `YYYY-MM-DD`. Read
   anything related in `input/`, and fetch what the web can add.
2. **Create** — write `source/content/articles/<YYYY-MM-DD>.md`. Copy any images
   used from `input/` to
   `../../website/public/images/<YYYY-MM-DD>/`, named `Pascal-Case.ext`, for
   example `Branch-Name-LTS.png`.
3. **Write** — a brief summary before `<!-- description -->` giving the history
   behind the post and its conclusion; the main content after it.
4. **Verify** — reread against this guide, run `npm run watch`, open
   `http://localhost:3000/blog/<YYYY-MM-DD>`, and confirm the terminal shows no
   error logs.

## Front matter

- Check `getArticleByFilename` in `../../website/helpers/server/article.ts` for
  the required fields
- No symbols in `title`
- Reuse an existing category from the neighbouring posts where one fits
  (case-sensitive)
- Check `../../website/settings/icons.ts` for existing technology names and
  spelling (case-sensitive). To add one, map an icon from
  `@icons-pack/react-simple-icons` in `TECHNOLOGY_TO_ICON`; if the technology has
  none, re-export a generic `lucide-react` icon in `LUCIDE_ICON` and map that

## Structure

- `## <heading>` for main sections, never `###`, except that `###` may open the
  article
- Headings concise, descriptive, and free of symbols
- Keep the conclusion brief, or skip it when it adds nothing

## Markdown

The renderer is `../../website/components/Markdown.tsx`; check it and
`../../website/helpers/plugin.ts` for what is supported.

- ` `` ` around inline code and mathematical expressions
- ` ```<language> ` for code blocks, with `title="/path/to/<filename>"` when the
  block refers to a file
- `:::<type>` callouts — the types are in
  `../../website/components/Callout.tsx`
- `[<title>](/blog/YYYY-MM-DD#anchor)` for internal links, the anchor optional
- `[Company Name](URL)` for companies, and a path relative to the repository
  root when referring to a file
- Mermaid diagrams where a diagram beats a paragraph

### Bullet points

- `- **<title>**: <description>` when the points share a topic
- `- [title](link): <description>` when there is a reference to link
- `- <description>` when the points are sentences that do not generalize
- `1.` instead of `-` for a process

## Don'ts

- Don't use `**<title>**` as a heading
- Don't end a bullet point with `.`
- Don't use symbols in headings
- Don't be verbose
