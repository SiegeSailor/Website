import type { ComponentProps } from "react";

import { SKILL } from "@/settings/config";
import CardBlock from "@/components/CardBlock";
import IconTechnology from "@/components/IconTechnology";
import ScrollingRowsChips from "@/components/ScrollingRowsChips";

const ROWS = SKILL.map((row) =>
  row.map((skill) => ({
    name: skill,
    icon: <IconTechnology technology={skill} />,
  })),
);

export default async function ({
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
>) {
  return (
    <CardBlock href="/profile#skills" title="My Skills" {...props}>
      <div className="w-full h-full flex flex-col gap-4">
        <ScrollingRowsChips rows={ROWS} />
      </div>
    </CardBlock>
  );
}
