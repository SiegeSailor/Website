import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Chip } from "@heroui/react";
import { getArticles } from "@/file";

export default async function () {
  const articles = await getArticles();

  return (
    <div className="gap-2 grid grid-cols-12 grid-rows-2 p-2 w-full">
      {articles.map((article) => {
        return (
          <Card
            key={article.filename}
            className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full"
          >
            <CardHeader className="absolute z-20 top-0 flex-col items-start">
              <div className="items-start z-20">
                <Chip
                  variant="bordered"
                  size="sm"
                  className="p-4 bg-background"
                >
                  <span className="font-semibold">
                    {article.metadata.title}
                  </span>
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="mt-12">
              <p>{article.metadata.description}</p>
            </CardBody>
            <CardFooter className="mt-12">
              <p>{article.metadata.date}</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
