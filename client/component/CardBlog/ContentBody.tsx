"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Progress, Spacer } from "@heroui/react";
import { useEffect, useState } from "react";
import NextImage from "next/image";

import { getArticles } from "@/helper/server/article";
import FloatingDivision from "@/component/FloatingDivision";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

const DURATION = 4000;
const PROGRESS_INTERVAL = 20;
const PROGRESS_INCREMENT = 0.5;
const PROGRESS_MAX = (DURATION / PROGRESS_INTERVAL) * PROGRESS_INCREMENT;

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
        return previous >= PROGRESS_MAX ? 0 : previous + PROGRESS_INCREMENT;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === PROGRESS_MAX)
      setIndexArticle((previous) => (previous + 1) % articles.length);
  }, [progress, articles.length]);

  const { title, date, technologies, category } =
    articles[indexArticle].metadata;

  return (
    <div className="relative w-full h-full">
      <NextImage
        alt="Photo by Kevin Ku on Unsplash"
        className="z-0 w-full h-full object-cover brightness-75 contrast-100 grayscale"
        src="/image/Glasses-Code.jpg"
        loading="eager"
        priority
        width={640}
        height={480}
      />
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={indexArticle}
        >
          <FloatingDivision
            direction="vertical"
            duration={2}
            className="absolute top-20 left-4 z-10 justify-start w-11/12"
          >
            <p className="text-background dark:text-foreground opacity-60 font-normal text-sm text-left flex gap-1 items-center text-nowrap">
              <span>{date}</span>·<span>{category}</span>
            </p>
            <Spacer y={1} />
            <p className="text-background dark:text-foreground font-light text-2xl text-left text-wrap w-full">
              {title}
            </p>
            <Spacer y={4} />
            <ScrollShadowTechnologies technologies={technologies} />
          </FloatingDivision>
        </motion.div>
      </AnimatePresence>
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
