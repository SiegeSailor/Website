"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";

import { getArticles } from "@/helper/server/article";
import { useBlogStore } from "@/store/blog";
import { useChartStore } from "@/store/chart";

export default function ({
  articles,
}: Readonly<{ articles: Awaited<ReturnType<typeof getArticles>> }>) {
  const colors = useChartStore((state) => state.colors);
  const isColorsInitialized = useChartStore(
    (state) => state.isColorsInitialized
  );

  const categories = [
    ...new Set(articles.map((article) => article.metadata.category)),
  ];

  const monthYears = useMemo(() => {
    return [
      ...new Set(
        articles.map((article) => {
          const date = new Date(article.metadata.date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          return `${year}-${month}`;
        })
      ),
    ].sort();
  }, [articles]);

  const datasets = useMemo(() => {
    return categories.map((category, index) => {
      const categoryData = monthYears.map((monthYear) => {
        return articles.filter((article) => {
          const date = new Date(article.metadata.date);
          const articleMonthYear = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          return (
            article.metadata.category === category &&
            articleMonthYear === monthYear
          );
        }).length;
      });

      const colorVariants = [
        colors.default700,
        colors.default600,
        colors.default500,
        colors.default400,
        colors.default300,
        colors.default800,
        colors.default900,
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
  }, [articles, monthYears, categories, colors]);

  if (!isColorsInitialized) return null;

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
              lineWidth: 1,
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
                size: 10,
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
      data={{ labels: monthYears, datasets }}
    />
  );
}
