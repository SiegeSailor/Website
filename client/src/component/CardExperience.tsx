import React from "react";
import { CardBody } from "@heroui/react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";
import Timeline from "@/component/Timeline";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className, "border-white border-4 bg-slate-50")}
      href="/profile"
      title="My Experience"
    >
      <CardBody className="space-y-2 mt-6">
        <Timeline
          items={[
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
      </CardBody>
    </CardBlock>
  );
}
