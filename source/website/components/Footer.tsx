import { getSite } from "@/helpers/server/content";

// "RSS" labels a route of this site rather than an external profile, so it is not
// a media.yaml entry.
const NAVIGABLE = new Set(["github", "linkedin"]);

export default async function () {
  const { identity, site, media } = await getSite();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 py-6 border-t border-default-200 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-tiny text-default-500">
      <span>
        © {year} {identity.display}
      </span>
      <span className="flex items-center gap-2">
        {media
          .filter((entry) => NAVIGABLE.has(entry.key))
          .map((entry) => (
            <span key={entry.key} className="flex items-center gap-2">
              <a
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {entry.label}
              </a>
              ·
            </span>
          ))}
        <a href="/feed.xml" className="hover:text-foreground">
          RSS
        </a>
      </span>
      <a
        href={site.license.href}
        target="_blank"
        rel="noreferrer"
        className="ml-auto hover:text-foreground"
      >
        {site.license.label}
      </a>
    </footer>
  );
}
