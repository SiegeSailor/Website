"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";

import { useChartStore } from "@/store/chart";
import { useArticleStore } from "@/store/article";
import { getEntries } from "@/helper/utility";

function renderDate(input: string) {
  const [year, month] = input.split("-");
  return `${year}-${month}`;
}

export default function ({ xRotation }: Readonly<{ xRotation: number }>) {
  const articles = useArticleStore((state) => state.articles);
  const uniqueCategories = useArticleStore((state) => state.uniqueCategories);

  const colors = useChartStore((state) => state.colors);

  const dates = useMemo(() => {
    const results = [
      ...new Set(articles.map((article) => renderDate(article.metadata.date))),
    ].sort();

    return results;
  }, [articles]);

  const datasets = useMemo(() => {
    const colorVariants = [
      colors.default500,
      colors.default400,
      colors.default300,
      colors.default200,
      colors.default100,
      colors.default50,
    ];

    const categoryToData: Record<string, number> = {};
    const dateSet = new Set<string>(dates);
    articles.forEach((article) => {
      if (!dateSet.has(renderDate(article.metadata.date))) return;
      categoryToData[article.metadata.category] =
        (categoryToData[article.metadata.category] || 0) + 1;
    });

    return getEntries(categoryToData)
      .sort((left, right) => right[1] - left[1])
      .map(([category], index) => {
        const categoryData = dates.map((item) => {
          return articles.filter((article) => {
            return (
              article.metadata.category === category &&
              renderDate(article.metadata.date) === item
            );
          }).length;
        });

        return {
          label: category,
          data: categoryData,
          borderColor: colorVariants[index % colorVariants.length],
          backgroundColor: colorVariants[index % colorVariants.length],
          fill: false,
          pointHoverRadius: 6,
          pointRadius: 4,
          pointStyle: "circle",
          tension: 0.5,
        };
      });
  }, [articles, dates, uniqueCategories, colors]);

  return (
    <Line
      redraw
      width="100%"
      height="100%"
      options={{
        animation: { duration: 1500, easing: "easeOutElastic" },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            title: { text: "", padding: 0, display: true },
            display: true,
            align: "start",
            position: "chartArea",
            labels: {
              borderRadius: 4,
              useBorderRadius: true,
            },
          },
          datalabels: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: colors.background,
            titleColor: colors.default700,
            bodyColor: colors.default700,
            borderColor: colors.default200,
            borderWidth: 1,
          },
        },
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: true,
              color: colors.default700,
              font: {
                size: 14,
                family: "Roboto",
              },
              maxRotation: xRotation,
              minRotation: xRotation,
            },
            grid: {
              display: true,
              color: colors.default200,
              lineWidth: 1.5,
              tickWidth: 1.5,
            },
          },
          y: {
            max:
              Math.max(...datasets.map((dataset) => dataset.data).flat()) + 1,
            title: {
              display: false,
              text: "Number of Articles",
              color: colors.default700,
              font: {
                size: 14,
                family: "Roboto",
              },
            },
            ticks: {
              display: false,
              color: colors.default700,
              font: {
                size: 12,
                family: "Roboto",
              },
              stepSize: 1,
            },
            grid: {
              display: true,
              color: colors.default200,
              lineWidth: 1,
            },
          },
        },
      }}
      data={{ labels: dates, datasets }}
    />
  );
}
