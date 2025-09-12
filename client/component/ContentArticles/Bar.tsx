"use client";

import { Bar } from "react-chartjs-2";

import { getArticles } from "@/helper/server/article";
import { useBlogStore } from "@/store/blog";
import { useChartStore } from "@/store/chart";
import { getKeys, getValues } from "@/helper/utility";

export default function ({
  articles,
}: Readonly<{ articles: Awaited<ReturnType<typeof getArticles>> }>) {
  const colors = useChartStore((state) => state.colors);
  const isColorsInitialized = useChartStore(
    (state) => state.isColorsInitialized
  );

  if (!isColorsInitialized) return null;
  // maybe reuse blog store (useArticles)

  const countCategory = articles.reduce((accumulator, article) => {
    const category = article.metadata.category;
    accumulator[category] = (accumulator[category] || 0) + 1;
    return accumulator;
  }, {} as Record<string, number>);

  return (
    <Bar
      redraw
      width="100%"
      height="100%"
      options={{
        animation: { duration: 1500, easing: "easeOutElastic" },
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
        color: colors.default700,
        borderColor: colors.background,
        ["borderWidth" as any]: 4,
      }}
      data={{
        labels: getKeys(countCategory),
        datasets: [
          {
            borderRadius: {
              topLeft: 8,
              topRight: 8,
            },
            backgroundColor: [colors.default200],
            data: getValues(countCategory),
            hoverBackgroundColor: [colors.default200],
            hoverBorderColor: "transparent",
          },
        ],
      }}
    />
  );
}
