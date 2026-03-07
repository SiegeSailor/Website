import type { ComponentProps } from "react";
import clsx from "clsx";

import DivisionTitle from "@/components/DivisionTitle";
import Link from "@/components/Link";

import CardExperience from "./CardExperience";
import CardPublication from "./CardPublication";
import CardSkill from "./CardSkill";
import CardSummary from "./CardSummary";

export default function ({ ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={clsx("flex flex-col gap-12", props.className)}>
      <DivisionTitle
        description={
          <>
            A brief overview of my professional background, skills, and
            accomplishments. You can find more details in my{" "}
            <Link href="/profile">Profile</Link>.
          </>
        }
        title="First Glance at Me"
      />

      <div className="gap-4 grid grid-cols-12 grid-rows-1 w-full max-w-compact mx-auto">
        <CardSummary
          className="col-span-12 sm:col-span-6 md:col-span-4 h-75"
          classNameScrollHeight="h-[228px]"
        />
        <CardExperience
          className="col-span-12 sm:col-span-6 md:col-span-4 h-75"
          classNameScrollHeight="h-[228px]"
        />
        <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-75" />
        <CardPublication className="col-span-12 sm:col-span-6 md:col-span-12 h-75" />
      </div>
    </div>
  );
}
