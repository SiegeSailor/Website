"use client";

import { Bar } from "react-chartjs-2";

import { SUMMARY } from "@/setting/home";
import { useChartStore } from "@/store/chart";

const TITLES = SUMMARY.map((item) => item.title);
const PORTIONS = SUMMARY.map((item) => item.portion);
const PORTION_MAX = Math.max(...PORTIONS);

export default function () {
  const colors = useChartStore((state) => state.colors);
  const isColorsSet = useChartStore((state) => state.isColorsSet);

  if (!isColorsSet) return null;

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
              color: colors.default200,
              lineWidth: 1.5,
              tickWidth: 1.5,
            },
          },
          y: {
            ticks: { display: false },
            grid: {
              display: true,
              color: colors.default200,
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
            color: colors.default700,
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
            backgroundColor: colors.default200,
            hoverBackgroundColor: colors.default200,
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
