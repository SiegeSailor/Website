import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { AUTHOR } from "@/setting/site";
import Markdown from "@/component/Markdown";
import Heading from "@/component/Heading";
import { getProfile } from "@/helper/document";

export const metadata: Metadata = {
  title: generateTitle("Profile"),
};

export default async function () {
  const { profile, statistics } = await getProfile();

  return (
    <section className={clsx("max-w-[1280px] mx-auto p-4")}>
      <div className="flex flex-col gap-2 mb-16">
        <div className={clsx("text-nowrap font-normal text-sm", "opacity-60")}>
          Last Modified on {statistics.mtime.toISOString().split("T")[0]}
        </div>
        <Heading level={2}>{AUTHOR}</Heading>
      </div>

      <article>
        <Markdown source={profile} />
      </article>
    </section>
  );
}
