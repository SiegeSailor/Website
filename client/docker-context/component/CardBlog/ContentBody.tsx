"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Progress, Spacer } from "@heroui/react";
import { useEffect, useState } from "react";

import { useArticleStore } from "@/store/article";
import DivisionFloating from "@/component/DivisionFloating";
import ImageBackground from "@/component/ImageBackground";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

const DURATION = 4000 as const;
const PROGRESS_INTERVAL = 20 as const;
const PROGRESS_INCREMENT = 0.5 as const;
const PROGRESS_MAX = (DURATION / PROGRESS_INTERVAL) * PROGRESS_INCREMENT;

export default function () {
  const articles = useArticleStore((state) => state.articles).slice(4);

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
      <ImageBackground
        alt="Photo by Kevin Ku on Unsplash"
        src="/image/Glasses-Code.jpg"
      />
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          key={indexArticle}
        >
          <DivisionFloating
            direction="vertical"
            duration={2}
            className="absolute top-20 left-4 z-10 justify-start w-11/12"
          >
            <p className="text-background/50 dark:text-foreground/50 font-normal text-small text-left flex gap-1 items-center text-nowrap">
              <span>{date}</span>·<span>{category}</span>
            </p>
            <Spacer y={1} />
            <h4 className="text-background dark:text-foreground font-light text-2xl text-left text-wrap w-full">
              {title}
            </h4>
            <Spacer y={4} />
            <ScrollShadowTechnologies
              isLink={false}
              technologies={technologies}
            />
          </DivisionFloating>
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
