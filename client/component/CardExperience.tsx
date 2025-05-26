"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";
import { EXPERIENCE } from "@/setting/home";

const ScrollingTimeline = dynamic(
  () =>
    import("@/component/ScrollingTimeline").then((module) => module.default),
  { ssr: true, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className)}
      href="/profile"
      title="My Experience"
      contentHeader={
        <div
          className={clsx(
            "w-full h-28 absolute top-0 left-0 z-10",
            "blur bg-gradient-to-b from-background to-default-50 opacity-80"
          )}
        />
      }
    >
      <ScrollingTimeline items={EXPERIENCE} />
    </CardBlock>
  );
}
