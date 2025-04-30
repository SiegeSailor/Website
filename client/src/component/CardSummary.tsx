"use client";

import React from "react";
import "chart.js/auto";
import { Chart } from "chart.js";
import { Spinner } from "@heroui/react";
import { useTheme } from "next-themes";
import ChartDataLabels from "chartjs-plugin-datalabels";
import clsx from "clsx";
import dynamic from "next/dynamic";

import { getCSSVariable } from "@/helper";
import CardBlock from "@/component/CardBlock";
import MotionFloating from "@/component/MotionFloating";
import SpinnerCenter from "@/component/SpinnerCenter";

const Bar = dynamic(
  () => import("react-chartjs-2").then((module) => module.Bar),
  { ssr: false, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: { className?: string }) {
  const [colorDefault200, setColorDefault200] = React.useState("transparent");
  const [colorDefault700, setColorDefault700] = React.useState("transparent");
  const [colorForeground, setColorForeground] = React.useState("transparent");
  const [isBarLoaded, setIsBarLoaded] = React.useState(false);

  React.useEffect(() => {
    Chart.register(ChartDataLabels);
  }, []);

  const { theme } = useTheme();

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
        <MotionFloating
          className={clsx(
            "text-xl sm:text-lg leading-3",
            "text-default-600 text-right font-light",
            "w-1/2 pr-2 pt-10",
            "absolute top-0 right-0"
          )}
        >
          <div
            className={clsx(
              isBarLoaded ? "opacity-100" : "opacity-0",
              "transition-opacity duration-1000 ease-in-out"
            )}
          >
            6 Years of Working Experience in
            <div className="font-semibold text-default-700">
              Software Engineering
            </div>
          </div>
        </MotionFloating>
      }
    >
      <Bar
        redraw
        width="100%"
        height="100%"
        options={{
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          animation: {
            duration: 1500,
            easing: "easeOutElastic",
            onComplete: () => {
              setIsBarLoaded(() => true);
            },
          },
          scales: {
            x: {
              min: 0,
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
                family: "Roboto",
              },
              formatter: (_value, context) => {
                const label = context.chart.data.labels?.[context.dataIndex];
                return `${label}`;
              },
            },
            tooltip: { enabled: false },
          },
        }}
        data={{
          labels: [
            "DevOps",
            "System Design",
            "Leadership",
            "Front-End",
            "Back-End",
          ],
          datasets: [
            {
              data: [1.5, 2, 1.5, 4, 4.5],
              backgroundColor: colorDefault700,
              borderRadius: {
                bottomRight: 8,
                topRight: 8,
              },
              barThickness: 28,
            },
          ],
        }}
      />
    </CardBlock>
  );
}
