---
name: commit
description: Write a commit message for this repository. Conventional Commits, one line, no body. Use whenever committing, amending, or drafting a commit message here.
---

# Commit

A commit message is one [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) line and nothing else:

```text
<type>(<scope>)?: <subject>
```

| Rule                                    | Detail                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| No body, no footer, no trailers         | The subject is the whole message                                                 |
| One concern per commit                  | Split by concern rather than by file, even when the work was a single task       |
| Scope only when it sharpens the subject | The **Commit Scope** of the scope the change sits in, and most commits need none |
| Under 72 characters                     | Type included, imperative mood, lowercase after the colon, no trailing period    |

> [!note]
> [`documentation.md`](../../rules/documentation.md#scopes) owns the scopes and the name each one lends to `<scope>`. A change that spans scopes, or that sits at the root, takes none.

The type decides the release, so a careless one publishes a version:

| Type                                                       | Release |
| ---------------------------------------------------------- | ------- |
| `feat`                                                     | minor   |
| `fix`                                                      | patch   |
| `feat!`, `fix!` (any type with `!`)                        | major   |
| `refactor`, `docs`, `ci`, `chore`, `test`, `style`, `perf` | none    |

> [!important]
> Do not use `BREAKING CHANGE:` footer, which would need a body.

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
