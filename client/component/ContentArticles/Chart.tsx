"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";

import { useChartStore } from "@/store/chart";
import { useArticleStore } from "@/store/article";

function renderDate(input: string) {
  const [year, month] = input.split("-");
  return `${year}-${month}`;
}

export default function ({
  countDates = 12,
}: Readonly<{
  countDates?: number;
}>) {
  const articles = useArticleStore((state) => state.articles);
  const uniqueCategories = useArticleStore((state) => state.uniqueCategories);

  const colors = useChartStore((state) => state.colors);

  const dates = useMemo(() => {
    const results = [
      ...new Set(articles.map((article) => renderDate(article.metadata.date))),
    ].sort();

    return results.slice(-countDates);
  }, [articles, countDates]);

  const datasets = useMemo(() => {
    return uniqueCategories.map((category, index) => {
      const categoryData = dates.map((item) => {
        return articles.filter((article) => {
          return (
            article.metadata.category === category &&
            renderDate(article.metadata.date) === item
          );
        }).length;
      });

      const colorVariants = [
        colors.default500,
        colors.default400,
        colors.default300,
        colors.default200,
        colors.default100,
        colors.default50,
      ];

      return {
        label: category,
        data: categoryData,
        borderColor: colorVariants[index % colorVariants.length],
        backgroundColor: colorVariants[index % colorVariants.length],
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
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
          legend: { display: false },
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
              maxRotation: 45,
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
              display: true,
              text: "Number of Articles",
              color: colors.default700,
              font: {
                size: 14,
                family: "Roboto",
              },
            },
            ticks: {
              display: true,
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
