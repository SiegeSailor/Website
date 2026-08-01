import { join } from "path";
import { readFileSync, existsSync } from "fs";
import { load } from "js-yaml";

// The website's half of the file-consumers structure in source/content/resume/: every
// file declares which documents read it, so a route asks for its own consumer
// name and gets only what it is entitled to. See
// source/tooling/scripts/load-content.mjs, the deliberate twin of this module — the
// tooling workspace is pinned to js-yaml and docx to keep its Docker image
// small, so it cannot be imported here, and the two are kept in step by hand.
//
// require.context (not a static import list) is what makes this dynamic: it
// hands webpack the whole directory, so adding a YAML file needs no code change
// and the dev server still hot-reloads edits. The `asset/source` rule in
// next.config.mjs makes each module the file's raw text.
//
// SERVER ONLY. require.context inlines every file in the directory, so importing
// this from a client component would ship contact.yaml — a phone number and a
// postal area — plus every archived node into the browser bundle.
declare const require: {
  context: (
    path: string,
    recursive: boolean,
    pattern: RegExp,
  ) => { keys(): string[]; (id: string): string };
};

const context = require.context("@content/resume", false, /\.ya?ml$/);

const META_KEYS = new Set(["consumers", "heading"]);
const MILLISECOND_ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

type TNode = Record<string, unknown>;

const isNode = (value: unknown): value is TNode =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

// A node opts out only by declaring `consumers` that omit this consumer;
// anything silent inherits the file's declaration.
const isArchived = (value: unknown, consumer: string) =>
  isNode(value) &&
  Array.isArray(value.consumers) &&
  !value.consumers.includes(consumer);

const prune = (value: unknown, consumer: string): unknown => {
  if (Array.isArray(value))
    return value
      .filter((item) => !isArchived(item, consumer))
      .map((item) => prune(item, consumer));
  if (!isNode(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key, nested]) => key !== "consumers" && !isArchived(nested, consumer),
      )
      .map(([key, nested]) => [key, prune(nested, consumer)]),
  );
};

// Every file must name its consumers and hold exactly one content key, so a
// silent typo becomes a build failure instead of a section that vanishes.
function loadContent(consumer: string) {
  const data: Record<string, unknown> = {};
  const headings: Record<string, string> = {};
  const origin: Record<string, string> = {};

  for (const file of context.keys().sort()) {
    const document = (load(context(file)) ?? {}) as TNode;
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

    const [key] = keys;
    if (origin[key])
      throw new Error(
        `source/content/resume/ declares \`${key}\` in both ${origin[key]} and ${file}; a key must live in exactly one file`,
      );
    origin[key] = file;

    if (!document.consumers.includes(consumer)) continue;
    data[key] = prune(document[key], consumer);
    if (typeof document.heading === "string") headings[key] = document.heading;
  }

  return { data, headings };
}

export type TMedia = { key: string; label: string; href: string };
export type TIdentity = { legal: string; display: string };
export type TSite = {
  domain: string;
  title: string;
  description: string;
  image: string;
  license: { label: string; href: string };
};
export type TRouteTitle = { path: string; title: string };
export type TProfile = {
  picture: string;
  headlines: string[];
  status: { location: string; position: string };
  tagline: string;
  intro: string;
};
export type TCompany = {
  company: string;
  location?: string;
  industry?: string;
  website?: string;
  blurb?: { text: string };
  roles?: { title: string; dates: string; location?: string }[];
};
export type TProject = {
  title: string;
  description: string;
  href: string;
  stage: "Planning" | "Development" | "Production";
  version?: string;
};

const REGEX_GITHUB_REPO = /^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/;

function readVersions(): Record<string, string> {
  const file = join(
    process.cwd(),
    "..",
    "content/resume/versions.generated.json",
  );
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

// Total experience is source/content/resume/timeline.yaml applied to today, never
// a stated figure. source/tooling/scripts/build-profile.mjs computes the same thing from
// the same content.
function getExperienceYears(timeline: {
  start: string;
  excluded?: { start: string; end: string }[];
}): string {
  const total = new Date().getTime() - new Date(timeline.start).getTime();
  const skipped = (timeline.excluded || []).reduce(
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

// Site-wide chrome and metadata: the header, footer, and every route's <head>.
export async function getSite() {
  const { data } = loadContent("site");
  const routes = data.routes as TRouteTitle[];
  return {
    identity: data.identity as TIdentity,
    site: data.site as TSite,
    media: data.media as TMedia[],
    routes,
    titleOf: (path: string) =>
      routes.find((route) => route.path === path)?.title ?? "",
  };
}

// The home page hero: the current position, the company behind it, and the intro.
export async function getHome() {
  const { data } = loadContent("/");
  const experience = (data.experience || []) as TCompany[];
  return {
    profile: data.profile as TProfile,
    company: experience[0],
  };
}

export async function getAbout() {
  const { data, headings } = loadContent("/about");
  const versions = readVersions();
  const projects = ((data.projects || []) as TProject[]).map((project) => {
    const key = repoKey(project.href);
    return { ...project, version: key ? versions[key] : undefined };
  });

  return {
    profile: data.profile as TProfile,
    summary: ((data.summary || []) as { text: string }[])[0]?.text ?? "",
    projects,
    media: data.media as TMedia[],
    experienceYears: getExperienceYears(
      data.timeline as {
        start: string;
        excluded?: { start: string; end: string }[];
      },
    ),
    headings,
  };
}
