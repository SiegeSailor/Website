import clsx from "clsx";
import dynamic from "next/dynamic";

import { SKILL } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";
import IconTechnology from "@/component/IconTechnology";

const ScrollingRowsChips = dynamic(
  () =>
    import("@/component/ScrollingRowsChips").then((module) => module.default),
  { ssr: true, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: Readonly<{ className?: string }>) {
  const parentIdentifier = "skill";

  return (
    <CardBlock
      className={clsx(className)}
      href="/profile#skills"
      title="My Skills"
      id={parentIdentifier}
    >
      <div className="w-full h-full flex flex-col gap-5">
        <ScrollingRowsChips
          parentIdentifier={parentIdentifier}
          rows={SKILL.map((row) =>
            row.map((skill) => ({
              name: skill,
              icon: <IconTechnology technology={skill} />,
            }))
          )}
        />
      </div>
    </CardBlock>
  );
}
