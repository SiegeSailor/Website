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

export default function ({ className }: Readonly<{ className?: string }>) {
  const [colorDefault200, setColorDefault200] = useState("transparent");
  const [colorDefault700, setColorDefault700] = useState("transparent");
  const [colorForeground, setColorForeground] = useState("transparent");
  const [isBarLoaded, setIsBarLoaded] = useState(false);

  useEffect(() => {
    Chart.register(ChartDataLabels);
  }, []);

  const { theme } = useTheme();

  useEffect(() => {
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
        <FloatingDivision
          volume={4.5}
          direction="horizontal"
          className={clsx(
            "text-xl sm:text-lg",
            "text-default-600 text-right font-light",
            "w-3/5 pr-4 pt-12",
            "absolute top-1 right-1"
          )}
        >
          <div
            className={clsx(
              isBarLoaded ? "opacity-100" : "opacity-0",
              "transition-opacity duration-1000 ease-in-out",
              "leading-6 text-medium",
              "bg-default-100 bg-opacity-60 border-1 border-default-200",
              "p-2 rounded-sm"
            )}
          >
            6 Years of Working Experience in
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
              color: colorForeground,
              font: {
                size: 14,
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
          labels: SUMMARY.map((item) => item.title),
          datasets: [
            {
              data: SUMMARY.map((item) => item.portion),
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
