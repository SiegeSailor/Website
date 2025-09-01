"use server";

import { ComponentProps } from "react";

import { EXPERIENCE } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import ContentHeader from "./ContentHeader";
import TimelineScrolling from "@/component/TimelineScrolling";

export default async function ({
  classNameHeight,
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
> &
  Pick<ComponentProps<typeof TimelineScrolling>, "classNameHeight">) {
  return (
    <CardBlock
      contentHeader={<ContentHeader />}
      href="/profile#employment"
      title="My Experience"
      {...props}
    >
      <TimelineScrolling classNameHeight={classNameHeight} items={EXPERIENCE} />
    </CardBlock>
  );
}
