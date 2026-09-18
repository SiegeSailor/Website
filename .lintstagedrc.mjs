// Mirrors the CI checks (format, lint, typecheck) on staged files only.
// ESLint and tsc are workspace-scoped — their configs live in source/ — so they
// run through that workspace's own scripts rather than on staged paths.
export default {
  "source/**/*.{js,jsx,mjs,cjs,ts,tsx}": [
    () => "npm run lint:fix --workspace source",
    "prettier --write",
  ],
  "source/**/*.{ts,tsx}": () => "npm run typecheck --workspace source",
  "**/*.{css,json,md,mdx,yaml,yml}": "prettier --write",
  "scripts/**/*.{mjs,js}": "prettier --write",
  "*.{mjs,js}": "prettier --write",
};
