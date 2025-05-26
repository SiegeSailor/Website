import { MDXRemote } from "next-mdx-remote/rsc";
import { Code } from "@heroui/react";
import clsx from "clsx";

import { remarkRehypeCallout } from "@/helper/plugin";
import Callout from "@/component/Callout";
import CodeBlock from "@/component/CodeBlock";
import Heading from "@/component/Heading";
import Link from "@/component/Link";

const SPACE = "mb-6 last:mb-0";

export default function ({ source }: Readonly<{ source: string }>) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkRehypeCallout],
          rehypePlugins: [],
        },
      }}
      components={{
        h1: (element) => (
          <Heading
            {...element}
            level={1}
            className={clsx(element.className, SPACE)}
          />
        ),
        h2: (element) => (
          <Heading
            {...element}
            level={2}
            className={clsx(element.className, SPACE)}
          />
        ),
        h3: (element) => (
          <Heading
            {...element}
            level={3}
            className={clsx(element.className, SPACE)}
          />
        ),
        h4: (element) => (
          <Heading
            {...element}
            level={4}
            className={clsx(element.className, SPACE)}
          />
        ),
        h5: (element) => (
          <Heading
            {...element}
            level={5}
            className={clsx(element.className, SPACE)}
          />
        ),
        h6: (element) => (
          <Heading
            {...element}
            level={6}
            className={clsx(element.className, SPACE)}
          />
        ),
        blockquote: (element) => (
          <blockquote
            {...element}
            className={clsx(
              element.className,
              "border-l-2 border-default-500 pl-2 italic text-medium",
              SPACE
            )}
          />
        ),
        ul: (element) => (
          <ul
            {...element}
            className={clsx(
              element.className,
              "list-disc list-inside pl-4 text-medium",
              SPACE
            )}
          />
        ),
        ol: (element) => (
          <ol
            {...element}
            className={clsx(
              element.className,
              "list-decimal list-inside pl-4 text-medium",
              SPACE
            )}
          />
        ),
        li: (element) => (
          <li
            {...element}
            className={clsx(element.className, "text-medium mb-2")}
          />
        ),
        code: (element) => (
          <Code {...element} className={clsx(element.className, SPACE)} />
        ),
        callout: (element) => (
          <Callout {...element} className={clsx(element.className, SPACE)} />
        ),
        pre: (element) => (
          <CodeBlock
            {...element.children.props}
            className={clsx(element.className, SPACE)}
          />
        ),
        p: (element) => (
          <p
            {...element}
            className={clsx(
              element.className,
              "font-light text-medium leading-6",
              SPACE
            )}
          />
        ),
        a: (element) => {
          const isExternal = element.href?.startsWith("http");
          return (
            <Link
              {...element}
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
