"use client";

import React from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";

import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";
import { home } from "@/setting";

const ScrollShadowChips = dynamic(
  () =>
    import("@/component/ScrollShadowChips").then((module) => module.default),
  { ssr: false, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock className={clsx(className)} href="/blog" title="My Skills">
      <div className="w-full h-full flex flex-col gap-5">
        <ScrollShadowChips
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
