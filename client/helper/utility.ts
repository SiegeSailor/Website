import { NAME } from "@/setting/site";

export function generateTitle(...content: string[]) {
  return [...content, NAME].join(" | ");
}

export function getCSSVariable(variable: string) {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(variable);
}

export function getEntries<T extends object>(obj: T) {
  return Object.entries(obj) as {
    [K in keyof T]-?: [K, T[K]];
  }[keyof T][];
}
