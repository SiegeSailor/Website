"use server";

import { Button } from "@heroui/react";
import type { ComponentProps } from "react";
import clsx from "clsx";

import { AUTHOR } from "@/settings/constant";
import { ROUTE_TO_ICON } from "@/settings/icons";
import Link from "@/components/Link";
import TextTyping from "@/components/TextTyping";

const IconProfile = ROUTE_TO_ICON["/profile"];

export default async function ({ ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={clsx("text-left", props.className)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl font-light text-default-400 flex flex-col gap-1">
          <span className="text-nowrap">
            Hi, I'm{" "}
            <span className="text-foreground font-normal">{AUTHOR}</span>.
          </span>
          <span className="flex flex-col sm:block sm:text-nowrap">
            <span>I’m a Senior</span>
            <span className="h-9 sm:h-auto sm:px-2 font-normal text-primary">
              <TextTyping
                words={["Software", "Full-Stack", "DevOps"]}
                speedDeleting={125}
                speedTyping={50}
                timePause={1500}
              />
            </span>
          </span>
          <span>
            <span className="pr-3">Engineer at</span>
            <span className="text-nowrap">
              <Link
                className="text-3xl sm:text-4xl font-light text-default-400"
                href="https://www.coopersurgical.com/"
              >
                CooperSurgical
              </Link>
              .
            </span>
          </span>
        </h2>
      </div>
      <div className="gap-4 grid grid-cols-12 grid-rows-1 mt-8">
        <Link
          href="/profile#jin-yu-zhang"
          className="col-span-12 sm:col-span-4"
          underline="none"
        >
          <Button
            className="w-full"
            color="primary"
            radius="full"
            size="lg"
            startContent={<IconProfile size="1.45rem" />}
            variant="shadow"
          >
            Let's Connect
          </Button>
        </Link>
        <p className="text-medium text-foreground/50 col-span-12 sm:col-span-8">
          Browse my website and feel free to drop me a line if you’d like to
          exchange insights or chat about industry trends.
        </p>
      </div>
    </div>
  );
}
