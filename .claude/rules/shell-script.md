---
paths:
  - "**/*.sh"
  - ".husky/*"
---

# Writing a shell script

Neither Prettier nor ESLint touches shell, so the convention is the whole
review. The skeleton to copy is in
[`scripts/CONTRIBUTING.md`](../../scripts/CONTRIBUTING.md); these are the rules
it encodes.

- **Guard the working directory first.** Every script runs from the repository
  root: test for a file that only exists there, then fail with `[ERROR]` on
  stderr and `exit 1`. Never make a script work from its own directory instead —
  the npm scripts, the Docker context, and the workflows all assume the root.
- **`set -o errexit` at the top**, and `set -o monitor` only where the script
  supervises long-lived children.
- **One `main`**, taking positional arguments with `"${1:-default}"` defaults and
  invoked as `main "$@"` on the last line.
- **A block comment on every function** — `Globals`, `Arguments`, `Outputs`,
  `Returns`, as they apply — and a file header saying what the script does and
  which constraint the code cannot show.
- **`readonly` and `local -r`** for anything that does not change; quote every
  expansion.
- **Log through the colour constants** with `[INFO]`, `[WARNING]`, `[ERROR]`, and
  `[DONE]` prefixes. Warnings and errors go to stderr.
- **Never prompt.** These run unattended in CI, so a script that could block on
  `sudo` or a confirmation must detect that and fail loudly instead.
- **No new dependencies** beyond `bash`, `curl`, `git`, and the tool the script
  exists to drive.

Check both paths after editing — from the root, and from a subdirectory to
confirm the guard fires.
