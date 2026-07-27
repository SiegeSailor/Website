import { type Metadata } from "next";

import { ROUTES } from "@/settings/constant";
import { MEDIA_TO_ICON } from "@/settings/icons";
import { createPageTitle } from "@/helpers/utility";
import { getAbout, getSite } from "@/helpers/server/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site, titleOf } = await getSite();
  return { title: createPageTitle(site.title, titleOf(ROUTES.about)) };
}

const STAGE_ORDER = { Production: 0, Development: 1, Planning: 2 } as const;

function Eyebrow({ children }: Readonly<{ children: string }>) {
  return (
    <h2 className="font-mono text-tiny uppercase tracking-[0.15em] text-default-500 mb-3">
      {children}
    </h2>
  );
}

export default async function () {
  const [
    { profile, summary, projects, media, experienceYears, headings },
    { identity },
  ] = await Promise.all([getAbout(), getSite()]);

  const lead = profile.intro.split("\n\n")[0];
  const shown = projects
    .filter((project) => project.stage !== "Planning")
    .sort((left, right) => STAGE_ORDER[left.stage] - STAGE_ORDER[right.stage]);

  return (
    <div className="py-2">
      <div className="flex items-center gap-5 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.picture}
          alt={identity.display}
          className="w-20 h-20 rounded-full object-cover shadow-none grayscale shrink-0"
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {identity.display}
          </h1>
          <p className="font-mono text-default-500 mt-1">
            {profile.headlines.join(" · ")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-tiny text-default-500 mb-7">
        <span>{profile.status.location}</span>
        <span className="text-default-300">·</span>
        <span>{profile.status.position}</span>
        <span className="text-default-300">·</span>
        <span>{experienceYears} experience</span>
      </div>

      <p className="mb-9 leading-relaxed">{lead}</p>

      {summary && (
        <section className="mb-9">
          <Eyebrow>{headings.summary}</Eyebrow>
          <p className="leading-relaxed text-foreground">{summary}</p>
        </section>
      )}

      {shown.length > 0 && (
        <section className="mb-9">
          <Eyebrow>{headings.projects}</Eyebrow>
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
                  {project.version ?? project.stage.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-6 border-t border-default-200 text-small">
        {media.map((entry) => {
          const Icon = MEDIA_TO_ICON[entry.key];
          return (
            <a
              key={entry.key}
              href={entry.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              {Icon ? <Icon size="1rem" /> : null} {entry.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
