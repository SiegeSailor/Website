---
name: commit
description: Write a commit message for this repository. Conventional Commits, one line, no body. Use whenever committing, amending, or drafting a commit message here.
---

# Commit

A commit message is one [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) line and nothing else:

```text
<type>(<scope>)?: <subject>
```

| Part        | Rule                                                          |
| ----------- | ------------------------------------------------------------- |
| `<scope>`   | Only when it sharpens the subject, and most commits need none |
| `<subject>` | Imperative mood, lowercase, and no trailing period            |
| `<type>`    | Picks the release from the table below                        |

The subject is the whole message, no body, no footer, no trailers, and the line stays under 72 characters, type included. One concern per commit: split by concern rather than by file, even when the work was a single task.

> [!note]
> [`CLAUDE.md`](../../../CLAUDE.md#scopes) owns the scopes and the name each one lends to `<scope>`. A change that spans scopes, or that sits at the root, takes none.

| Type                                                       | Release |
| ---------------------------------------------------------- | ------- |
| `feat!`, `fix!` (any type with `!`)                        | major   |
| `feat`                                                     | minor   |
| `fix`                                                      | patch   |
| `chore`, `ci`, `docs`, `perf`, `refactor`, `style`, `test` | none    |

> [!important]
> A careless type publishes a version. Do not use a `BREAKING CHANGE:` footer, which would need a body.

Example commit messages:

```text
feat(tooling): aggregate build and watch over their :* variants
ci: split workflows by task and rename them by trigger
```

> [!important]
> A major version is a human's call. Prompt before wiring the `!`.

### Before Committing

- **Let the Hook Run**: A failure means fixing the code, not passing `--no-verify`
- **Stage Deliberately**: `git add -A` sweeps in unrelated work, so read `git status` first and never stage generated output
- **Wait to Be Asked**: Commit only when asked, and push only when asked
- **Work on a Branch**: `main` deploys and releases on every push
