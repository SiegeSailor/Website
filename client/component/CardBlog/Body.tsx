"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Progress, Spacer } from "@heroui/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import NextImage from "next/image";

import { getArticles } from "@/helper/article";
import FloatingDivision from "@/component/FloatingDivision";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

export default function ({
  articles,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
}>) {
  const [indexArticle, setIndexArticle] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((previous) => {
        return previous >= 100 ? 0 : previous + 0.5;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100)
      setIndexArticle((previous) => (previous + 1) % articles.length);
  }, [progress]);

  return (
    <div className="relative w-full h-full">
      <NextImage
        alt="Photo by Kevin Ku on Unsplash"
        className={clsx(
          "z-0 w-full h-full object-cover",
          "brightness-75 contrast-100"
        )}
        src="/image/Glasses-Code.jpg"
        loading="eager"
        priority
        width={640}
        height={480}
      />
      {articles.map((article, index) => {
        const { title, date, technologies, category } = article.metadata;

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
                    "absolute top-24 left-4",
                    "z-10 justify-start"
                  )}
                  style={{ width: "calc(100% - 1.5rem)" }}
                >
                  <p
                    className={clsx(
                      "text-background dark:text-foreground",
                      "opacity-60",
                      "font-normal text-sm text-left",
                      "flex gap-1 items-center text-nowrap"
                    )}
                  >
                    <span>{date}</span>·<span>{category}</span>
                  </p>
                  <Spacer y={1} />
                  <p
                    className={clsx(
                      "text-background dark:text-foreground",
                      "font-light text-2xl text-left",
                      "text-wrap w-full"
                    )}
                  >
                    {title}
                  </p>
                  <Spacer y={4} />
                  <ScrollShadowTechnologies technologies={technologies} />
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
