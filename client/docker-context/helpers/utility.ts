import { createPublicEnv } from "next-public-env";

import { TITLE } from "@/settings/constant";

export const { getPublicEnv, PublicEnv } = createPublicEnv(
  {
    COMMIT_SHORT: process.env.COMMIT_SHORT,
    HOSTNAME: process.env.HOSTNAME,
    IMAGE: process.env.IMAGE,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  },
  {
    schema: (zod) => ({
      COMMIT_SHORT: zod.string().default("-"),
      HOSTNAME: zod.string().default("-"),
      IMAGE: zod.string().default("-"),
      NODE_ENV: zod.enum(["development", "production"]),
      PORT: zod.string().default("-"),
    }),
  }
);

export function createPageTitle(...content: string[]) {
  return [...content, TITLE].join(" | ");
}

export function getDateStringByDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function getSlugByTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getCSSVariable(variable: string) {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(variable);
}

export function getEntries<T extends object>(entity: T) {
  return Object.entries(entity) as {
    [K in keyof T]-?: [K, T[K]];
  }[keyof T][];
}

export function getValues<T extends object>(entity: T) {
  return Object.values(entity) as T[keyof T][];
}

export function getKeys<T extends object>(entity: T) {
  return Object.keys(entity) as (keyof T)[];
}

export function getHexByHSLValue(input = "0 0% 0%") {
  const [hue, saturation, lightness] = input
    .split(" ")
    .map((number) => parseInt(number, 10));

  const saturationDecimal = saturation / 100;
  const lightnessDecimal = lightness / 100;

  const calculateColor = (channelOffset: number) => {
    const huePosition = (channelOffset + hue / 30) % 12;
    const chroma =
      saturationDecimal * Math.min(lightnessDecimal, 1 - lightnessDecimal);
    const colorValue =
      lightnessDecimal -
      chroma * Math.max(Math.min(huePosition - 3, 9 - huePosition, 1), -1);
    return Math.round(255 * colorValue)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${calculateColor(0)}${calculateColor(8)}${calculateColor(4)}`;
}
