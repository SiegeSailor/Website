"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import NextLink from "next/link";
import { SearchIcon } from "lucide-react";

export type TPost = Readonly<{
  date: string;
  title: string;
  minutes: number;
  description: string;
  category: string;
  technologies: readonly string[];
  route: Route;
}>;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const monthDay = (date: string) => {
  const [, month, day] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${day}`;
};

export default function PostList({ posts }: Readonly<{ posts: TPost[] }>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((post) =>
      [post.title, post.description, post.category, post.technologies.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query, posts]);

  const groups = useMemo(() => {
    const byYear = new Map<string, TPost[]>();
    for (const post of filtered) {
      const year = post.date.slice(0, 4);
      const bucket = byYear.get(year);
      if (bucket) bucket.push(post);
      else byYear.set(year, [post]);
    }
    return Array.from(byYear.entries());
  }, [filtered]);

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-default-200 pb-2 mb-4 transition-colors focus-within:border-primary">
        <SearchIcon size="0.95rem" className="text-default-500 shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter posts by title, topic, or tech…"
          aria-label="Filter posts"
          className="w-full bg-transparent outline-none text-small placeholder:text-default-500"
        />
      </div>

      {groups.map(([year, entries]) => (
        <section key={year}>
          <h2 className="font-mono text-tiny tracking-[0.2em] text-default-500 mt-8 mb-1">
            {year}
          </h2>
          {entries.map((post) => (
            <NextLink
              key={post.route}
              href={post.route}
              className="group block py-3 border-t border-default-200"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-tiny tabular-nums text-default-500 w-14 shrink-0">
                  {monthDay(post.date)}
                </span>
                <span className="flex-1 text-medium font-medium leading-snug tracking-tight underline-offset-4 decoration-1 group-hover:underline">
                  {post.title}
                </span>
                <span className="font-mono text-tiny text-default-500 shrink-0">
                  {post.minutes} min
                </span>
              </div>
              <p className="mt-1 sm:pl-[4.5rem] text-small text-default-500 leading-normal line-clamp-2">
                {post.description}
              </p>
              <p className="mt-1 sm:pl-[4.5rem] font-mono text-[0.65rem] uppercase tracking-wider text-default-500">
                {post.category}
              </p>
            </NextLink>
          ))}
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="font-mono text-small text-default-500 py-10">
          No posts match that filter.
        </p>
      )}
    </div>
  );
}
