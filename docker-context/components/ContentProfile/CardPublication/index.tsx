import type { ComponentProps } from "react";

import CardBlock from "@/components/CardBlock";

import Body from "./Body";

export default async function ({
  ...props
}: Omit<ComponentProps<typeof CardBlock>, "children" | "href" | "title">) {
  return (
    <CardBlock {...props} isPressable={false} title="My Publications">
      <Body />
    </CardBlock>
  );
}
