# CLAUDE.md — scripts

Shell scripts called by the npm scripts and the workflows. See
[`README.md`](./README.md) for what each one does and
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for the shape they all follow.

## Rules

- **Every script runs from the repository root** and guards for it. Never change
  a script to work from its own directory — the Docker build context, the npm
  scripts, and the workflows all assume the root.
- **Keep one job per script.** Reach for `source/tooling/` instead when the work
  is Node-shaped; a new shell script needs a shell-specific reason.
- **No new dependencies.** These run on a bare macOS and a bare Ubuntu runner:
  `bash`, `curl`, `git`, and the tool the script exists to drive.
- **`run-parallel.sh` traps every signal that ends it**, SIGHUP included,
  because job control puts the children in their own process groups and the trap
  becomes the only path that stops them. Do not simplify it to a bare
  `trap ... INT TERM`.
- **`docker-copy.sh` must never prompt for a password.** It escalates to `sudo`
  only when non-interactive `sudo` works or a TTY is attached; CI relies on it
  failing loudly instead of hanging.
