import { MDXRemote } from "next-mdx-remote/rsc";
import clsx from "clsx";

import Link from "@/component/Link";
import CodeBlock from "@/component/CodeBlock";

export default function ({ source }: Readonly<{ source: string }>) {
  return (
    <MDXRemote
      source={source}
      components={{
        h1: (element) => (
          <h1
            {...element}
            className={clsx(element.className, "font-medium text-3xl pb-4")}
          />
        ),
        h2: (element) => (
          <h2
            {...element}
            className={clsx(element.className, "font-medium text-2xl pb-4")}
          />
        ),
        h3: (element) => (
          <h3
            {...element}
            className={clsx(element.className, "font-medium text-xl pb-4")}
          />
        ),
        h4: (element) => (
          <h4
            {...element}
            className={clsx(element.className, "font-medium text-lg pb-4")}
          />
        ),
        h5: (element) => (
          <h5
            {...element}
            className={clsx(element.className, "font-medium text-base pb-4")}
          />
        ),
        h6: (element) => (
          <h6
            {...element}
            className={clsx(element.className, "font-medium text-sm pb-4")}
          />
        ),
        blockquote: (element) => (
          <blockquote
            {...element}
            className={clsx(
              element.className,
              "border-l-2 border-default-500 pl-4 italic text-medium"
            )}
          />
        ),
        ul: (element) => (
          <ul
            {...element}
            className={clsx(
              element.className,
              "list-disc list-inside pl-4 text-medium"
            )}
          />
        ),
        ol: (element) => (
          <ol
            {...element}
            className={clsx(
              element.className,
              "list-decimal list-inside pl-4 text-medium"
            )}
          />
        ),
        li: (element) => (
          <li {...element} className={clsx(element.className, "text-medium")} />
        ),
        code: (element) => (
          <code
            {...element}
            className={clsx(
              element.className,
              "bg-default-200 dark:bg-default-700 rounded-md px-1 py-0.5 text-sm"
            )}
          />
        ),
        pre: (element) => <CodeBlock {...element.children.props} />,
        p: (element) => {
          const isCallout = Array.isArray(element.children)
            ? element.children[0].startsWith(":::") &&
              element.children[element.children.length - 1].endsWith(":::")
            : element.children.startsWith(":::") &&
              element.children.endsWith(":::");

          if (isCallout) {
            const contents: string[] = Array.isArray(element.children)
              ? element.children
              : [element.children];
            return (
              <div
                {...element}
                className={clsx(
                  element.className,
                  "bg-default-200 dark:bg-default-700 rounded-md px-4 py-2 mb-4"
                )}
              >
                {contents.map((content, index) => {
                  if (contents.length === 1) return content.slice(3, -3);
                  if (index === 0) return content.slice(3);
                  if (index === contents.length - 1)
                    return content.slice(0, -3);

                  return content;
                })}
              </div>
            );
          }

          return (
            <p
              {...element}
              className={clsx(
                element.className,
                "font-light text-medium pb-4 leading-6"
              )}
            />
          );
        },
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
