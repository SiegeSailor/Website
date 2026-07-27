import NextLink from "next/link";

import { ROUTES } from "@/settings/constant";
import { MEDIA_TO_ICON } from "@/settings/icons";
import { getSite } from "@/helpers/server/content";
import IconTheme from "./IconTheme";

// The header links out through the same media.yaml entries as /about and the
// profile README, minus the résumé download — a header is for navigation.
const NAVIGABLE = new Set(["github", "linkedin"]);

export default async function () {
  const { identity, media, titleOf } = await getSite();

  return (
    <header className="flex items-baseline gap-4 py-5 border-b border-default-200 mb-10">
      <NextLink
        href={ROUTES.home}
        className="text-large font-semibold tracking-tight hover:text-primary transition-colors"
      >
        {identity.display}
      </NextLink>
      <nav className="ml-auto flex items-center gap-4 text-small text-default-500">
        <NextLink
          href={ROUTES.about}
          className="hover:text-foreground transition-colors"
        >
          {titleOf(ROUTES.about)}
        </NextLink>
        {media
          .filter((entry) => NAVIGABLE.has(entry.key))
          .map((entry) => {
            const Icon = MEDIA_TO_ICON[entry.key];
            if (!Icon) return null;
            return (
              <a
                key={entry.key}
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                aria-label={entry.label}
                className="hover:text-foreground transition-colors"
              >
                <Icon size="1.05rem" />
              </a>
            );
          })}
        <IconTheme />
      </nav>
    </header>
  );
}
