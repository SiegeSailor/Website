"use server";

import { ComponentProps } from "react";

import { EXPERIENCE } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import ContentHeader from "@/component/CardExperience/ContentHeader";
import ScrollingTimeline from "@/component/ScrollingTimeline";

export default async function ({
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
>) {
  return (
    <CardBlock
      contentHeader={<ContentHeader />}
      href="/profile#employment"
      title="My Experience"
      {...props}
    >
      <ScrollingTimeline items={EXPERIENCE} />
    </CardBlock>
  );
}
