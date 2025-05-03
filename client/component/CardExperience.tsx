"use client";

import React from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";

const Timeline = dynamic(
  () => import("@/component/Timeline").then((module) => module.default),
  { ssr: false, loading: () => <SpinnerCenter /> }
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
      <Timeline
        items={[
          {
            title: "Software Engineer at Shopee",
            time: "Jan 2022 - Feb 2022",
          },
          {
            title: "Software Engineer at StageSource",
            time: "Sep 2022 - Dec 2022",
          },
          {
            title: "Master in Computer Science at Boston University",
            time: "May 2022 - Jan 2024",
          },
          {
            title: "Software Engineering Intern at CooperSurgical",
            time: "May 2023 - Aug 2023",
          },
          {
            title:
              "Certificate in Data Science and Machine Learning at Massachusetts Institute of Technology",
            time: "Aug 2023 - Nov 2023",
          },
          {
            title: "Software Engineer at CooperSurgical",
            time: "Jan 2024 - Present",
          },
        ]}
      />
    </CardBlock>
  );
}
