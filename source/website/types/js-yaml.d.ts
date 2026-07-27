// js-yaml ships no bundled types and @types/js-yaml is not installed; we only
// use `load`. Keep this minimal declaration so the app can import it under TS.
declare module "js-yaml" {
  export function load(input: string): unknown;
}
