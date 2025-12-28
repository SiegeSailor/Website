"use server";

import type { ComponentProps } from "react";

import { EXPERIENCE } from "@/settings/home";
import CardBlock from "@/components/CardBlock";
import ContentHeader from "./ContentHeader";
import TimelineScrolling from "@/components/TimelineScrolling";

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
