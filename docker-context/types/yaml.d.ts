// YAML files are imported as raw text via the webpack `asset/source` rule in
// next.config.mjs, so edits hot-reload during `npm run watch`.
declare module "*.yaml" {
  const content: string;
  export default content;
}
