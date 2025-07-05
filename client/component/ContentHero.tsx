import { Button } from "@heroui/react";
import clsx from "clsx";

import { AUTHOR } from "@/setting/site";
import { ROUTE_ICON } from "@/setting/icon";
import Link from "@/component/Link";
import TypingText from "@/component/TypingText";

export default async function ({
  className,
}: Readonly<{ className?: string }>) {
  const Icon = ROUTE_ICON["/profile"];

  return (
    <div className={clsx("text-left w-full", className)}>
      <div className="space-y-2">
        <h2
          className={clsx(
            "text-3xl sm:text-4xl",
            "font-light text-default-600",
            "flex flex-col gap-1"
          )}
        >
          <span className="text-nowrap">
            Hi, I'm <span className="text-foreground">{AUTHOR}</span>!
          </span>
          <span className="flex flex-col sm:block sm:text-nowrap">
            <span>I’m a Senior</span>
            <span className="h-9 sm:h-auto sm:px-2 font-light text-primary">
              <TypingText
                words={["Software", "Full-Stack", "DevOps"]}
                speedDeleting={125}
                speedTyping={100}
                timePause={2000}
              />
            </span>
          </span>
          <span>
            <span className="pr-3">Engineer at</span>
            <Link
              className="text-2xl sm:text-3xl text-default-600"
              href="https://www.coopersurgical.com/"
            >
              CooperSurgical
            </Link>
            .
          </span>
        </h2>
      </div>
      <div className="gap-4 grid grid-cols-12 grid-rows-1 mt-8">
        <Link
          href="/profile"
          className="col-span-12 sm:col-span-4"
          underline="none"
        >
          <Button
            startContent={<Icon size="1.45rem" />}
            size="lg"
            radius="full"
            variant="shadow"
            color="primary"
            className="w-full"
          >
            Let's Connect
          </Button>
        </Link>
        <p className="text-medium text-gray-600 col-span-12 sm:col-span-8">
          Browse my website and feel free to drop me a line if you’d like to
          exchange insights or chat about industry trends.
        </p>
      </div>
    </div>
  );
}
