---
paths:
  - "**/README.md"
  - "**/CONTRIBUTING.md"
  - "**/CLAUDE.md"
  - ".claude/**/*.md"
---

# Writing documentation

## One home per fact

Each scope carries three documents, and each answers one question:

| Document          | Answers              | Written for            |
| ----------------- | -------------------- | ---------------------- |
| `README.md`       | What is this?        | Someone browsing       |
| `CONTRIBUTING.md` | How do I work on it? | Someone changing it    |
| `CLAUDE.md`       | What must not break? | An agent about to edit |

- **A fact true of two scopes belongs at the root**, linked from both. Never
  restate it — before adding a paragraph, search for it:
  `grep -rn "<phrase>" --include="*.md" .`
- **Never contradict another document.** Two docs disagreeing is worse than
  neither existing; fix the owner and link to it.
- Link with a relative path (`./CONTRIBUTING.md`, `../content/README.md`), and
  check it resolves.

## Style

- **Say what is true and stop.** No summary of what the document just said, no
  "in conclusion", no restating a heading in its first sentence.
- **Explain the why the code cannot show.** A layout a reader can see in the
  file tree is not worth a paragraph; the reason a constant is 10656 twips is.
- Sentence case in headings, no symbols, no emoji.
- Prefer a table when three or more items share the same shape, a list when they
  do not, and prose when the reasoning matters more than the items.
- Fence every code block with a language — `shell` for terminal commands,
  `yaml`, `bash`, `markdown` for the rest.
- Use GitHub alerts (`> [!note]`, `> [!important]`, `> [!warning]`) sparingly;
  two on one page means neither is read.
- Wrap prose at 80 columns. Prettier preserves line breaks, so the wrapping is
  the author's to get right — but it does reflow tables, so run
  `npm run format` after editing.
- Write URLs as autolinks (`<https://example.com>`) and paths in backticks.
- No raw HTML.
