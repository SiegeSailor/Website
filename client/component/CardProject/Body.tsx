"use client";

import { motion } from "framer-motion";
import { Tabs, Tab, Progress } from "@heroui/react";
import { useState, useEffect } from "react";

import { PROJECT } from "@/setting/home";
import CardTab from "@/component/CardProject/CardTab";

export default function ({ items }: Readonly<{ items: typeof PROJECT }>) {
  const [indexItem, setIndexItem] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((previous) => {
        return previous >= 100 ? 0 : previous + 0.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100)
      setIndexItem((previous) => (previous + 1) % items.length);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-2 justify-end h-full"
    >
      <Tabs
        aria-label="Options"
        placement="bottom"
        selectedKey={items[indexItem].title}
        radius="md"
        size="md"
        onSelectionChange={(key) => {
          setIndexItem(items.map((item) => item.title).indexOf(key.toString()));
          setProgress(0);
        }}
      >
        {items.map((item) => {
          return (
            <Tab key={item.title} title={item.title}>
              <CardTab isLeaving={progress >= 95} item={item} />
            </Tab>
          );
        })}
      </Tabs>
      <Progress
        aria-label="Loading..."
        value={progress}
        color="default"
        size="sm"
        disableAnimation
      />
    </motion.div>
  );
}
