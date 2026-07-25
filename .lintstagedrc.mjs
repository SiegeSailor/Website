// Mirrors the CI checks (format, lint, typecheck) on staged files only.
// Prettier skips its own ignored paths, so authored content stays untouched.
// ESLint and tsc are workspace-scoped — their configs live in website/ — so
// they run through that workspace's own scripts rather than on staged paths.
export default {
  "website/**/*.{js,jsx,mjs,cjs,ts,tsx}": [
    () => "npm run lint:fix --workspace website",
    "prettier --write",
  ],
  "website/**/*.{ts,tsx}": () => "npm run typecheck --workspace website",
  "**/*.{css,json,md,mdx,yaml,yml}": "prettier --write",
  "{tooling,scripts}/**/*.{mjs,js}": "prettier --write",
  "*.{mjs,js}": "prettier --write",
};
