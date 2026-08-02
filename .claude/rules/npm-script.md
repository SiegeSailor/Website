---
paths:
  - "package.json"
  - "source/*/package.json"
---

# Editing a Package Manifest

`build` and `watch` are aggregates written out by hand — NPM does not expand script globs — so a variant missing from its aggregate never runs, and nothing reports it. Version fields belong to Semantic Release; never bump one by hand.

## Commands

| Command                  | Does                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `npm ci`                 | Install the 2 member workspaces from the root lockfile                              |
| `npm run build`          | Every `build:*` target, in dependency order                                         |
| `npm run build:readme`   | `source/content/` → `source/tooling/export/SiegeSailor-README.md`                   |
| `npm run build:resume`   | `source/content/` → `source/tooling/export/resume/*.{docx,pdf}`                     |
| `npm run build:versions` | Latest GitHub release per project → `source/content/resume/versions.generated.json` |
| `npm run build:website`  | Static export to `source/website/export/`                                           |
| `npm run format`         | Prettier write; `format:check` verifies only                                        |
| `npm run lint`           | ESLint; `lint:fix` autofixes                                                        |
| `npm run typecheck`      | `tsc --noEmit`                                                                      |
| `npm run watch`          | Every `watch:*` target at once, in one terminal                                     |
| `npm run watch:readme`   | Rebuild the README on a `source/content/` change                                    |
| `npm run watch:resume`   | Rebuild the resume documents on a `source/content/` change                          |
| `npm run watch:website`  | Development server only                                                             |

The shell scripts are documented in [`scripts/README.md`](../../scripts/README.md), and the Terraform commands in [`infrastructure/CONTRIBUTING.md`](../../infrastructure/CONTRIBUTING.md).

## Adding a Command

A new `build:<name>` or `watch:<name>` touches 4 places, and one missed step is silent — an unlisted variant simply never runs:

1. The workspace `package.json`, where the script actually runs
2. The root `package.json`, delegating with `npm run <script> --workspace source/<workspace>`, because root scripts delegate and never implement
3. The root aggregate: `build` chains with `&&` in dependency order and `build:versions` stays first, because the others read the JSON it writes, while `watch` passes its targets to `scripts/npm-parallel.sh`
4. The table above
