---
paths:
  - "package.json"
  - "source/package.json"
---

# Editing a Package Manifest

Root scripts delegate and never implement: each one calls its counterpart in the `source` workspace, where the script actually runs. Version fields belong to Semantic Release; never bump one by hand.

## Commands

| Command             | Does                                         |
| ------------------- | -------------------------------------------- |
| `npm ci`            | Install from the root lockfile               |
| `npm run build`     | Static export to `source/export/`            |
| `npm run format`    | Prettier write; `format:check` verifies only |
| `npm run lint`      | ESLint; `lint:fix` autofixes                 |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm run watch`     | Development server                           |

The shell scripts are documented in [`scripts/README.md`](../../scripts/README.md), and the Terraform commands in [`infrastructure/CONTRIBUTING.md`](../../infrastructure/CONTRIBUTING.md).

## Adding a Command

A new script touches 3 places, and one missed step is silent:

1. [`source/package.json`](../../source/package.json), where the script actually runs
2. The root [`package.json`](../../package.json), delegating with `npm run <script> --workspace source`
3. The table above
