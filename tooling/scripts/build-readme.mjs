import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { loadContent, loadVersions } from "./content.mjs";

// Generates the GitHub profile README (SiegeSailor/SiegeSailor) from the same
// content/ `profile` block, summary, and projects that drive the /about page,
// so the two stay in lockstep. Writes export/SiegeSailor-README.md (like
// build-resume writes export/resume/*); the Docker image builds it and the
// deploy workflow copies it out and pushes it to the profile repository.

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_FILE = join(ROOT, "export/SiegeSailor-README.md");
const REGEX_GITHUB_REPO = /^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/;
const NAME = "Jin Yu Zhang";
const ABOUT_URL = "https://jinyu-zhang.com/about";
const STAGE_ORDER = { Production: 0, Development: 1, Planning: 2 };
const MILLISECOND_ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const TIMELINE = {
  start: "2016-06-01",
  intervals: [
    { start: "2017-01-01", end: "2017-06-30" },
    { start: "2022-02-01", end: "2024-01-31" },
  ],
};

function experienceYears() {
  const now = new Date();
  const start = new Date(TIMELINE.start);
  const total = now.getTime() - start.getTime();
  const excluded = TIMELINE.intervals.reduce(
    (sum, period) =>
      sum + (new Date(period.end).getTime() - new Date(period.start).getTime()),
    0,
  );
  const [year, month] = ((total - excluded) / MILLISECOND_ONE_YEAR)
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

const readVersions = loadVersions;

const data = loadContent();
const profile = data.profile;
const versions = readVersions();

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

const readme = [
  `# ${NAME}`,
  "",
  `**${profile.headlines.join(" · ")}**`,
  "",
  `${profile.status.location} · ${profile.status.position} · ${experienceYears()} experience`,
  "",
  "## Summary",
  "",
  data.summary.find((entry) => entry.labels?.includes("resume")).text.trim(),
  "",
  "## Projects",
  "",
  ...projects,
  "",
  "## Links",
  "",
  `[GitHub](${profile.media.github}) · [LinkedIn](${profile.media.linkedin}) · [Résumé (PDF)](${profile.media.resume})`,
  "",
  "---",
  "",
  `<sub>Generated from <a href="${ABOUT_URL}">jinyu-zhang.com/about</a> — do not edit by hand.</sub>`,
  "",
].join("\n");

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, `${readme}\n`);
console.log(`built ${relative(ROOT, OUTPUT_FILE)}`);
