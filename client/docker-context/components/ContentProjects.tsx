"use server";

import type { ComponentProps } from "react";
import { CardHeader, Chip, Card, CardBody, CardFooter } from "@heroui/react";
import clsx from "clsx";

import { PROJECTS } from "@/settings/home";
import { STAGE_TO_COLOR } from "@/settings/constant";
import DivisionTitle from "@/components/DivisionTitle";
import Link from "@/components/Link";
import Markdown from "@/components/Markdown";

export default async function ({ ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={clsx("flex flex-col gap-12 text-center", props.className)}
    >
      <DivisionTitle
        description=" Here, you'll find a selection of my side projects. Each project reflects my passion for building, learning, and solving real-world problems through technology."
        title="What I'm Building"
      />

      <div className="gap-4 grid grid-cols-12 grid-rows-1">
        {PROJECTS.map((project) => {
          const isPrototype = project.stage === "Prototype";

          return (
            <Card
              key={project.title}
              className="border-background dark:border-default-100 border-2 bg-default-50 col-span-6 sm:col-span-3 h-[300px]"
            >
              <CardHeader className="flex flex-col justify-center items-center gap-2">
                <Chip
                  size="md"
                  variant="bordered"
                  color={STAGE_TO_COLOR[project.stage]}
                >
                  {project.stage}
                </Chip>
                <h4 className="text-lg sm:text-medium md:text-lg font-medium line-clamp-2 min-h-12 w-11/12">
                  {project.title}
                </h4>
              </CardHeader>
              <CardBody className="py-0">
                <Markdown
                  source={project.description}
                  p={{
                    className: clsx(
                      "text-foreground/50 text-center",
                      !isPrototype ? "line-clamp-5" : "line-clamp-7"
                    ),
                  }}
                />
              </CardBody>
              {!isPrototype && (
                <CardFooter className="flex justify-center">
                  <Link href={project.href}>Read More</Link>{" "}
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
