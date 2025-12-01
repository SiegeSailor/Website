"use client";

import { ComponentProps } from "react";
import { Link } from "@heroui/react";
import clsx from "clsx";
import NextLink from "next/link";

import { useArticleStore } from "@/store/article";

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
}: ComponentProps<typeof Link> & Readonly<{ isPlain?: boolean }>) {
  const isArticle = props.href?.startsWith("/blog/");
  const isExternal = props.href?.startsWith("http");

  return (
    <Link
      as={NextLink}
      color="foreground"
      isExternal={isExternal}
      prefetch
      showAnchorIcon={isExternal}
      underline={isPlain ? "none" : "always"}
      {...props}
      className={clsx(
        isPlain
          ? "block w-full h-full text-inherit text-[size:inherit] font-[weight:inherit]"
          : "font-light inline-flex",
        isArticle && "inline",
        props.className
      )}
    >
      {isArticle && !isPlain ? <ChildrenArticle {...props} /> : props.children}
    </Link>
  );
}
