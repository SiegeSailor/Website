"use server";

import { ComponentProps } from "react";

import { getProfile } from "@/helper/server/document";
import CardBlock from "@/component/CardBlock";
import Chart from "./Chart";
import ContentHeader from "./ContentHeader";

export default async function ({
  classNameHeight = "h-full",
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
> &
  Readonly<{ classNameHeight?: string }>) {
  const { metadata } = await getProfile();

  return (
    <CardBlock
      contentHeader={<ContentHeader experience={metadata.status.experience} />}
      href="/profile#summary"
      title="What I Bring to the Table"
      {...props}
    >
      <div className={classNameHeight}>
        <Chart />
      </div>
    </CardBlock>
  );
}
