import { join } from "path";
import { readFileSync, existsSync } from "fs";
import { load } from "js-yaml";

import resumeYaml from "@/files/resume/Resume.yaml";

// Single source of truth for the website's profile/about data and the résumé
// variants. Only nodes belonging to the `profile` variant (or untagged) are
// exposed here; the PDF résumé keeps its own professional / academic variants
// (build-resume.mjs). Project versions come from versions.generated.json,
// written by scripts/build-versions.mjs at build time (optional / resilient).

type TVariant = { variants?: string[] };
const inProfile = (item?: TVariant) =>
  !item?.variants || item.variants.includes("profile");

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
type TSchool = {
  school: string;
  degree: string;
  program?: string;
  level?: string;
  dates: string;
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
  education?: TSchool[];
  certifications?: TSchool[];
  projects?: TProject[];
};

export type TResume = Awaited<ReturnType<typeof getResume>>;

const toSchools = (list?: TSchool[]) =>
  (list || [])
    .filter(inProfile)
    .map(({ school, degree, program, level, dates }) => ({
      school,
      degree,
      program,
      level,
      dates,
    }));

function readVersions(): Record<string, string> {
  const file = join(process.cwd(), "files/resume/versions.generated.json");
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
  const data = (load(resumeYaml) ?? {}) as TResumeData;
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
    .filter(inProfile)
    .map((company) => ({
      company: company.company,
      location: company.location,
      industry: company.industry,
      website: company.website,
      blurb:
        typeof company.blurb === "string" ? company.blurb : company.blurb?.text,
      roles: (company.roles || []).filter(inProfile).map((role) => ({
        title: role.title,
        dates: role.dates,
        location: role.location,
      })),
    }));

  const projects = (data.projects || [])
    .filter(inProfile)
    .map(({ title, description, href, stage }) => {
      const key = repoKey(href);
      return {
        title,
        description,
        href,
        stage,
        version: key ? versions[key] : undefined,
      };
    });

  return {
    profile,
    summary: data.summary?.professional ?? "",
    experience,
    education: toSchools(data.education),
    certifications: toSchools(data.certifications),
    projects,
  };
}
