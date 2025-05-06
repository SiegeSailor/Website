import { MDXRemote } from "next-mdx-remote/rsc";
import clsx from "clsx";

import Link from "@/component/Link";

export default function ({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={{
        p: (props) => (
          <p
            {...props}
            className={clsx(props.className, "font-light text-medium")}
          />
        ),
        a: (props) => (
          <Link
            {...props}
            target={props.href[0] === "/" ? "_self" : "_blank"}
          />
        ),
      }}
    />
  );
}
