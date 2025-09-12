"use server";

import { ComponentProps } from "react";
import { CardHeader, Chip, Card, CardBody, CardFooter } from "@heroui/react";
import clsx from "clsx";

import { PROJECTS } from "@/setting/home";
import { STAGE_COLOR } from "@/setting/site";
import Chart from "./Chart";
import Link from "@/component/Link";
import Markdown from "@/component/Markdown";

export default async function ({ ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={clsx("flex flex-col gap-12 text-center", props.className)}
    >
      <div className="flex flex-col gap-2 mx-auto max-w-compact">
        <h4 className="text-2xl sm:text-3xl font-light text-default-600">
          What I'm Building
        </h4>
        <p className="text-medium text-foreground/50">
          Here, you'll find a selection of my side projects. Each project
          reflects my passion for building, learning, and solving real-world
          problems through technology.
        </p>
      </div>

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
                  color={STAGE_COLOR[project.stage]}
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

      <div className="flex flex-col gap-6 w-full max-w-compact mx-auto">
        <p className="text-medium text-foreground/50">
          See the timeline of my projects development, as illustrated.
        </p>
        <div className="h-[300px]">
          <Chart />
        </div>
      </div>
    </div>
  );
}
