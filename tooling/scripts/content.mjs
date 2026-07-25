import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";

// content/ is split one file per top-level key; merging here means a key must
// appear in exactly one file. The website reads the same files directly instead
// of using this module, because it needs raw text for dev hot-reload.

export const CONTENT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../content/resume",
);
export const VERSIONS_FILE = join(CONTENT_DIR, "versions.generated.json");

export const loadContent = () =>
  Object.assign(
    {},
    ...readdirSync(CONTENT_DIR)
      .filter((file) => /\.ya?ml$/i.test(file))
      .sort()
      .map((file) => load(readFileSync(join(CONTENT_DIR, file), "utf8")) ?? {}),
  );

export const loadVersions = () => {
  if (!existsSync(VERSIONS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(VERSIONS_FILE, "utf8"));
  } catch {
    return {};
  }
};
