import { Children, isValidElement } from "react";
import { Code, ScrollShadow } from "@heroui/react";
import { MDXRemote } from "next-mdx-remote/rsc";
import clsx from "clsx";
import rehypeSlug from "rehype-slug";
import remarkGFM from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

import { remarkShowLineNumbers, remarkRehypeCallout } from "@/helper/plugin";
import Callout from "@/component/Callout";
import Heading from "@/component/Heading";
import Link from "@/component/Link";
import Mermaid from "@/component/Mermaid";
import ModalImage from "@/component/ModalImage";

const SPACE = "my-4 first:mt-0 last:mb-0";

export default function ({ source }: Readonly<{ source: string }>) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [
            remarkGFM,
            remarkRehypeCallout,
            remarkShowLineNumbers,
          ],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypePrettyCode,
              {
                theme: "slack-dark",
                defaultLang: { block: "shell", inline: "text" },
              },
            ],
          ],
        },
      }}
      components={{
        h1: (element) => (
          <Heading {...element} level={1} className={clsx(element.className)} />
        ),
        h2: (element) => (
          <Heading {...element} level={2} className={clsx(element.className)} />
        ),
        h3: (element) => (
          <Heading {...element} level={3} className={clsx(element.className)} />
        ),
        h4: (element) => (
          <Heading {...element} level={4} className={clsx(element.className)} />
        ),
        h5: (element) => (
          <Heading {...element} level={5} className={clsx(element.className)} />
        ),
        h6: (element) => (
          <Heading {...element} level={6} className={clsx(element.className)} />
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
              "list-disc list-outside pl-4 text-medium my-1 last:my-0"
            )}
          />
        ),
        ol: (element) => (
          <ol
            {...element}
            className={clsx(
              element.className,
              "list-decimal list-outside pl-4 text-medium my-1 last:my-0"
            )}
          />
        ),
        li: (element) => (
          <li
            {...element}
            className={clsx(element.className, "text-medium my-1 last:my-0")}
          />
        ),
        callout: (element) => (
          <Callout {...element} className={clsx(element.className, SPACE)} />
        ),
        code: (element) => {
          return (
            <Code
              {...element}
              className={clsx(element.className, "py-[0.05rem] !bg-gray-700")}
            />
          );
        },
        pre: (element) => {
          if (element["data-language"] === "mermaid")
            return (
              <Mermaid
                source={element.children.props.children
                  .map((child: any) =>
                    typeof child === "string"
                      ? child
                      : child.props.children.props.children
                  )
                  .join("")}
              />
            );

          return <pre {...element.children.props} />;
        },
        p: (element) => {
          const children = Children.toArray(element.children);
          const isHaveOnlyImage =
            children.length === 1 &&
            isValidElement(children[0]) &&
            typeof (children[0] as any).props?.src === "string" &&
            typeof (children[0] as any).props?.alt === "string";

          if (isHaveOnlyImage) return <>{element.children}</>;

          return (
            <p
              {...element}
              className={clsx(
                element.className,
                "font-light text-medium leading-6",
                SPACE
              )}
            />
          );
        },
        a: (element) => <Link {...element} />,
        table: (element) => (
          <ScrollShadow orientation="horizontal" size={0}>
            <table
              {...element}
              className={clsx(element.className, "markdown-table")}
            />
          </ScrollShadow>
        ),
        img: (element) => <ModalImage source={element.src} alt={element.alt} />,
      }}
    />
  );
}
