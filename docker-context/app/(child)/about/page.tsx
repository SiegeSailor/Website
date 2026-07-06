import { type Metadata } from "next";
import { GithubIcon, LinkedinIcon, FileDownIcon } from "lucide-react";

import { AUTHOR, ROUTE_TO_TITLE } from "@/settings/constant";
import { createPageTitle } from "@/helpers/utility";
import { getResume } from "@/helpers/server/resume";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/about"]),
};

const STAGE_ORDER = { Production: 0, Development: 1, Planning: 2 } as const;

const versionLabel = (version: string) =>
  /^v/i.test(version) ? version : `v${version}`;

function Eyebrow({ children }: Readonly<{ children: string }>) {
  return (
    <h2 className="font-mono text-tiny uppercase tracking-[0.15em] text-default-500 mb-3">
      {children}
    </h2>
  );
}

export default async function () {
  const { profile, summary, projects } = await getResume();

  const lead = profile.bio.split("\n\n")[0];
  const shown = projects
    .filter((project) => project.stage !== "Planning")
    .sort((left, right) => STAGE_ORDER[left.stage] - STAGE_ORDER[right.stage]);

  return (
    <div className="py-2">
      <div className="flex items-center gap-5 mb-6">
        {/* Static export with unoptimized images: next/image adds no benefit. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.picture}
          alt={AUTHOR}
          className="w-20 h-20 rounded-full object-cover shadow-none grayscale shrink-0"
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{AUTHOR}</h1>
          <p className="font-mono text-tiny text-default-500 mt-1">
            {profile.headlines.join(" · ")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-tiny text-default-500 mb-7">
        <span>{profile.status.location}</span>
        <span className="text-default-300">·</span>
        <span>{profile.status.position}</span>
        <span className="text-default-300">·</span>
        <span>{profile.status.experience} experience</span>
      </div>

      <p className="mb-9 leading-relaxed">{lead}</p>

      {summary && (
        <section className="mb-9">
          <Eyebrow>Summary</Eyebrow>
          <p className="leading-relaxed text-foreground">{summary}</p>
        </section>
      )}

      {shown.length > 0 && (
        <section className="mb-9">
          <Eyebrow>Projects</Eyebrow>
          <div className="flex flex-col">
            {shown.map((project) => (
              <div
                key={project.title}
                className="flex items-baseline justify-between gap-4 py-3 border-t border-default-200 first:border-t-0 first:pt-0"
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline-offset-4 decoration-1 hover:underline"
                >
                  {project.title}
                </a>
                <span
                  className={`font-mono text-tiny shrink-0 border border-default-200 rounded-full px-2 py-0.5 ${
                    project.version ? "text-primary" : "text-default-500"
                  }`}
                >
                  {project.version
                    ? versionLabel(project.version)
                    : project.stage.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-6 border-t border-default-200 text-small">
        <a
          href={profile.media.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <GithubIcon size="1rem" /> GitHub
        </a>
        <a
          href={profile.media.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <LinkedinIcon size="1rem" /> LinkedIn
        </a>
        <a
          href={profile.media.resume}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <FileDownIcon size="1rem" /> Résumé (PDF)
        </a>
      </div>
    </div>
  );
}
