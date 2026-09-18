# CLAUDE.md — scripts

Shell scripts called by the workflows and by hand.

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — **read before editing a script**; it owns the skeleton, the shape, when a script should exist, and how to check a change
- [`README.md`](./README.md) — what each script does and how to run it

## Constraints That Must Never Break

- **Guard the Working Directory First**: Test for a file or folder that only exists at the root, and fail with `[ERROR]` on stderr and exit 1 — never make a script work from its own directory instead, because the NPM scripts and the workflows all assume the root
- **Never Prompt**: These may run unattended in CI, so anything that could block — a `sudo` password, a confirmation — must be detected and fail loudly instead

## Per-Script Constraints

- **`cloudfront-warm.sh` Reads the Deployed `sitemap.xml`**: Not the working tree, so it warms what is actually live even when the tree is ahead of it
