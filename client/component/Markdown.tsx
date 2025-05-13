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
            className={clsx(props.className, "font-light text-medium pb-2")}
          />
        ),
        a: (props) => {
          const isExternal = props.href?.startsWith("http");
          return (
            <Link
              {...props}
              isExternal={isExternal}
              showAnchorIcon={isExternal}
              underline="always"
              target={isExternal ? "_blank" : "_self"}
            />
          );
        },
      }}
    />
  );
}
