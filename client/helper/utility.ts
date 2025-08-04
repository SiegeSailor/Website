import { TITLE } from "@/setting/site";

export function generateTitle(...content: string[]) {
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
