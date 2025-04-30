"use client";

import React from "react";
import "chart.js/auto";
import { Button, CardBody, CardFooter, Chip, Spinner } from "@heroui/react";
import { Chart } from "chart.js";
import { useTheme } from "next-themes";
import ChartDataLabels from "chartjs-plugin-datalabels";
import clsx from "clsx";
import dynamic from "next/dynamic";

import CardBlock from "@/component/CardBlock";
import { getCSSVariable } from "@/helper";

const Bar = dynamic(
  () => import("react-chartjs-2").then((module) => module.Bar),
  { ssr: false, loading: () => <Spinner color="default" className="h-64" /> }
);

export default function ({ className }: { className?: string }) {
  const [colorDefault200, setColorDefault200] = React.useState("transparent");
  const [colorDefault700, setColorDefault700] = React.useState("transparent");
  const [colorForeground, setColorForeground] = React.useState("transparent");

  const { theme } = useTheme();

  React.useEffect(() => {
    Chart.register(ChartDataLabels);
  }, []);

  React.useEffect(() => {
    setColorDefault200(() => `hsl(${getCSSVariable("--heroui-default-200")})`);
    setColorDefault700(() => `hsl(${getCSSVariable("--heroui-default-700")})`);
    setColorForeground(() => `hsl(${getCSSVariable("--heroui-background")})`);
  }, [theme]);

  return (
    <CardBlock
      className={clsx(className)}
      href="/profile"
      title="What I Bring to the Table"
      contentHeader={
        <div className={clsx("w-full flex justify-end pt-2")}>
          <div className="text-xl sm:text-lg text-default-600 text-right font-light w-1/2">
            6 Years of Working Experience in
            <div className="font-semibold text-default-700">
              Software Engineering
            </div>
          </div>
        </div>
      }
    >
      <CardBody className="mt-12">
        <Bar
          width="100%"
          height="100%"
          className="mt-1"
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            scales: {
              x: {
                max: 4.5,
                ticks: { display: false },
                grid: {
                  display: true,
                  color: colorDefault200,
                  lineWidth: 1.5,
                  tickWidth: 1.5,
                },
              },
              y: {
                ticks: { display: false },
                grid: {
                  display: true,
                  color: colorDefault200,
                  lineWidth: 1.5,
                  tickWidth: 1.5,
                },
              },
            },
            plugins: {
              legend: { display: false },
              datalabels: {
                anchor: "start",
                align: "end",
                color: colorForeground,
                font: {
                  size: 12,
                  weight: "normal",
                },
                formatter: (_value, context) => {
                  const label = context.chart.data.labels?.[context.dataIndex];
                  return `${label}`;
                },
              },
            },
          }}
          data={{
            labels: [
              "DevOps",
              "Front-End",
              "Leadership",
              "System Design",
              "Full-Stack",
            ],
            datasets: [
              {
                data: [1.25, 1.5, 1.5, 2, 4.5],
                backgroundColor: colorDefault700,
                borderRadius: {
                  bottomRight: 8,
                  topRight: 8,
                },
                barThickness: 40,
              },
            ],
          }}
        />
      </CardBody>
    </CardBlock>
  );
}
