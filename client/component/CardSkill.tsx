"use client";

import { createElement } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";

import { SKILL } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";

const ScrollRowsChips = dynamic(
  () =>
    import("@/component/ScrollingRowsChips").then((module) => module.default),
  { ssr: true, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: Readonly<{ className?: string }>) {
  const parentIdentifier = "skill";

  return (
    <CardBlock
      className={clsx(className)}
      href="/blog"
      title="My Skills"
      id={parentIdentifier}
    >
      <div className="w-full h-full flex flex-col gap-5">
        <ScrollRowsChips
          parentIdentifier={parentIdentifier}
          rows={SKILL.map((row) =>
            row.map((skill) => ({
              name: skill.name,
              icon: createElement(skill.icon),
            }))
          )}
        />
      </div>
    </CardBlock>
  );
}
