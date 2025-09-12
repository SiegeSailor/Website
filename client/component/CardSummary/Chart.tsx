"use client";

import { Bar } from "react-chartjs-2";

import { SUMMARY } from "@/setting/home";
import { useChartStore } from "@/store/chart";

const TITLES = SUMMARY.map((item) => item.title);
const PORTIONS = SUMMARY.map((item) => item.portion);
const PORTION_MAX = Math.max(...PORTIONS);

export default function () {
  const colors = useChartStore((state) => state.colors);
  const isColorsInitialized = useChartStore(
    (state) => state.isColorsInitialized
  );

  if (!isColorsInitialized) return null;

  return (
    <Bar
      redraw
      width="100%"
      height="100%"
      options={{
        animation: { duration: 1500, easing: "easeOutElastic" },
        indexAxis: "y",
        maintainAspectRatio: false,
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
        responsive: true,
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
      }}
      data={{
        labels: TITLES,
        datasets: [
          {
            barThickness: 28,
            borderRadius: {
              bottomRight: 8,
              topRight: 8,
            },
            backgroundColor: colors.default200,
            data: PORTIONS,
            hoverBackgroundColor: colors.default200,
          },
        ],
      }}
    />
  );
}
