import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { loadContent, loadVersions } from "./load-content.mjs";

// Generates the GitHub profile README (SiegeSailor/SiegeSailor) from the content
// declaring `readme` in its `consumers:` — the same profile, summary, and
// projects that drive the /about page, so the two stay in lockstep. Writes
// export/SiegeSailor-README.md (like build-resume writes export/resume/*); the
// Docker image builds it and the deploy workflow copies it out and pushes it to
// the profile repository.

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_FILE = join(ROOT, "export/SiegeSailor-README.md");
const REGEX_GITHUB_REPO = /^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/;
// Presentation order, not content: Planning projects are hidden entirely.
const STAGE_ORDER = { Production: 0, Development: 1, Planning: 2 };
const MILLISECOND_ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const { data, headings } = loadContent("readme");

const heading = (key) => {
  const text = headings[key];
  if (!text)
    throw new Error(
      `source/content/resume/ gives the readme a \`${key}\` key with no \`heading:\` to title its section`,
    );
  return text;
};

// Total experience is source/content/resume/timeline.yaml applied to today, not
// a stated figure. source/website/helpers/server/content.ts computes the same thing from
// the same content; see load-content.mjs on why the two are separate.
function experienceYears() {
  const { start, excluded = [] } = data.timeline;
  const total = new Date().getTime() - new Date(start).getTime();
  const skipped = excluded.reduce(
    (sum, period) =>
      sum + (new Date(period.end).getTime() - new Date(period.start).getTime()),
    0,
  );
  const [year, month] = ((total - skipped) / MILLISECOND_ONE_YEAR)
    .toFixed(1)
    .split(".");
  const monthFloor = Math.floor((Number(month) / 10) * 12);
  return `${year} Years ${month === "0" ? "" : `${monthFloor} Months`}`.trim();
}

const repoKey = (href) => {
  const match = String(href).match(REGEX_GITHUB_REPO);
  return match ? `${match[1]}/${match[2].replace(/\.git$/, "")}` : null;
};
const versionLabel = (version) =>
  /^v/i.test(version) ? version : `v${version}`;

const versions = loadVersions();
const profile = data.profile;

const projects = (data.projects || [])
  .filter((project) => project.stage !== "Planning")
  .sort((left, right) => STAGE_ORDER[left.stage] - STAGE_ORDER[right.stage])
  .map((project) => {
    const key = repoKey(project.href);
    const version = key ? versions[key] : null;
    return `- [${project.title}](${project.href}) — ${
      version ? versionLabel(version) : project.stage.toLowerCase()
    }`;
  });

const links = (data.media || [])
  .map((entry) => `[${entry.label}](${entry.href})`)
  .join(" · ");
const about = `https://${data.site.domain}/about`;

const readme = [
  `# ${data.identity.display}`,
  "",
  `**${profile.headlines.join(" · ")}**`,
  "",
  `${profile.status.location} · ${profile.status.position} · ${experienceYears()} experience`,
  "",
  `## ${heading("summary")}`,
  "",
  data.summary[0].text.trim(),
  "",
  `## ${heading("projects")}`,
  "",
  ...projects,
  "",
  `## ${heading("media")}`,
  "",
  links,
  "",
  "---",
  "",
  `<sub>Generated from <a href="${about}">${data.site.domain}/about</a> — do not edit by hand.</sub>`,
  "",
].join("\n");

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, `${readme}\n`);
console.log(`built ${relative(ROOT, OUTPUT_FILE)}`);
