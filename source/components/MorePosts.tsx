import type { Route } from "next";
import Form from "next/form";
import NextLink from "next/link";
import { SearchIcon } from "lucide-react";

import { ROUTE_HOME } from "@/settings/constant";

type TRelated = Readonly<{ title: string; route: Route }>;

const CLASS_LABEL =
  "font-mono text-[0.65rem] uppercase tracking-[0.2em] text-default-500";

function List({ posts }: Readonly<{ posts: TRelated[] }>) {
  return (
    <ul className="flex flex-col gap-2 text-small">
      {posts.map((post) => (
        <li key={post.route}>
          <NextLink
            href={post.route}
            className="block leading-snug text-default-500 hover:text-foreground transition-colors"
          >
            {post.title}
          </NextLink>
        </li>
      ))}
    </ul>
  );
}

export default function ({
  category,
  posts,
}: Readonly<{ category: string; posts: TRelated[] }>) {
  return (
    <>
      <aside
        aria-label="More posts"
        className="hidden xl:flex flex-col gap-7 fixed top-28 right-[calc(50%+23rem)] w-52 max-h-[calc(100vh-9rem)] overflow-y-auto"
      >
        {posts.length > 0 && (
          <nav
            aria-label={`More in ${category}`}
            className="flex flex-col gap-3"
          >
            <span className={CLASS_LABEL}>More in {category}</span>
            <List posts={posts} />
          </nav>
        )}

        <NextLink
          href={ROUTE_HOME}
          className="font-mono text-tiny text-default-500 hover:text-foreground transition-colors"
        >
          All posts →
        </NextLink>
      </aside>

      {posts.length > 0 && (
        <nav
          aria-label={`More in ${category}`}
          className="xl:hidden mt-10 pt-6 border-t border-default-200 flex flex-col gap-3"
        >
          <span className={CLASS_LABEL}>More in {category}</span>
          <List posts={posts} />
        </nav>
      )}
    </>
  );
}
