"use client";

import React from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";

import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";
import { home } from "@/setting";

const Body = dynamic(
  () => import("@/component/CardProject/Body").then((module) => module.default),
  { ssr: false, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className)}
      href="/blog"
      title="My Side Projects"
    >
      <Body items={home.project} />
    </CardBlock>
  );
}
