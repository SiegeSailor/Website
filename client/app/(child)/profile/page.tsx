import { Button, Card, Divider } from "@heroui/react";
import { GithubIcon, LinkedinIcon, DownloadCloudIcon } from "lucide-react";
import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { getProfile } from "@/helper/document";
import { getSlugByTitle } from "@/helper/article";
import Heading from "@/component/Heading";
import ListboxContents, { IDENTIFIER } from "@/component/ListboxContents";
import Markdown from "@/component/Markdown";
import ModalImage from "@/component/ModalImage";
import Link from "@/component/Link";

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
            <ModalImage source={metadata.picture} alt={metadata.title} />
            <Heading
              level={1}
              id={getSlugByTitle(metadata.title)}
              className="!font-semibold !text-5xl sm:!text-6xl !mb-2"
            >
              {metadata.title}
            </Heading>
            <div
              className={clsx(
                "flex gap-1 flex-wrap items-center",
                "text-nowrap font-light text-2xl leading-6",
                "mb-2"
              )}
            >
              {metadata.headlines.map((headline, index) => (
                <span key={headline}>
                  {headline}
                  {index < metadata.headlines.length - 1 && " · "}
                </span>
              ))}
            </div>
            <div className={clsx("flex gap-2 items-center")}>
              {[
                {
                  Icon: GithubIcon,
                  link: metadata.media.github,
                  label: "GitHub",
                },
                {
                  Icon: LinkedinIcon,
                  link: metadata.media.linkedin,
                  label: "LinkedIn",
                },
                {
                  Icon: DownloadCloudIcon,
                  link: metadata.media.resume,
                  label: "Resume",
                },
              ].map(({ Icon, link, label }) => {
                return (
                  <Button
                    startContent={<Icon size="1rem" strokeWidth="0.1rem" />}
                    variant="bordered"
                    color="default"
                    size="sm"
                    key={label}
                  >
                    <Link
                      href={link}
                      color="foreground"
                      underline="none"
                      className="font-normal"
                      size="sm"
                    >
                      {label}
                    </Link>
                  </Button>
                );
              })}
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

          <Divider className="my-4" />
          <div
            className={clsx(
              "flex gap-1 items-center",
              "text-nowrap font-normal text-sm",
              "opacity-60"
            )}
          >
            <span>
              Last Modified on{" "}
              {metadata.statistics.mtime.toISOString().split("T")[0]}
            </span>
          </div>
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
      </div>
    </section>
  );
}
