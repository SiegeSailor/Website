import { site } from "@/setting";

export function generateTitle(...content: string[]) {
  return [...content, site.name].join(" | ");
}

export function getCSSVariable(variable: string) {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(variable);
}
