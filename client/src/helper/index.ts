export function concatTitle(content?: string) {
  const suffix = "Jin Yu Zhang's Website";
  if (!content) return suffix;

  return [content, suffix].join(" | ");
}
