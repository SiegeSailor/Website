import { type ComponentProps } from "react";
import { Children, isValidElement } from "react";
import { ScrollShadow } from "@heroui/react";
import { MDXRemote } from "next-mdx-remote/rsc";
import clsx from "clsx";
import rehypeSlug from "rehype-slug";
import remarkGFM from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

import { remarkShowLineNumbers, remarkRehypeCallout } from "@/helpers/plugin";
import ButtonCopy from "@/components/ButtonCopy";
import Callout from "@/components/Callout";
import Code from "@/components/Code";
import Heading from "@/components/Heading";
import Link from "@/components/Link";
import Mermaid from "@/components/Mermaid";
import ModalImage from "@/components/ModalImage";

const SPACE = "my-4 first:mt-0 last:mb-0" as const;

export default async function ({
  source,
  p,
}: Readonly<{ source: string; p?: ComponentProps<"p"> }>) {
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
                // Dual themes so code blocks follow the site theme; the site's
                // own surface is used for the background (keepBackground: false).
                theme: { light: "github-light", dark: "github-dark" },
                keepBackground: false,
                defaultLang: { block: "shell", inline: "text" },
              },
            ],
          ],
        },
      }}
      components={{
        a: (element) => (
          <Link
            {...element}
            className={clsx(
              element.className,
              "text-blue-600 dark:text-blue-300",
            )}
          />
        ),
        h1: (element) => <Heading {...element} level={1} />,
        h2: (element) => <Heading {...element} level={2} />,
        h3: (element) => <Heading {...element} level={3} />,
        h4: (element) => <Heading {...element} level={4} />,
        h5: (element) => <Heading {...element} level={5} />,
        h6: (element) => <Heading {...element} level={6} />,
        blockquote: (element) => (
          <blockquote
            {...element}
            className={clsx(
              element.className,
              "border-l-2 border-default-500 pl-2 italic text-medium",
              SPACE,
            )}
          />
        ),
        ul: (element) => (
          <ul
            {...element}
            className={clsx(
              element.className,
              "list-disc list-outside pl-4 my-1 last:my-0 markdown-list",
            )}
          />
        ),
        ol: (element) => (
          <ol
            {...element}
            className={clsx(
              element.className,
              "list-decimal list-outside pl-4 my-1 last:my-0 markdown-list",
            )}
          />
        ),
        li: (element) => (
          <li
            {...element}
            className={clsx(
              element.className,
              "text-medium font-light my-1 last:my-0 markdown-list-item",
            )}
          />
        ),
        strong: (element) => (
          <strong
            {...element}
            className={clsx(element.className, "font-semibold")}
          />
        ),
        callout: (element) => (
          <Callout {...element} className={clsx(element.className, SPACE)} />
        ),
        code: (element) => {
          return <Code {...element} />;
        },
        pre: (element) => {
          if (element["data-language"] === "mermaid")
            return (
              <Mermaid
                source={element.children.props.children
                  .map((child: any) =>
                    typeof child === "string"
                      ? child
                      : child.props?.children
                        ? child.props?.children?.props?.children
                        : child,
                  )
                  .join("")}
              />
            );

          return (
            <pre {...element.children.props}>
              <ButtonCopy
                className="absolute top-2.5 right-2 z-1"
                content={element.children.props.children}
              />
              {element.children.props.children}
            </pre>
          );
        },
        p: (element) => {
          const children = Children.toArray(element.children);
          const isHaveOnlyImage =
            children.length === 1 &&
            isValidElement(children[0]) &&
            typeof (children[0] as any).props?.src === "string" &&
            typeof (children[0] as any).props?.alt === "string";

          if (isHaveOnlyImage) return element.children;

          return (
            <p
              {...element}
              {...p}
              className={clsx(
                element.className,
                "font-light text-medium leading-6",
                SPACE,
                p?.className,
              )}
            />
          );
        },
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
