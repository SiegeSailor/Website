import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RESUME_FILE = join(ROOT, "files/resume/Resume.yaml");
const PROFILE_FILE = join(ROOT, "files/documents/Profile.md");

const DATA = load(readFileSync(RESUME_FILE, "utf8"));

const MONTH_TO_INDEX = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const inProfile = (item) => !item?.variants || item.variants.includes("profile");
const withPeriod = (s) => (s.endsWith(".") ? s : `${s}.`);
const getLinkLabel = (url) => new URL(url).hostname.replace(/^www\./, "");

const getStart = (dates) => {
  const [month, year] = clean(dates).split("–")[0].trim().split(" ");
  const start = Number(year) * 12 + MONTH_TO_INDEX[month];
  if (Number.isNaN(start)) throw new Error(`unparsable dates "${dates}" — expected "Mon YYYY – Mon YYYY"`);
  return start;
};

const toTable = (headers, rows) =>
  [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");

const buildEmployment = () => {
  const companies = (DATA.experience || []).filter(inProfile).map((company) => ({
    ...company,
    roles: (company.roles || []).filter(inProfile),
    bullets: (company.bullets || []).filter(inProfile),
  }));

  const rows = companies
    .flatMap((company) =>
      company.roles.map((role) => ({
        dates: role.dates,
        cells: [
          role.dates,
          company.company,
          role.title,
          company.industry,
          role.location,
          `[${getLinkLabel(company.website)}](${company.website})`,
        ],
      })),
    )
    .sort((a, b) => getStart(b.dates) - getStart(a.dates));

  const sections = companies
    .sort(
      (a, b) =>
        Math.max(...b.roles.map((role) => getStart(role.dates))) -
        Math.max(...a.roles.map((role) => getStart(role.dates))),
    )
    .map((company) => {
      const blurb =
        typeof company.blurb === "string" ? { text: company.blurb } : company.blurb;
      return [
        `### ${company.company}`,
        toTable(
          ["Timeline", "Role", "Location"],
          company.roles.map((role) => [role.dates, role.title, role.location]),
        ),
        ...(blurb?.text && inProfile(blurb) ? [`> ${withPeriod(clean(blurb.text))}`] : []),
        company.bullets.map((item) => `- ${clean(item.text)}`).join("\n"),
      ].join("\n\n");
    });

  return [
    "## Employment",
    toTable(
      ["Timeline", "Company", "Role", "Industry", "Location", "Link"],
      rows.map((row) => row.cells),
    ),
    ...sections,
  ].join("\n\n");
};

const buildEducation = () => {
  const entries = (DATA.education || []).filter(inProfile);

  const sections = entries.map((entry) => {
    const details = (entry.details || []).filter(inProfile);
    return [
      `### ${entry.school}`,
      [
        `- **Program:** ${entry.program}`,
        `- **Degree:** ${entry.level}`,
        `- **Timeline:** ${entry.dates}`,
        ...details.map((item) => `  - ${clean(item.text)}`),
      ].join("\n"),
    ].join("\n\n");
  });

  return [
    "## Education",
    toTable(
      ["Timeline", "Institution", "Program", "Degree"],
      entries.map((entry) => [entry.dates, entry.school, entry.program, entry.level]),
    ),
    ...sections,
  ].join("\n\n");
};

const replaceBlock = (source, name, body) => {
  const start = `<!-- generated:${name}:start -->`;
  const end = `<!-- generated:${name}:end -->`;
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  if (from === -1 || to === -1)
    throw new Error(`missing ${start} / ${end} markers in ${relative(ROOT, PROFILE_FILE)}`);
  return `${source.slice(0, from + start.length)}\n\n${body}\n\n${source.slice(to)}`;
};

const current = readFileSync(PROFILE_FILE, "utf8");
let next = replaceBlock(current, "employment", buildEmployment());
next = replaceBlock(next, "education", buildEducation());

if (next === current) {
  console.log(`unchanged ${relative(ROOT, PROFILE_FILE)}`);
} else {
  writeFileSync(PROFILE_FILE, next);
  console.log(`built ${relative(ROOT, PROFILE_FILE)}`);
}
