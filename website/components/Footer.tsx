import { AUTHOR } from "@/settings/constant";
import { getResume } from "@/helpers/server/resume";

export default async function () {
  const { profile } = await getResume();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 py-6 border-t border-default-200 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-tiny text-default-500">
      <span>
        © {year} {AUTHOR}
      </span>
      <span className="flex items-center gap-2">
        <a
          href={profile.media.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </a>
        ·
        <a
          href={profile.media.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          LinkedIn
        </a>
        ·
        <a href="/feed.xml" className="hover:text-foreground">
          RSS
        </a>
      </span>
      <a
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
        rel="noreferrer"
        className="ml-auto hover:text-foreground"
      >
        CC BY 4.0
      </a>
    </footer>
  );
}
