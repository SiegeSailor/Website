import { Card, Divider } from "@heroui/react";
import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { getProfile } from "@/helper/document";
import { getSlugByTitle } from "@/helper/article";
import Heading from "@/component/Heading";
import ListboxContents, { IDENTIFIER } from "@/component/ListboxContents";
import Markdown from "@/component/Markdown";
import ModalImage from "@/component/ModalImage";

export const metadata: Metadata = {
  title: generateTitle("Profile"),
};

export default async function () {
  const { content, metadata } = await getProfile();

  return (
    <section className={clsx("max-w-[1280px] mx-auto p-4")}>
      <div
        className={clsx(
          "gap-12 grid grid-cols-1 md:grid-cols-12 gird-rows-1",
          "w-full"
        )}
      >
        <div
          id={IDENTIFIER}
          className={clsx(
            "md:col-span-8 lg:col-span-9",
            "max-h-[calc(100vh-12rem)] overflow-y-auto"
          )}
        >
          <div className="flex flex-col gap-2 mb-16">
            <Heading
              level={1}
              id={getSlugByTitle(metadata.title)}
              // className="text-xl !font-bold"
            >
              {metadata.title}
            </Heading>
            <div
              className={clsx(
                "flex flex-wrap gap-1 items-center",
                "text-nowrap font-normal text-sm",
                "opacity-60"
              )}
            >
              <div className={clsx("w-64")}>
                <ModalImage source={metadata.picture} alt={metadata.title} />
              </div>
            </div>
            <Divider className="mt-4" />
            <div className="my-2">
              <Markdown source={metadata.description} />
            </div>
            <Divider />
          </div>

          <article>
            <Markdown source={content} />
          </article>
        </div>
        <div
          className={clsx(
            "hidden md:block md:col-span-4 lg:col-span-3",
            "max-h-[calc(100vh-12rem)] overflow-y-auto",
            "p-1"
          )}
        >
          {[
            <Card shadow="sm">
              <ListboxContents anchors={metadata.anchors} />
            </Card>,
            // <Card shadow="sm">
            //   <ListboxArticles date={metadata.date} articles={articles} />
            // </Card>,
          ].map((item, index) => (
            <div key={index} className="mb-4">
              {item}
            </div>
          ))}
        </div>
        <span>
          Last Modified on{" "}
          {metadata.statistics.mtime.toISOString().split("T")[0]}
        </span>
      </div>
    </section>
  );
}
