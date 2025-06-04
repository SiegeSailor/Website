import { ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { getArticleByDate } from "@/helper/article";
import Link from "@/component/Link";

export type TParams = Readonly<{ slug: string }>;

export default async function ({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<TParams> }>) {
  const { slug } = await params;
  const { metadata } = await getArticleByDate(slug);

  return (
    <div className="w-full h-full">
      <div
        className={clsx(
          "max-w-[880px] mx-auto p-4",
          "gap-12 grid grid-cols-12 gird-rows-1"
        )}
      >
        <div className={clsx("col-span-12 md:col-span-8")}>
          <ScrollShadow className="h-[80vh]" size={40}>
            {children}
          </ScrollShadow>
        </div>
        <div className="hidden md:flex flex-col gap-2 md:col-span-4">
          {[
            { level: 1, title: metadata.title, identifier: metadata.title },
            ...metadata.anchors,
          ].map((anchor) => {
            return (
              <Link
                key={anchor.identifier}
                href={`#${anchor.identifier}`}
                className={
                  {
                    1: "pl-0",
                    2: "pl-4",
                    3: "pl-8",
                    4: "pl-12",
                    5: "pl-16",
                    6: "pl-20",
                  }[anchor.level]
                }
              >
                {anchor.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
