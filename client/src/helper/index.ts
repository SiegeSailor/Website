import { NAME_WEBSITE } from "@/setting";

export function generateTitle(...content: string[]) {
  return [...content, NAME_WEBSITE].join(" | ");
}

export function getCSSVariable(variable: string) {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(variable);
}
