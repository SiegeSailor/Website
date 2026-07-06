import NextLink from "next/link";
import { GithubIcon, LinkedinIcon } from "lucide-react";

import { AUTHOR } from "@/settings/constant";
import { getResume } from "@/helpers/server/resume";
import IconTheme from "./IconTheme";

export default async function () {
  const { profile } = await getResume();

  return (
    <header className="flex items-baseline gap-4 py-5 border-b border-default-200 mb-10">
      <NextLink
        href="/"
        className="text-large font-semibold tracking-tight hover:text-primary transition-colors"
      >
        {AUTHOR}
      </NextLink>
      <nav className="ml-auto flex items-center gap-4 text-small text-default-500">
        <NextLink href="/about" className="hover:text-foreground transition-colors">
          About
        </NextLink>
        <a
          href={profile.media.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="hover:text-foreground transition-colors"
        >
          <GithubIcon size="1.05rem" />
        </a>
        <a
          href={profile.media.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="hover:text-foreground transition-colors"
        >
          <LinkedinIcon size="1.05rem" />
        </a>
        <IconTheme />
      </nav>
    </header>
  );
}
