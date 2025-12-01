import { ComponentProps } from "react";
import clsx from "clsx";

import CardExperience from "./CardExperience";
import CardPublication from "./CardPublication";
import CardSkill from "./CardSkill";
import CardSummary from "./CardSummary";
import Link from "@/component/Link";

export default function ({ ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={clsx("flex flex-col gap-12", props.className)}>
      <div className="w-full flex flex-col gap-2 max-w-compact mx-auto">
        <h4 className="text-2xl sm:text-3xl font-light text-default-600 w-full text-left">
          First Glance at Me
        </h4>
        <p className="w-full text-medium text-foreground/50">
          A brief overview of my professional background, skills, and
          accomplishments. You can find more details in my{" "}
          <Link href="/profile">Profile</Link>.
        </p>
      </div>

      <div className="gap-4 grid grid-cols-12 grid-rows-1 w-full max-w-compact mx-auto">
        <CardSummary
          className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
          classNameScrollHeight="h-[228px]"
        />
        <CardExperience
          className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
          classNameScrollHeight="h-[228px]"
        />
        <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
        <CardPublication className="col-span-12 sm:col-span-6 md:col-span-12 h-[300px]" />
      </div>
    </div>
  );
}
