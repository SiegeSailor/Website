"use server";

import { ComponentProps } from "react";

import { SKILL } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import IconTechnology from "@/component/IconTechnology";
import ScrollingRowsChips from "@/component/ScrollingRowsChips";

const ROWS = SKILL.map((row) =>
  row.map((skill) => ({
    name: skill,
    icon: <IconTechnology technology={skill} />,
  }))
);

export default async function ({
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
>) {
  return (
    <CardBlock href="/profile#skills" title="My Skills" {...props}>
      <div className="w-full h-full flex flex-col gap-5">
        <ScrollingRowsChips rows={ROWS} />
      </div>
    </CardBlock>
  );
}
