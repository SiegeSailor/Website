"use client";

import React from "react";
import { Chip, Image, ScrollShadow, Progress } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import NextImage from "next/image";

import { getArticles } from "@/file";
import MotionFloating from "@/component/MotionFloating";

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
                <MotionFloating
                  direction="vertical"
                  duration={2}
                  className={clsx(
                    "absolute top-1/2 left-4",
                    "w-full z-10 justify-start"
                  )}
                >
                  <p
                    className={clsx(
                      "text-background dark:text-foreground",
                      "opacity-60",
                      "font-bold text-sm text-left"
                    )}
                  >
                    {date}
                  </p>
                  <p
                    className={clsx(
                      "text-background dark:text-foreground",
                      "font-medium text-xl text-left"
                    )}
                  >
                    {title}
                  </p>
                  <ScrollShadow
                    className="flex gap-2 mt-2"
                    orientation="horizontal"
                  >
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        variant="bordered"
                        className={clsx(
                          "text-background dark:text-foreground",
                          "border-default-400 dark:border-default-500",
                          "font-medium text-sm text-left"
                        )}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </ScrollShadow>
                </MotionFloating>
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
