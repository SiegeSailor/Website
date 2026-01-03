"use server";

import type { ComponentProps } from "react";

import { EXPERIENCE } from "@/settings/configs";
import CardBlock from "@/components/CardBlock";
import TimelineScrolling from "@/components/TimelineScrolling";

import ContentHeader from "./ContentHeader";

export default async function ({
  classNameScrollHeight,
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
> &
  Pick<ComponentProps<typeof TimelineScrolling>, "classNameScrollHeight">) {
  return (
    <CardBlock
      contentHeader={<ContentHeader />}
      href="/profile#employment"
      title="My Experience"
      {...props}
    >
      <TimelineScrolling
        classNameScrollHeight={classNameScrollHeight}
        items={EXPERIENCE}
      />
    </CardBlock>
  );
}
