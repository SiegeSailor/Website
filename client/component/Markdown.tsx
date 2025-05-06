import { MDXRemote } from "next-mdx-remote/rsc";
import clsx from "clsx";
import Link from "next/link";

export default function ({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={{
        p: (props) => (
          <p {...props} className={clsx(props.className, "font-light")} />
        ),
        a: (props) => (
          <Link
            target="_blank"
            {...props}
            className={clsx(
              props.className,
              "text-default-500 hover:text-default-400"
            )}
          />
        ),
      }}
    />
  );
}
