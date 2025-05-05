import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Chip,
  Divider,
  ScrollShadow,
} from "@heroui/react";
import clsx from "clsx";

import { getArticles } from "@/file";
import Markdown from "@/component/Markdown";
import ScrollShadowTags from "@/component/ScrollShadowTags";

export default async function () {
  const articles = await getArticles();

  return (
    <div className="gap-2 flex flex-col p-2 w-full">
      {articles.map((article) => {
        return (
          <Card key={article.filename} className="w-full h-[300px]">
            <CardHeader>
              <div className="flex flex-col">
                <p className="text-md">{article.metadata.title}</p>
                <p className="text-small text-default-500">
                  {article.metadata.date}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Markdown source={article.metadata.description} />
            </CardBody>
            {/* <Divider /> */}
            <CardFooter>
              <ScrollShadowTags
                tags={article.metadata.tags}
                className="text-foreground dark:text-background"
              />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
