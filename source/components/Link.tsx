"use client";

import type { ComponentProps } from "react";
import { Link } from "@heroui/react";
import clsx from "clsx";
import NextLink from "next/link";

import { useArticleStore } from "@/stores/article";
import { ExternalLinkIcon } from "lucide-react";

function ChildrenArticle({
  ...props
}: Pick<ComponentProps<typeof Link>, "children" | "href">) {
  const articles = useArticleStore((state) => state.articles);
  return (
    articles.find((article) => props.href?.startsWith(article.metadata.route))
      ?.metadata.title ?? props.children
  );
}

export default function ({
  isPlain,
  ...props
}: ComponentProps<typeof Link> &
  Omit<ComponentProps<typeof NextLink>, keyof ComponentProps<typeof Link>> &
  Readonly<{ isPlain?: boolean }>) {
  const isArticle = props.href?.startsWith("/blog/");
  const isExternal = props.href?.startsWith("http");

  return (
    <Link
      as={NextLink}
      color="foreground"
      isExternal={isExternal}
      prefetch
      showAnchorIcon={isExternal}
      anchorIcon={
        <ExternalLinkIcon size="1rem" className="inline ml-1 -translate-y-px" />
      }
      underline={isPlain ? "none" : "always"}
      {...props}
      className={clsx(
        isPlain
          ? "block w-full h-full text-inherit text-[size:inherit] font-[weight:inherit]"
          : "font-light inline",
        isArticle && "inline",
        props.className,
      )}
    >
      {isArticle && !isPlain ? <ChildrenArticle {...props} /> : props.children}
    </Link>
  );
}
