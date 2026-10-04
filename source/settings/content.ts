// Everything the site renders that is not an article. Authored here as plain
// constants: the YAML content directory and its consumer tagging are gone, so a
// value appears on a page because a page reads it, not because a tag routed it.
//
// Contact details are deliberately absent. The phone number and postal area
// belong to the résumé document only and must never reach a public page.
//
// Mirrors profile/ at SiegeSailor/SiegeSailor@426043f (2026-10-03).

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
export type TCompany = { company: string; website?: string };
export type TProject = {
  title: string;
  description: string;
  href: string;
  stage: "Planning" | "Development" | "Production";
};

const IDENTITY: TIdentity = {
  legal: "Jin Yu Zhang",
  display: "Jin Yu Zhang",
};

const SITE: TSite = {
  domain: "jinyu-zhang.com",
  title: "Jin Yu Zhang's Website",
  description:
    "Jin Yu Zhang's personal website, showcasing my profile, projects, blog, and notes.",
  image: "/images/Jin-Yu-Zhang-Profile.jpg",
  license: {
    label: "CC BY 4.0",
    href: "https://creativecommons.org/licenses/by/4.0/",
  },
};

// Each `key` picks an icon in settings/icons.ts; a new entry needs one there
// before the site will render it.
const MEDIA: TMedia[] = [
  { key: "github", label: "GitHub", href: "https://github.com/SiegeSailor" },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jin-yu-zhang-812181155/",
  },
];

// "/blog" is a route prefix for article pages, not a page of its own; it carries
// a title so the article header can name the section.
const ROUTE_TITLES: TRouteTitle[] = [
  { path: "/", title: "Home" },
  { path: "/blog", title: "Blog" },
  { path: "/about", title: "About" },
];

const PROFILE: TProfile = {
  picture: "/images/Jin-Yu-Zhang.jpg",
  headlines: ["Distributed Systems", "Cloud & DevOps", "Observability"],
  status: {
    location: "NYC Metropolitan Area",
    position: "Senior Software Engineer",
  },
  tagline:
    "Distributed systems, observability, and CI/CD, from 10,000+ RPS consumer scale to FDA-regulated devices.",
  intro:
    "I build systems that have to keep running: real-time services at 10,000+ peak RPS, medical devices at clinical sites with no internet, and the pipelines, load tests, and observability behind them. I write up what I learn along the way.",
};

// The home page hero links the current employer.
const COMPANY: TCompany = {
  company: "CooperSurgical",
  website: "https://www.coopersurgical.com/",
};

const SUMMARY =
  "Senior software engineer building distributed systems from consumer scale to regulated medical devices. At Shopee, built real-time multiplayer game services sustaining 10,000+ peak RPS and 200,000+ daily players, with scheduled Locust load testing, and let 5 international teams redeploy on GCP without hard-coded configurations. At CooperSurgical, cut RFID data-transition time by 90% with caching and gRPC streaming, designed device observability from Envoy traffic logs and spans to error traces, and led a team of 5.";

// Planning projects stay hidden until they advance; /about filters on `stage`.
const PROJECTS: TProject[] = [
  {
    title: "Jin Yu Zhang's Website",
    stage: "Production",
    href: "https://github.com/SiegeSailor/Website",
    description:
      "This site — a statically exported *Next.js* application served from *AWS S3* behind *CloudFront*, with markdown-driven posts, in-site search, and a single-source résumé build system. Built with *TailwindCSS*, *HeroUI*, the *UnifiedJS* ecosystem, *Mermaid*, and *Zustand*.",
  },
  {
    title: "Terminal Sigma",
    stage: "Production",
    href: "https://github.com/SiegeSailor/Terminal-Sigma",
    description:
      "Available on `npm` and as a desktop app, a *TypeScript* terminal dashboard that gives game-style feedback on self-development: a pixel-art character levels up alongside a Pomodoro timer, diet and workout trackers, and everyday quotes, in English and Traditional Chinese. Built with *React*, *Ink*, *Zod*, *Electron*, and *xterm.js*.",
  },
  {
    title: "Smarty Notebook Collection",
    stage: "Production",
    href: "https://github.com/SiegeSailor/Smarty-Notebook-Collection",
    description:
      "A collection of self-contained *Jupyter* notebooks that run batch requests against the **Smarty** Cloud API, such as fetching U.S. ZIP+4 codes by address. Built with *Python*, *pandas*, *Requests*, and *Poetry*.",
  },
  {
    title: "Cryptography CLI",
    stage: "Development",
    href: "https://github.com/SiegeSailor/Cryptography",
    description:
      "Available on `npm`, a *TypeScript* package with *WebAssembly* enabled that provides a collection of cryptography functions and a command-line tool with interactive prompts to demonstrate key encryption flows and algorithms.",
  },
  {
    title: "Self-Development Assistant",
    stage: "Planning",
    href: "https://github.com/SiegeSailor",
    description:
      "An *iOS* application built with *Godot* that comes with often-used self-development and assistance features, such as the tomato timer, diet tracking, goals-oriented schedules, and everyday-motivating quotes, to help users build confidence and assertiveness.",
  },
  {
    title: "AI-Driven Development Tools Integration",
    stage: "Planning",
    href: "https://github.com/SiegeSailor",
    description:
      "*macOS*-specific desktop integration of AI-driven development tools for automating workflows with *MCPs* and *Agents*, including onboarding environment setup, credential management, **Slack** and **GitLab** integration, image, icon, and sprite sheet generation, and **Gmail** and *Webhooks* triggers.",
  },
  {
    title: "Concurrency Toolkit",
    stage: "Planning",
    href: "https://github.com/SiegeSailor",
    description:
      "Available on `pip`, a *Python* concurrent class wrapper for managing multiple tasks with error handling and logging. Based on `asyncio`. This is a go-to solution for simplified asynchronous programming with easy-to-use abstractions.",
  },
  {
    title: "Account Management CBWMs",
    stage: "Planning",
    href: "https://github.com/SiegeSailor/OpenSource.AccountHub",
    description:
      "Scalable *OWASP*-Complied Cloud-Based Microservice that allows users to manage their accounts and settings. It provides an event-driven architecture comes with a eventual consistency model and various communication protocols for different use cases and CBWMs.",
  },
  {
    title: "Configurable Bucket CBWM Boilerplate",
    stage: "Planning",
    href: "https://github.com/SiegeSailor/OpenSource.Bucket",
    description:
      "A project boilerplate that provides a *RESTful* interface for *AWS S3* using *Flask*. Following the microservices principle, this project has been wrapped with *Docker*, *LocalStack*, and *Terraform* to isolate the running/deploying environments with a fully configurable layer that supports development on local laptops, testing in *GitHub Actions* CI/CD pipelines, and deployment to *AWS*.",
  },
  {
    title: "Deployable UI Library Boilerplate",
    stage: "Planning",
    href: "https://github.com/SiegeSailor",
    description:
      "Quick start for deploying *React* components on `npm`. A project boilerplate that provides a set of team-oriented development tools, such as *GitLab CI/CD*, *Semantic Release*, *TypeScript*, *Jest*, *ESLint*, *Stylelint*, and *Ladle*, and best practices.",
  },
  {
    title: "TypeScript Markdown Files Converter",
    stage: "Planning",
    href: "https://github.com/SiegeSailor",
    description:
      "A *TypeScript* NPM package for parsing markdown files to readable HTML files using *Remark* and parsing folders/files to parsable data structures.",
  },
  {
    title: "AI Story Writer",
    stage: "Planning",
    href: "https://github.com/SiegeSailor",
    description:
      "A local AI-powered storytelling engine that helps users build interconnected fantasy universes. The system automatically categorizes the inputs, such as races and weapons, and keeps track of them. Built with *Python*, *SQLite*, *Ollama*, *Mistral 7B*, and *Streamlit*.",
  },
];

const HEADINGS = {
  summary: "Summary",
  projects: "Projects",
  media: "Links",
} as const;

// Total professional experience is computed against today, never stated, so it
// cannot go stale. Excluded intervals are subtracted.
const TIMELINE = {
  start: "2016-06-01",
  excluded: [
    { label: "Military Service", start: "2017-01-01", end: "2017-06-30" },
    { label: "Career Gap", start: "2022-06-01", end: "2024-01-31" },
  ],
};

const MILLISECOND_ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

function getExperienceYears(): string {
  const total = Date.now() - new Date(TIMELINE.start).getTime();
  const skipped = TIMELINE.excluded.reduce(
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
  return {
    identity: IDENTITY,
    site: SITE,
    media: MEDIA,
    routes: ROUTE_TITLES,
    titleOf: (path: string) =>
      ROUTE_TITLES.find((route) => route.path === path)?.title ?? "",
  };
}

export async function getHome() {
  return { profile: PROFILE, company: COMPANY };
}

export async function getAbout() {
  return {
    profile: PROFILE,
    summary: SUMMARY,
    projects: PROJECTS,
    media: MEDIA,
    experienceYears: getExperienceYears(),
    headings: HEADINGS,
  };
}
