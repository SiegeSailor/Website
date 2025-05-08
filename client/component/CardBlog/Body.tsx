"use client";

import React from "react";
import { Image, Progress, Spacer } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import NextImage from "next/image";

import { getArticles } from "@/file";
import FloatingDivision from "@/component/FloatingDivision";
import ScrollShadowChips from "@/component/ScrollShadowChips";

export default function ({
  articles,
}: {
  articles: Awaited<ReturnType<typeof getArticles>>;
}) {
  const [indexArticle, setIndexArticle] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((previous) => {
        return previous >= 100 ? 0 : previous + 0.5;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (progress === 100)
      setIndexArticle((previous) => (previous + 1) % articles.length);
  }, [progress]);

  return (
    <div className="relative w-full h-full">
      <Image
        alt="Weston Cog"
        as={NextImage}
        className={clsx(
          "z-0 w-full h-full object-cover",
          "grayscale brightness-50 contrast-100"
        )}
        src="/image/Weston-Cog-Google.png"
        loading="eager"
        priority
        width={640}
        height={480}
      />
      {articles.map((article, index) => {
        const { title, date, tags } = article.metadata;

        return (
          <AnimatePresence key={title}>
            {index === indexArticle && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FloatingDivision
                  direction="vertical"
                  duration={2}
                  className={clsx(
                    "absolute top-28 left-4",
                    "z-10 justify-start"
                  )}
                  style={{ width: "calc(100% - 1.5rem)" }}
                >
                  <p
                    className={clsx(
                      "text-background dark:text-foreground",
                      "opacity-60",
                      "font-normal text-sm text-left"
                    )}
                  >
                    {date}
                  </p>
                  <Spacer y={1} />
                  <p
                    className={clsx(
                      "text-background dark:text-foreground",
                      "font-medium text-xl text-left",
                      "text-wrap w-full"
                    )}
                  >
                    {title}
                  </p>
                  <Spacer y={4} />
                  <ScrollShadowChips
                    tags={tags}
                    propsScrollShadow={{ className: "mt-2" }}
                  />
                </FloatingDivision>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
      <Progress
        aria-label="Loading..."
        value={progress}
        color="default"
        size="sm"
        disableAnimation
        className="z-10 absolute bottom-3 w-full px-3 h-1"
      />
    </div>
  );
}
