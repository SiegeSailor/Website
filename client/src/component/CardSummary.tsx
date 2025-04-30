"use client";

import React from "react";
import dynamic from "next/dynamic";
import "chart.js/auto";
import { Button, CardBody, CardFooter, Chip, Spinner } from "@heroui/react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";

const Bar = dynamic(
  () => import("react-chartjs-2").then((module) => module.Bar),
  { ssr: false, loading: () => <Spinner color="default" className="h-64" /> }
);
const _cssVar = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};
export default function ({ className }: { className?: string }) {
  console.log(_cssVar("--heroui-primary"));
  return (
    <CardBlock
      className={clsx(className)}
      href="/profile"
      title="What I Bring to the Table"
      contentHeader={
        <div className="p-2 text-default-700 text-left font-semibold text-md w-2/3">
          6 Years of Working Experience in Software Engineering
        </div>
      }
    >
      <CardBody className="space-y-2 mt-6">
        <Bar
          width="100%"
          height="100%"
          className="mt-1"
          options={{
            responsive: true,
            indexAxis: "y",
            scales: { x: { max: 6 } },
            plugins: { legend: { display: false } },
          }}
          data={{
            labels: [
              ".NET",
              "DevOps",
              "Front-End",
              "Leadership",
              "System Design",
              "Full-Stack",
            ],
            datasets: [
              {
                data: [0.5, 1, 1.5, 1.5, 3, 4.5],
                // backgroundColor: `hsl(${_cssVar("--heroui-primary")})`,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                // borderColor: getComputedStyle(
                //   document.documentElement
                // ).getPropertyValue("--heroui-primary-200"),
                // categoryPercentage: 0.6, // Shrinks the bar's height area
                // barPercentage: 0.6,
                borderRadius: {
                  bottomRight: Number.MAX_VALUE,
                  topRight: Number.MAX_VALUE,
                },
                barThickness: 20,
              },
            ],
          }}
        />
      </CardBody>
    </CardBlock>
  );
}
