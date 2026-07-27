---
name: commit
description: Write a commit message for this repository — Conventional Commits, one line, no body. Use whenever committing, amending, or drafting a commit message here.
---

# Commit

## The message is one line

```
<type>(<scope>)?: <subject>
```

- **No body, no footer, no trailers.** Not a description, not a bullet list, not
  `Co-Authored-By`. The subject is the whole message.
- **Under 72 characters**, type included.
- **Imperative mood**, lowercase after the colon, no trailing period.
- **Scope only when it sharpens the subject** — most commits need none.

Say what the commit does, not what it touches:

```
refactor: nest the three workspaces under source/
feat: aggregate build and watch over their :* variants
fix: skip the Husky hook install when Husky is absent
ci: split workflows by task and rename them by trigger
```

## The type decides the release

[semantic-release](../../../release.config.mjs) reads the type on every push to
`main`, so a careless one publishes a version.

| Type                                                       | Release |
| ---------------------------------------------------------- | ------- |
| `feat`                                                     | minor   |
| `fix`                                                      | patch   |
| `feat!`, `fix!` (any type with `!`)                        | major   |
| `refactor`, `docs`, `ci`, `chore`, `test`, `style`, `perf` | none    |

Mark a breaking change with `!` after the type — never with a
`BREAKING CHANGE:` footer, which would need a body. A major version is Ken's
call: ask before writing the `!`.

## One concern per commit

Split by concern rather than by file, even when the work was one task. The
workflow rename and the documentation refactor that followed it went in as two
commits because each stands alone in the history and in a diff.

## Before committing

- **Work on a branch.** `main` deploys and releases on every push.
- **Let the hook run.** Husky runs Prettier, ESLint, and `tsc` over staged files;
  a failure means fix the code, not `--no-verify`.
- **Stage deliberately.** `git add -A` sweeps in unrelated work — check
  `git status` first, and never stage generated output.
- **Commit only when asked**, and push only when asked.
