import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { loadContent, loadVersions, VERSIONS_FILE } from "./content.mjs";

// Resolves the latest release/tag for each GitHub project in content/projects.yaml
// and writes content/versions.generated.json ({ "owner/repo": "2.3.0" }), consumed
// by both website/helpers/server/resume.ts and build-readme.mjs. Resilient by
// design: any network / auth
// / 404 failure is skipped (that project simply shows no version chip), the
// existing JSON is preserved, and the process always exits 0 so `npm run build`
// never fails offline. Prefers the authenticated `gh` CLI, falls back to the
// REST API (GH_TOKEN / GITHUB_TOKEN if present, else unauthenticated).

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const OUTPUT_FILE = VERSIONS_FILE;
const REGEX_GITHUB_REPO = /^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/;
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";

const hasGh = () => {
  try {
    execSync("command -v gh", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};
const GH = hasGh();

async function apiJson(path) {
  if (GH) {
    try {
      return JSON.parse(
        execSync(`gh api ${path}`, {
          stdio: ["ignore", "pipe", "ignore"],
        }).toString(),
      );
    } catch {
      return null;
    }
  }
  const response = await fetch(`https://api.github.com/${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "build-versions",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  }).catch(() => null);
  if (!response || !response.ok) return null;
  return response.json().catch(() => null);
}

async function latestVersion(owner, repo) {
  const release = await apiJson(`repos/${owner}/${repo}/releases/latest`);
  if (release?.tag_name) return release.tag_name;
  const tags = await apiJson(`repos/${owner}/${repo}/tags`);
  if (Array.isArray(tags) && tags[0]?.name) return tags[0].name;
  return null;
}

async function main() {
  const versions = loadVersions();

  const data = loadContent();
  const repos = new Map();
  for (const project of data.projects || []) {
    const match = String(project.href || "").match(REGEX_GITHUB_REPO);
    if (match) {
      const repo = match[2].replace(/\.git$/, "");
      repos.set(`${match[1]}/${repo}`, [match[1], repo]);
    }
  }

  const next = { ...versions };
  for (const [key, [owner, repo]] of repos) {
    const version = await latestVersion(owner, repo);
    if (version) next[key] = version;
  }

  writeFileSync(OUTPUT_FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    `built ${relative(ROOT, OUTPUT_FILE)} (${Object.keys(next).length} version${
      Object.keys(next).length === 1 ? "" : "s"
    })`,
  );
}

main().catch((error) => {
  console.warn(`build-versions skipped: ${error?.message ?? error}`);
});
