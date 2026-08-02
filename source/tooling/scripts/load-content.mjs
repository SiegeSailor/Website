import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";

// source/content/resume/ is a file-consumers structure: every file declares the
// documents that read it in `consumers:`, optionally names its document section
// in `heading:`, and carries exactly one content key. Loading for a consumer
// therefore returns only what that consumer is entitled to, and a section
// disappears from a document by dropping its name from `consumers`.
//
// A node inside a file is printed unless it carries `archived: true`, which
// keeps verified material in the source and prints it nowhere. Archiving is
// consumer-independent, so an archived node leaves every document at once.
//
// source/website/helpers/server/content.ts is the deliberate twin of this module. The
// website cannot import it (tooling is a separate workspace, pinned to js-yaml
// and docx so its Docker image stays small) and needs webpack to own the files
// for dev hot-reload, so the two implementations are kept in step by hand.

export const CONTENT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../content/resume",
);
export const VERSIONS_FILE = join(CONTENT_DIR, "versions.generated.json");

const META_KEYS = new Set(["consumers", "heading"]);

const isNode = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isArchived = (value) => isNode(value) && value.archived === true;

// The `archived` flag is dropped on the way out so it never reaches a renderer.
// A node-level `consumers:` is the superseded syntax and is rejected rather than
// ignored, because ignoring it would silently print material meant to be held back.
const prune = (value, file) => {
  if (Array.isArray(value))
    return value
      .filter((item) => !isArchived(item))
      .map((item) => prune(item, file));
  if (!isNode(value)) return value;
  if ("consumers" in value)
    throw new Error(
      `source/content/resume/${file} has a node-level \`consumers:\`; hold a node back with \`archived: true\``,
    );
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, nested]) => key !== "archived" && !isArchived(nested))
      .map(([key, nested]) => [key, prune(nested, file)]),
  );
};

const readFiles = () =>
  readdirSync(CONTENT_DIR)
    .filter((file) => /\.ya?ml$/i.test(file))
    .sort()
    .map((file) => ({
      file,
      document: load(readFileSync(join(CONTENT_DIR, file), "utf8")) ?? {},
    }));

// Every file must name its consumers and hold exactly one content key, so a
// silent typo becomes a build failure instead of a section that vanishes.
const parseFile = ({ file, document }) => {
  if (!Array.isArray(document.consumers))
    throw new Error(
      `source/content/resume/${file} is missing a \`consumers:\` list`,
    );
  const keys = Object.keys(document).filter((key) => !META_KEYS.has(key));
  if (keys.length !== 1)
    throw new Error(
      `source/content/resume/${file} must hold exactly one content key, found ${
        keys.length ? keys.join(", ") : "none"
      }`,
    );
  return {
    file,
    key: keys[0],
    consumers: document.consumers,
    heading: document.heading,
    value: document[keys[0]],
  };
};

export const loadContent = (consumer) => {
  const data = {};
  const headings = {};
  const origin = {};

  for (const entry of readFiles().map(parseFile)) {
    if (origin[entry.key])
      throw new Error(
        `source/content/resume/ declares \`${entry.key}\` in both ${origin[entry.key]} and ${entry.file}; a key must live in exactly one file`,
      );
    origin[entry.key] = entry.file;
    if (!entry.consumers.includes(consumer)) continue;
    data[entry.key] = prune(entry.value, entry.file);
    if (entry.heading) headings[entry.key] = entry.heading;
  }

  return { data, headings };
};

export const loadVersions = () => {
  if (!existsSync(VERSIONS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(VERSIONS_FILE, "utf8"));
  } catch {
    return {};
  }
};
