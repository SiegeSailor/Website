"use client";

import "chart.js/auto";
import { Chart } from "chart.js";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ChartDataLabels from "chartjs-plugin-datalabels";
import clsx from "clsx";
import dynamic from "next/dynamic";

import { getCSSVariable } from "@/helper/utility";
import { SUMMARY } from "@/setting/home";
import CardBlock from "@/component/CardBlock";
import FloatingDivision from "@/component/FloatingDivision";
import SpinnerCenter from "@/component/SpinnerCenter";

const Bar = dynamic(
  () => import("react-chartjs-2").then((module) => module.Bar),
  { ssr: true, loading: () => <SpinnerCenter /> }
);

export default function ({
  experience,
  className,
}: Readonly<{ experience: string; className?: string }>) {
  const [colorDefault200, setColorDefault200] = useState("transparent");
  const [colorDefault700, setColorDefault700] = useState("transparent");
  const [isBarLoaded, setIsBarLoaded] = useState(false);

  useEffect(() => {
    Chart.register(ChartDataLabels);
  }, []);

  const { theme } = useTheme();

  useEffect(() => {
    setColorDefault200(() => `hsl(${getCSSVariable("--heroui-default-200")})`);
    setColorDefault700(() => `hsl(${getCSSVariable("--heroui-default-700")})`);
  }, [theme]);

  return (
    <CardBlock
      className={clsx(className)}
      href="/profile#summary"
      title="What I Bring to the Table"
      contentHeader={
        <FloatingDivision
          volume={2.5}
          direction="horizontal"
          className={clsx(
            "absolute top-28 right-1",
            "-translate-x-1/2 -translate-y-1/2",
            "w-1/2"
          )}
        >
          <div
            className={clsx(
              isBarLoaded ? "opacity-100" : "opacity-0",
              "transition-opacity duration-1000 ease-in-out",
              "text-lg",
              "text-default-600 text-right font-normal",
              "leading-8",
              "p-2 rounded-sm"
            )}
          >
            {experience} in
            <div className="font-semibold text-default-700">
              Software Engineering
            </div>
          </div>
        </FloatingDivision>
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
              max: Math.max(...SUMMARY.map((item) => item.portion)),
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
              color: colorDefault700,
              font: {
                size: 14,
                weight: "normal",
                family: "Roboto",
              },
              formatter: (_value, context) =>
                context.chart.data.labels?.[context.dataIndex],
            },
            tooltip: { enabled: false },
          },
        }}
        data={{
          labels: SUMMARY.map((item) => item.title),
          datasets: [
            {
              data: SUMMARY.map((item) => item.portion),
              backgroundColor: colorDefault200,
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
