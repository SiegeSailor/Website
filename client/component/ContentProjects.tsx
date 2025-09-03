"use server";

import { ComponentProps } from "react";
import { CardHeader, Chip, Card, CardBody, CardFooter } from "@heroui/react";

import { PROJECTS } from "@/setting/home";
import { STAGE_COLOR } from "@/setting/site";
import Link from "@/component/Link";
import Markdown from "./Markdown";

export default async function ({ ...props }: ComponentProps<"div">) {
  return (
    <div {...props}>
      <div className="flex flex-col justify-center items-center gap-2 mx-auto mb-12 text-center max-w-compact">
        <h4 className="text-2xl sm:text-3xl font-light text-default-600">
          What I'm Building
        </h4>
        <p className="text-medium text-default-400">
          Here, you'll find a selection of my side projects. Each project
          reflects my passion for building, learning, and solving real-world
          problems through technology.
        </p>
      </div>

      <div className="gap-4 grid grid-cols-12 grid-rows-1">
        {PROJECTS.map((project) => {
          return (
            <Card
              key={project.title}
              className="border-background dark:border-default-100 border-2 bg-default-50 col-span-6 sm:col-span-3 h-[300px]"
            >
              <CardHeader className="flex flex-col justify-center items-center text-center gap-2">
                <Chip
                  size="md"
                  variant="bordered"
                  color={STAGE_COLOR[project.stage]}
                >
                  {project.stage}
                </Chip>
                <h4 className="text-lg sm:text-medium md:text-lg font-medium line-clamp-2 h-12 w-11/12">
                  {project.title}
                </h4>
              </CardHeader>
              <CardBody className="py-0">
                <Markdown
                  source={project.description}
                  p={{
                    className:
                      "text-foreground/50 text-medium font-normal line-clamp-5 text-center line-clamp-5",
                  }}
                />
              </CardBody>
              <CardFooter className="flex justify-center">
                <Link
                  href={project.href}
                  isDisabled={project.stage === "Development"}
                >
                  Read More
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
