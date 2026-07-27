# CLAUDE.md — scripts

Shell scripts called by the npm scripts and the workflows. See
[`README.md`](./README.md) for what each one does and
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for the shape they all follow. How to
write one is a path-scoped rule,
[`.claude/rules/shell-script.md`](../.claude/rules/shell-script.md), which loads
whenever a `*.sh` is opened.

## Rules for this folder

- **Keep one job per script.** Reach for `source/tooling/` instead when the work
  is Node-shaped; a new shell script needs a shell-specific reason.
- **`run-parallel.sh` traps every signal that ends it**, SIGHUP included,
  because job control puts the children in their own process groups and the trap
  becomes the only path that stops them. Do not simplify it to a bare
  `trap ... INT TERM`.
- **`docker-copy.sh` must never prompt for a password.** It escalates to `sudo`
  only when non-interactive `sudo` works or a TTY is attached; CI relies on it
  failing loudly instead of hanging.
- **Building the image is what generates the artifacts**, so `docker-copy.sh`
  cannot skip the build to save time; layer caching already makes an unchanged
  image cheap.
