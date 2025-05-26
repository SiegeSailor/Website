"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";

import { PROJECT } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";

const Body = dynamic(
  () => import("@/component/CardProject/Body").then((module) => module.default),
  { ssr: true, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: Readonly<{ className?: string }>) {
  return (
    <CardBlock
      className={clsx(className)}
      title="My Side Projects"
      isPressable={false}
    >
      <Body items={PROJECT} />
    </CardBlock>
  );
}
