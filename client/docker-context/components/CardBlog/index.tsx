"use server";

import type { ComponentProps } from "react";

import CardBlock from "@/components/CardBlock";
import ContentBody from "./ContentBody";

export default async function ({
  ...props
}: Omit<ComponentProps<typeof CardBlock>, "contentBody" | "href" | "title">) {
  return (
    <CardBlock
      contentBody={<ContentBody />}
      href="/blog"
      title="More Insights on My Blog"
      {...props}
    />
  );
}
