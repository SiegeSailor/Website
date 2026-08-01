---
paths:
  - "**/README.md"
  - "**/CONTRIBUTING.md"
  - "**/CLAUDE.md"
  - ".claude/**/*.md"
---

# Writing Documentation

Each scope carries three documents, and each answers one question:

| Document              | Audience | Purpose                             |
| --------------------- | -------- | ----------------------------------- |
| `.claude/rules/*.md`  | Agent    | What are the relevant rules?        |
| `.claude/skills/*.md` | Agent    | What can I reuse deterministically? |
| `**/CLAUDE.md`        | Agent    | What must I follow for this scope?  |
| `**/CONTRIBUTING.md`  | Human    | How do I work on this scope?        |
| `**/README.md`        | Human    | What is the scope about?            |
| `CLAUDE.md`           | Agent    | What must I follow?                 |
| `CONTRIBUTING.md`     | Human    | How do I contribute?                |
| `README.md`           | Human    | What is this?                       |

> [!important]
> When an agent is about to edit, it can ignore documents that target humans, but still needs to edit the document in a human-readable way. An agent only needs to read and update the documents that target humans when a content is about the human-readable content itself (see **Purpose** above).

If a fact belongs to multiple documents, we should move it to `.claude/rules/*.md` and link to it from the other documents. Before adding a paragraph anywhere, check that it is not already written down: `grep -rn "<phrase>" --include="*.md"`, and make sure never contradict to another document.

## Writing Style

Follow the styles strictly. Prompt the user if you find the following styles conflicting with the content you are writing:

- **Adopt GitHub Markdown**: Use GitHub MD syntax, e.g., `> [!important]`
- **Apply Title Case for Headings**: Headings, table headers, and list headers are always in title case
- **Avoid Newlines**: Only use a newline to separate paragraphs; let text wrap naturally
- **Comply Terminology**: Use consistent terminology as described in [Terminology](#terminology)
- **Fence Code Blocks**: Address code blocks with correct languages. `shell` for terminal commands
- **Follow Heading Patterns**: Same pattern for headers in a list or a table, e.g., Do Foo, Amazing Bar
- **Format Items**: Use tables when 3 or more items share the same shape, a list when they do not
- **Link with Relative Paths**: Write relative links when link to another file and check that it resolves
- **Mention File Location**: State what the filename and location are when it matters
- **Order Alphabetically**: Lists, tables, and ordered content should follow alphabetical order when applicable
- **State Only the Necessary**: No summary of what the document just said, no conclusion, and no restating a heading
- **Use Actual Numbers**: Use actual numbers instead of words like three, five, e.g., 2 dogs, 7 birds
- **Use Backticks for URLs**: Write URLs as `https://example.com`. No raw HTML
- **Use Double Quotes**: Use double quotes when applicable
- **Use Periods only for Paragraphs**: Headings, lists, and tables do not end with a period

> [!important]
> This file itself is the example of the documentation style. Ensure all documents look similar to this.

### Terminology

| Term     | Variants |
| -------- | -------- |
| GitHub   |          |
| YAML     | YML      |
| Markdown | MD       |

> [!note]
> When you find a term repeated, prompt user for confirmation to add to this table. If find 2 similar terms, prompt user to clarify, correct them to use the same term, and add to this table.
