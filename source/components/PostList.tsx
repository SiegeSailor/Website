"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Route } from "next";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import type { TFacet } from "@/helpers/article";

export type TPost = Readonly<{
  date: string;
  title: string;
  minutes: number;
  description: string;
  category: string;
  technologies: readonly string[];
  route: Route;
  isDraft: boolean;
}>;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const TECHNOLOGIES_SHOWN = 10;

const monthDay = (date: string) => {
  const [, month, day] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${day}`;
};

// Most used first, ties alphabetical.
const tally = (lists: readonly (readonly string[])[]) => {
  const counts = new Map<string, number>();
  for (const list of lists)
    for (const value of list) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort(
    ([left, m], [right, n]) => n - m || left.localeCompare(right),
  );
};

const toPhrase = (value: string) =>
  new RegExp(
    `(^|\\s)${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=\\s|$)`,
    "gi",
  );

const squash = (text: string) => text.replace(/\s+/g, " ").trim();

// A category or technology typed as a whole phrase selects its chip, longest
// first so "Tailwind CSS" wins over "CSS"; whatever is left filters as text.
function parseQuery(query: string, values: readonly string[]) {
  let rest = query;
  const named = new Set<string>();
  for (const value of [...values].sort((a, b) => b.length - a.length)) {
    if (rest.search(toPhrase(value)) === -1) continue;
    named.add(value);
    rest = rest.replace(toPhrase(value), " ");
  }
  return { named, rest: squash(rest).toLowerCase() };
}

function Chip({
  label,
  count,
  isSelected,
  onPress,
}: Readonly<{
  label: string;
  count: number;
  isSelected: boolean;
  onPress: () => void;
}>) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onPress}
      className={
        isSelected
          ? "inline-flex items-baseline gap-1.5 rounded-full border border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900 px-2.5 py-0.5 text-small text-primary transition-colors"
          : "inline-flex items-baseline gap-1.5 rounded-full border border-default-200 px-2.5 py-0.5 text-small transition-colors hover:border-default-400"
      }
    >
      {label}
      <span className="font-mono text-[0.65rem] opacity-70">{count}</span>
    </button>
  );
}

// `useSearchParams` cannot prerender, so only this empty listener waits for the
// browser while the list around it stays in the static HTML.
function SearchListener({
  onChange,
}: Readonly<{ onChange: (search: string) => void }>) {
  const search = useSearchParams().toString();
  useEffect(() => onChange(search), [search, onChange]);
  return null;
}

export default function PostList({ posts }: Readonly<{ posts: TPost[] }>) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Record<TFacet, ReadonlySet<string>>>({
    category: new Set(),
    tech: new Set(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const facets = useMemo(
    () => ({
      category: tally(posts.map((post) => [post.category])),
      tech: tally(posts.map((post) => post.technologies)),
    }),
    [posts],
  );

  const { named, rest } = useMemo(
    () =>
      parseQuery(
        query,
        [...facets.category, ...facets.tech].map(([value]) => value),
      ),
    [query, facets],
  );

  const selected = useMemo(() => {
    const pick = (facet: TFacet) =>
      new Set(
        facets[facet]
          .map(([value]) => value)
          .filter((value) => picked[facet].has(value) || named.has(value)),
      );
    return { category: pick("category"), tech: pick("tech") };
  }, [facets, picked, named]);

  const filtered = useMemo(
    () =>
      posts.filter(
        (post) =>
          (!selected.category.size || selected.category.has(post.category)) &&
          (!selected.tech.size ||
            post.technologies.some((item) => selected.tech.has(item))) &&
          (!rest ||
            [
              post.title,
              post.description,
              post.category,
              post.technologies.join(" "),
            ]
              .join(" ")
              .toLowerCase()
              .includes(rest)),
      ),
    [posts, selected, rest],
  );

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

  // Searches written below that Next.js has not echoed back yet; an echo is
  // skipped so it cannot overwrite what the reader typed since.
  const writes = useRef<string[]>([]);

  const load = useCallback((search: string) => {
    const index = writes.current.indexOf(search);
    if (index !== -1) {
      writes.current = writes.current.slice(index + 1);
      return;
    }
    const params = new URLSearchParams(search);
    const list = (facet: TFacet) =>
      new Set(params.get(facet)?.split(",").filter(Boolean));
    setQuery(params.get("q") ?? "");
    setPicked({ category: list("category"), tech: list("tech") });
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    for (const facet of ["category", "tech"] as const)
      if (picked[facet].size) params.set(facet, [...picked[facet]].join(","));
    const search = params.toString();
    if (search === new URLSearchParams(window.location.search).toString())
      return;
    writes.current.push(search);
    // A `null` state lets Next.js adopt the URL, so its own links still
    // navigate away from it.
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search ? `?${search.replaceAll("%2C", ",")}` : ""}`,
    );
  }, [isLoaded, query, picked]);

  const toggle = (facet: TFacet, value: string) => {
    const isNamed = named.has(value);
    if (isNamed)
      setQuery((current) => squash(current.replace(toPhrase(value), " ")));
    setPicked((current) => {
      const next = new Set(current[facet]);
      if (isNamed || next.has(value)) next.delete(value);
      else next.add(value);
      return { ...current, [facet]: next };
    });
  };

  const reset = () => {
    setQuery("");
    setPicked({ category: new Set(), tech: new Set() });
  };

  const isFiltering =
    rest.length > 0 || selected.category.size > 0 || selected.tech.size > 0;
  const hidden = facets.tech.length - TECHNOLOGIES_SHOWN;

  return (
    <div>
      <Suspense fallback={null}>
        <SearchListener onChange={load} />
      </Suspense>

      <div className="flex items-center gap-2 border-b border-default-200 pb-2 mb-4 transition-colors focus-within:border-primary">
        <SearchIcon size="0.95rem" className="text-default-500 shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter posts by title, topic, or technologies…"
          aria-label="Filter posts"
          className="w-full bg-transparent outline-none text-small placeholder:text-default-500"
        />
      </div>

      {(["category", "tech"] as const).map((facet) => (
        <div
          key={facet}
          role="group"
          aria-labelledby={`facet-${facet}`}
          className="mt-3 grid sm:grid-cols-[6.5rem_1fr] gap-2 sm:gap-3 items-start"
        >
          <span
            id={`facet-${facet}`}
            className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-default-500 sm:pt-1.5"
          >
            {facet === "category" ? "Category" : "Technology"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {facets[facet]
              .filter(
                ([value], index) =>
                  facet === "category" ||
                  isExpanded ||
                  index < TECHNOLOGIES_SHOWN ||
                  selected.tech.has(value),
              )
              .map(([value, count]) => (
                <Chip
                  key={value}
                  label={value}
                  count={count}
                  isSelected={selected[facet].has(value)}
                  onPress={() => toggle(facet, value)}
                />
              ))}
            {facet === "tech" && hidden > 0 && (
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded((current) => !current)}
                className="rounded-full border border-dashed border-default-300 px-2.5 py-0.5 text-small text-default-500 transition-colors hover:text-foreground"
              >
                {isExpanded ? "Show fewer" : `+${hidden} more`}
              </button>
            )}
          </div>
        </div>
      ))}

      <p className="mt-4 flex items-baseline gap-3 font-mono text-tiny text-default-500">
        {isFiltering
          ? `${filtered.length} of ${posts.length} posts`
          : `${posts.length} posts`}
        {isFiltering && (
          <button
            type="button"
            onClick={reset}
            className="text-primary underline underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </p>

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
                <span className="font-mono text-tiny tabular-nums text-default-500 w-14 shrink-0 group-hover:underline">
                  {monthDay(post.date)}
                </span>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="flex-1 text-medium font-medium leading-snug tracking-tight underline-offset-4 decoration-1 group-hover:underline">
                    {post.title}
                  </p>
                  <p className="mt-1 sm:pl-pl18 text-small text-default-500 leading-normal line-clamp-2 group-hover:underline">
                    {post.description}
                  </p>
                  <p className="mt-1 sm:pl-pl18 font-mono text-[0.65rem] uppercase tracking-wider text-default-500 group-hover:underline">
                    {post.isDraft && "Draft · "}
                    {post.category}
                  </p>
                </div>
                <span className="font-mono text-tiny text-default-500 shrink-0 group-hover:underline">
                  {post.minutes} min
                </span>
              </div>
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
