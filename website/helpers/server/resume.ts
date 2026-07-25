import { join } from "path";
import { readFileSync, existsSync } from "fs";
import { load } from "js-yaml";

import experienceYaml from "@content/experience.yaml";
import profileYaml from "@content/profile.yaml";
import projectsYaml from "@content/projects.yaml";
import summaryYaml from "@content/summary.yaml";

// Website view of content/: only the four files holding the keys used here. Nodes
// tagged with a resume variant are resume-only, so only untagged nodes surface.
// Imported as raw text (webpack `asset/source`) so the dev server hot-reloads.
// Project versions come from versions.generated.json (optional / resilient).
const CONTENT = [profileYaml, summaryYaml, experienceYaml, projectsYaml];

type TVariant = { variants?: string[] };
const isShared = (item?: TVariant) => !item?.variants;

const REGEX_GITHUB_REPO = /^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/;
const MILLISECOND_ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const TIMELINE = {
  start: "2016-06-01",
  intervals: [
    { start: "2017-01-01", end: "2017-06-30" }, // Military Service
    { start: "2022-02-01", end: "2024-01-31" }, // Career Gap
  ],
} as const;

function getExperienceYears(): string {
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

type TRole = { title: string; dates: string; location?: string } & TVariant;
type TCompany = {
  company: string;
  location?: string;
  industry?: string;
  website?: string;
  blurb?: string | ({ text: string } & TVariant);
  roles?: TRole[];
} & TVariant;
type TProject = {
  title: string;
  description: string;
  href: string;
  stage: "Planning" | "Development" | "Production";
} & TVariant;
type TProfile = {
  picture: string;
  headlines: string[];
  media: { github: string; linkedin: string; resume: string };
  status: { location: string; position: string };
  tagline: string;
  intro: string;
};

type TResumeData = {
  profile: TProfile;
  summary?: Record<string, string>;
  experience?: TCompany[];
  projects?: TProject[];
};

export type TResume = Awaited<ReturnType<typeof getResume>>;

function readVersions(): Record<string, string> {
  const file = join(process.cwd(), "..", "content/versions.generated.json");
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

const repoKey = (href: string): string | null => {
  const match = href.match(REGEX_GITHUB_REPO);
  return match ? `${match[1]}/${match[2].replace(/\.git$/, "")}` : null;
};

export async function getResume() {
  const data = Object.assign(
    {},
    ...CONTENT.map((document) => load(document) ?? {}),
  ) as TResumeData;
  const versions = readVersions();

  const profile = {
    picture: data.profile.picture,
    headlines: data.profile.headlines,
    media: data.profile.media,
    status: { ...data.profile.status, experience: getExperienceYears() },
    tagline: data.profile.tagline,
    intro: data.profile.intro.trim(),
  };

  const experience = (data.experience || [])
    .filter(isShared)
    .map((company) => ({
      company: company.company,
      location: company.location,
      industry: company.industry,
      website: company.website,
      blurb:
        typeof company.blurb === "string" ? company.blurb : company.blurb?.text,
      roles: (company.roles || []).filter(isShared).map((role) => ({
        title: role.title,
        dates: role.dates,
        location: role.location,
      })),
    }));

  const projects = (data.projects || []).map(
    ({ title, description, href, stage }) => {
      const key = repoKey(href);
      return {
        title,
        description,
        href,
        stage,
        version: key ? versions[key] : undefined,
      };
    },
  );

  return {
    profile,
    summary: data.summary?.professional ?? "",
    experience,
    projects,
  };
}
