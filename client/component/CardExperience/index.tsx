"use server";

import { ComponentProps } from "react";

import { EXPERIENCE } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import ContentHeader from "@/component/CardExperience/ContentHeader";
import ScrollingTimeline from "@/component/ScrollingTimeline";

export default async function ({
  classNameScrollingTimelineHeight,
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
> &
  Readonly<{
    classNameScrollingTimelineHeight: ComponentProps<
      typeof ScrollingTimeline
    >["classNameHeight"];
  }>) {
  return (
    <CardBlock
      contentHeader={<ContentHeader />}
      href="/profile#employment"
      title="My Experience"
      {...props}
    >
      <ScrollingTimeline
        classNameHeight={classNameScrollingTimelineHeight}
        items={EXPERIENCE}
      />
    </CardBlock>
  );
}
