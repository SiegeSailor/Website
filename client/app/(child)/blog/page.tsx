import React from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import clsx from "clsx";

import { getArticles } from "@/file";
import Link from "@/component/Link";
import Markdown from "@/component/Markdown";
import ScrollShadowTags from "@/component/ScrollShadowTags";

export default async function () {
  const articles = await getArticles();

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] p-4">
      {articles.map((article) => {
        return (
          <Card key={article.filename} className="p-2">
            <CardHeader>
              <div className="flex flex-col gap-1">
                <p
                  className={clsx(
                    "text-foreground dark:text-background",
                    "opacity-60",
                    "font-normal text-sm text-left"
                  )}
                >
                  {article.metadata.date}
                </p>
                <h3 className="text-xl font-medium">
                  {article.metadata.title}
                </h3>
              </div>
            </CardHeader>

            <CardBody>
              <Markdown source={article.metadata.description} />
            </CardBody>

            <CardFooter>
              <div className="flex justify-between items-center gap-2 w-full">
                <ScrollShadowTags
                  tags={article.metadata.tags}
                  propsChip={{
                    className: "text-foreground",
                  }}
                  propsScrollShadow={{ className: "w-full flex-grow" }}
                />
                <div className="text-nowrap">
                  <Link
                    href={`/blog/${article.metadata.date}`}
                    className="font-normal"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
