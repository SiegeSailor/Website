import { Code } from "@heroui/react";
import { MDXRemote } from "next-mdx-remote/rsc";
import clsx from "clsx";

import { remarkRehypeCallout } from "@/helper/plugin";
import Callout from "@/component/Callout";
import CodeBlock from "@/component/CodeBlock";
import Heading from "@/component/Heading";
import Link from "@/component/Link";
import Mermaid from "@/component/Mermaid";

const SPACE = "mb-4 last:mb-0";
const SPACE_LARGE = "mb-4 last:mb-0 mt-12 first:mt-0";

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
            className={clsx(element.className, SPACE_LARGE)}
          />
        ),
        h2: (element) => (
          <Heading
            {...element}
            level={2}
            className={clsx(element.className, SPACE_LARGE)}
          />
        ),
        h3: (element) => (
          <Heading
            {...element}
            level={3}
            className={clsx(element.className, SPACE_LARGE)}
          />
        ),
        h4: (element) => (
          <Heading
            {...element}
            level={4}
            className={clsx(element.className, SPACE_LARGE)}
          />
        ),
        h5: (element) => (
          <Heading
            {...element}
            level={5}
            className={clsx(element.className, SPACE_LARGE)}
          />
        ),
        h6: (element) => (
          <Heading
            {...element}
            level={6}
            className={clsx(element.className, SPACE_LARGE)}
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
        pre: (element) => {
          if (element.children.props.className === "language-mermaid")
            return <Mermaid source={element.children.props.children} />;

          return (
            <CodeBlock
              {...element.children.props}
              className={clsx(element.className, SPACE)}
            />
          );
        },
        p: (element) => (
          <p
            {...element}
            className={clsx(
              element.className,
              "font-normal text-medium leading-6",
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
