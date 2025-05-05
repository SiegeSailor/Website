import { MDXRemote } from "next-mdx-remote/rsc";

export default function ({ source }: { source: string }) {
  return <MDXRemote source={source} components={{}} />;
}
