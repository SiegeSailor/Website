"use client";

import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { getCSSVariable } from "@/helper/utility";
import { SUMMARY } from "@/setting/home";

Chart.register(ChartDataLabels);

const TITLES = SUMMARY.map((item) => item.title);
const PORTIONS = SUMMARY.map((item) => item.portion);
const PORTION_MAX = Math.max(...PORTIONS);

export default function () {
  const [colorDefault200, setColorDefault200] = useState("transparent");
  const [colorDefault700, setColorDefault700] = useState("transparent");

  const { theme } = useTheme();

  useEffect(() => {
    setColorDefault200(() => `hsl(${getCSSVariable("--heroui-default-200")})`);
    setColorDefault700(() => `hsl(${getCSSVariable("--heroui-default-700")})`);
  }, [theme]);

  return (
    <Bar
      redraw
      width="100%"
      height="100%"
      options={{
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        animation: { duration: 1500, easing: "easeOutElastic" },
        scales: {
          x: {
            min: 0,
            max: PORTION_MAX,
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
        labels: TITLES,
        datasets: [
          {
            data: PORTIONS,
            backgroundColor: colorDefault200,
            hoverBackgroundColor: colorDefault200,
            borderRadius: {
              bottomRight: 8,
              topRight: 8,
            },
            barThickness: 28,
          },
        ],
      }}
    />
  );
}
