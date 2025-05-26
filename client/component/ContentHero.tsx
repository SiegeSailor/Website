import { Button } from "@heroui/react";
import { LuRocket } from "react-icons/lu";
import NextLink from "next/link";

import Link from "@/component/Link";
import TypingText from "@/component/TypingText";

export default function () {
  return (
    <div className="text-left w-full">
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-light text-default-600 flex flex-col">
          <span className="text-nowrap">
            Hi, I'm <span className="text-foreground">Jin Yu Zhang</span>!
          </span>
          <span className="text-nowrap">
            I’m a
            <span className="font-light text-primary px-2">
              <TypingText
                words={["Software", "Full-Stack", "DevOps"]}
                speedDeleting={125}
                speedTyping={100}
                timePause={2000}
              />
            </span>
            Engineer
          </span>
          <span className="text-nowrap">
            at
            <Link
              className="px-2 text-2xl sm:text-3xl text-default-600"
              isExternal
              showAnchorIcon
              underline="always"
              href="https://www.coopersurgical.com/"
            >
              CooperSurgical.
            </Link>
          </span>
        </h2>
      </div>
      <div className="gap-4 grid grid-cols-12 grid-rows-1 mt-8">
        <NextLink
          href="mailto:siegesailor@gmail.com?subject=Query from Jin YU Zhang's Website"
          target="_blank"
          className="col-span-12 sm:col-span-4"
        >
          <Button
            startContent={<LuRocket size="1.45rem" />}
            size="lg"
            radius="full"
            variant="shadow"
            color="primary"
            className="w-full"
          >
            Open to Work
          </Button>
        </NextLink>
        <p className="text-gray-600 col-span-12 sm:col-span-8">
          Feel free to explore my portfolio and reach out — I am actively
          looking for new opportunities.
        </p>
      </div>
    </div>
  );
}
