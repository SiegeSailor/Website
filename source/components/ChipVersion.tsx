"use client";

import { useEffect, useState } from "react";

const REGEX_GITHUB_REPO = /^https?:\/\/github\.com\/([^/]+\/[^/#?]+)/;

// Fetched in the visitor's browser because the site is a static export: a
// version baked in at build time goes stale the moment the project releases.
// The stage shows until the fetch lands, and stays when it fails.
async function fetchVersion(repository: string): Promise<string | null> {
  const api = `https://api.github.com/repos/${repository}`;
  const release = await fetch(`${api}/releases/latest`);
  if (release.ok) return (await release.json()).tag_name ?? null;

  const tags = await fetch(`${api}/tags?per_page=1`);
  if (tags.ok) return (await tags.json())[0]?.name ?? null;

  return null;
}

export default function ({
  href,
  stage,
}: Readonly<{ href: string; stage: string }>) {
  const [version, setVersion] = useState<string | null>(null);
  const repository = href.match(REGEX_GITHUB_REPO)?.[1];

  useEffect(() => {
    if (!repository) return;
    fetchVersion(repository)
      .then(setVersion)
      .catch(() => {});
  }, [repository]);

  return (
    <span
      className={`font-mono text-tiny shrink-0 border border-default-200 rounded-full px-2 py-0.5 ${
        version ? "text-primary" : "text-default-500"
      }`}
    >
      {version ?? stage.toLowerCase()}
    </span>
  );
}
