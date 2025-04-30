"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";

const Timeline = dynamic(
  () => import("@/component/Timeline").then((module) => module.default),
  {
    ssr: false,
    loading: () => <Spinner color="default" className="h-64 w-64" />,
  }
);

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className)}
      href="/profile"
      title="My Experience"
    >
      <Timeline
        items={[
          {
            title: "Software Engineer at Shopee, Pte. Ltd. / Taipei, Taiwan",
            time: "Jan 2022 - Feb 2022",
          },
          {
            title: "Software Engineer at StageSource / Boston, MA, USA",
            time: "Sep 2022 - Dec 2022",
          },
          {
            title: "Master in Computer Science at Boston University",
            time: "May 2022 - Jan 2024",
          },
          {
            title:
              "Software Engineering Intern at CooperSurgical, Inc. / Trumbull, CT, USA",
            time: "May 2023 - Aug 2023",
          },
          {
            title:
              "Certificate in Data Science and Machine Learning at Massachusetts Institute of Technology",
            time: "Aug 2023 - Nov 2023",
          },
          {
            title:
              "Software Engineer at CooperSurgical, Inc. / Trumbull, CT, USA",
            time: "Jan 2024 - Present",
          },
        ]}
      />
    </CardBlock>
  );
}
