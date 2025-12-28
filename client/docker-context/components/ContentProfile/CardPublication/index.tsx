"use server";

import type { ComponentProps } from "react";

import Body from "./Body";
import CardBlock from "@/components/CardBlock";

export default async function ({
  ...props
}: Omit<ComponentProps<typeof CardBlock>, "children" | "href" | "title">) {
  return (
    <CardBlock {...props} isPressable={false} title="My Publications">
      <Body />
    </CardBlock>
  );
}
