import next from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

// Next.js-aware linting (React hooks, next/image, a11y) with Prettier last so
// formatting is owned by Prettier alone. Keep this file the single source of
// lint rules; formatting rules live in .prettierrc.
export default [
  ...next,
  prettier,
  {
    rules: {
      // Components here are intentionally anonymous `export default function`s;
      // that is the codebase-wide convention for routes and components.
      "import/no-anonymous-default-export": "off",
      "react/display-name": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "export/**",
      "build-cache/**",
      "public/**",
      "SiegeSailor-README.md",
    ],
  },
];
