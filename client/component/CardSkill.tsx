"use client";

import React from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";

import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";
import { home } from "@/setting";

const ScrollRowsChips = dynamic(
  () =>
    import("@/component/ScrollingRowsChips").then((module) => module.default),
  { ssr: true, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: { className?: string }) {
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
          rows={home.skill.map((row) =>
            row.map((skill) => ({
              name: skill.name,
              icon: React.createElement(skill.icon),
            }))
          )}
        />
      </div>
    </CardBlock>
  );
}
