import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@heroui/react";
import clsx from "clsx";
import NextLink from "next/link";

import Timeline from "@/component/Timeline";

export default function ({ className }: { className?: string }) {
  return (
    <Card
      className={clsx(className, "border-white border-4 bg-slate-50")}
      isPressable
      isHoverable
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <div className="items-start">
          <Chip variant="shadow" size="sm" className="p-4 bg-white">
            <span className="font-semibold">My Experience</span>
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="space-y-2 mt-6">
        <Timeline
          items={[
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
    </Card>
  );
}
