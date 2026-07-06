"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import mermaid from "mermaid";

import { getCSSVariable } from "@/helpers/utility";
import { useChartStore } from "@/stores/chart";

const CSS_VARIABLE_COLORS = [
  "--heroui-background",
  "--heroui-default-50",
  "--heroui-default-100",
  "--heroui-default-200",
  "--heroui-default-300",
  "--heroui-default-400",
  "--heroui-default-500",
  "--heroui-default-600",
  "--heroui-default-700",
  "--heroui-default-800",
  "--heroui-default-900",
  "--heroui-primary-50",
  "--heroui-primary-100",
  "--heroui-primary-200",
  "--heroui-primary-300",
  "--heroui-primary-400",
  "--heroui-primary-500",
  "--heroui-primary-600",
  "--heroui-primary-700",
  "--heroui-primary-800",
  "--heroui-primary-900",
  "--heroui-foreground",
];

export function useColorTheme() {
  const { theme } = useTheme();

  const setColors = useChartStore((state) => state.setColors);

  useEffect(() => {
    requestAnimationFrame(() => {
      setColors(
        Object.fromEntries(
          CSS_VARIABLE_COLORS.map((variable) => {
            const value = getCSSVariable(variable);
            return [
              variable.replace("--heroui-", "").replaceAll("-", ""),
              `hsl(${value})`,
            ];
          }),
        ),
      );
    });
  }, [theme, setColors]);
}

export function useMermaid() {
  const colors = useChartStore((state) => state.colors);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "null",
      themeVariables: {
        fontFamily: "Roboto",
        fontSize: "1rem",
        mainBkg: colors.default100,
        textColor: colors.foreground,
        primaryBorderColor: colors.primary500,
        primaryTextColor: colors.foreground,
        secondaryColor: colors.default500,
        primaryColor: colors.default700,
        git0: colors.default700,
        git1: colors.default600,
        git2: colors.default500,
        git3: colors.default400,
        git4: colors.default300,
        git5: colors.default200,
        git6: colors.default100,
        gitBranchLabel0: colors.background,
        gitBranchLabel1: colors.background,
        gitBranchLabel2: colors.background,
        gitBranchLabel3: colors.background,
        gitBranchLabel4: colors.default700,
        gitBranchLabel5: colors.default700,
        gitBranchLabel6: colors.default700,
        commitLabelFontSize: "1rem",
        commitLabelColor: colors.default700,
        commitLabelBackground: colors.default200,
        tagLabelFontSize: "1rem",
        tagLabelColor: colors.default700,
        tagLabelBackground: colors.default50,
        tagLabelBorder: colors.default700,
        pie1: colors.default700,
        pie2: colors.default600,
        pie3: colors.default500,
        pie4: colors.default400,
        pie5: colors.default300,
        pie6: colors.default200,
        pieSectionTextColor: colors.foreground,
        pieLegendTextColor: colors.foreground,
        pieOpacity: 1,
        nodeBorder: colors.primary500,
        edgeLabelBackground: colors.default200,
        defaultLinkColor: colors.default700,
        clusterBkg: colors.default100,
        clusterBorder: "transparent",
        nodeTextColor: colors.foreground,
        actorBkg: colors.default100,
        actorBorder: colors.primary500,
        actorTextColor: colors.foreground,
        actorLineColor: colors.default200,
        sequenceNumberColor: colors.background,
        labelBoxBorderColor: colors.default700,
      },
      themeCSS: `
        .commit-merge {
            fill: hsl(var(--heroui-default-50));
            stroke: hsl(var(--heroui-default-50));
        }
        .commit-label {
            transform: translateY(0.3125rem);
        }
        .tag-label {
            transform: translateY(0.125rem);
        }
        .branch {
            stroke: hsl(var(--heroui-default-700)) !important;
        }
        .arrow, .tag-label-bkg {
            stroke-width: 2px !important;
        }

        .flowchart-link {
            stroke: hsl(var(--heroui-default-400)) !important;
        }
        .marker {
            fill: hsl(var(--heroui-default-400));
            stroke: hsl(var(--heroui-default-400)) !important;
        }
        .label-container, .label-container path {
            fill: hsl(var(--heroui-default-100)) !important;
            stroke: hsl(var(--heroui-primary-500)) !important;
        }
        .node.default path {
            fill: hsl(var(--heroui-default-100)) !important;
            stroke: hsl(var(--heroui-primary-500)) !important;
        }
        .nodeLabel p {
            color: hsl(var(--heroui-foreground)) !important;
            white-space: nowrap;
            font-weight: 400;
        }
        .cluster .nodeLabel p {
            color: hsl(var(--heroui-foreground)) !important;
            font-size: 0.9rem;
            padding-top: 50%;
            transform: translateY(-50%);
        }

        text.slice:nth-of-type(1), text.slice:nth-of-type(2), text.slice:nth-of-type(3), text.slice:nth-of-type(4) {
            fill: hsl(var(--heroui-background)) !important;
        }
      `,
      gitGraph: {
        showBranches: true,
        showCommitLabel: true,
        parallelCommits: true,
      },
      flowchart: {
        nodeSpacing: 25,
        rankSpacing: 50,
        curve: "basis",
      },
    });
  }, [colors]);
}
