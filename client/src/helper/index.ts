export function concatTitle(content?: string) {
  const suffix = "Jin Yu Zhang's Website";
  if (!content) return suffix;

  return [content, suffix].join(" | ");
}

export function getCSSVariable(variable: string) {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(variable);
}
