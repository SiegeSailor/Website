import { Button, Card, Divider, ScrollShadow } from "@heroui/react";
import { GithubIcon, LinkedinIcon, DownloadCloudIcon } from "lucide-react";
import { Metadata } from "next";

import { createPageTitle, getEntries } from "@/helper/utility";
import { getProfile } from "@/helper/server/document";
import { getSlugByTitle } from "@/helper/utility";
import DivisionSticky from "@/component/DivisionSticky";
import Heading from "@/component/Heading";
import Link from "@/component/Link";
import ListboxContents, { IDENTIFIER } from "@/component/ListboxContents";
import Markdown from "@/component/Markdown";
import ModalImage from "@/component/ModalImage";

export const metadata: Metadata = {
  title: createPageTitle("Profile"),
};

export default async function () {
  const { content, metadata } = await getProfile();

  return (
    <section className="max-w-content mx-auto p-4">
      <div className="gap-12 grid grid-cols-1 md:grid-cols-12 gird-rows-1 w-full">
        <div
          id={IDENTIFIER}
          className="md:col-span-8 lg:col-span-9 overflow-y-auto"
        >
          <div className="flex flex-col gap-2 mb-16">
            <ModalImage
              source={metadata.picture}
              alt={metadata.title}
              propsImageThumbnail={{ className: "grayscale" }}
              propsImageModal={{ className: "grayscale" }}
            />

            <Heading level={1} id={getSlugByTitle(metadata.title)}>
              {metadata.title}
            </Heading>
            <div className="flex flex-wrap gap-1 items-center text-nowrap font-normal text-sm text-foreground/50">
              <span>{metadata.createdOn} (Created)</span>
              <span>·</span>
              <span>{metadata.updatedOn} (Updated)</span>
            </div>
            <div className="flex flex-wrap gap-1 items-center text-nowrap font-light text-xl leading-6 mb-2">
              {metadata.headlines.map((headline, index) => (
                <span key={headline}>
                  {headline}
                  {index < metadata.headlines.length - 1 && " /"}
                </span>
              ))}
            </div>

            <div className="gap-2 grid grid-cols-12 mt-4">
              {getEntries(metadata.status).map(([key, value]) => {
                return (
                  <Card
                    shadow="none"
                    key={key}
                    className="col-span-12 sm:col-span-6 lg:col-span-3 border-1 border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 flex flex-col gap-1"
                  >
                    <p className="text-small text-foreground/50 capitalize">
                      {key}
                    </p>
                    <p className="text-medium">{value}</p>
                  </Card>
                );
              })}
            </div>
            <div className="flex gap-2 items-center">
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
        </div>
        <DivisionSticky className="hidden md:block md:col-span-4 lg:col-span-3 p-1 max-h-[calc(100vh-8rem)]">
          <Card shadow="sm">
            <ListboxContents anchors={metadata.anchors} />
          </Card>
        </DivisionSticky>
      </div>
    </section>
  );
}
