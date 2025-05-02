"use client";

import React, { useState, useEffect } from "react";
import { Tabs, Tab, Progress } from "@heroui/react";
import { motion } from "framer-motion";

import CardTab from "@/component/CardProject/CardTab";

export default function ({ items }: { items: string[] }) {
  const [indexItem, setIndexItem] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((previous) => {
        return previous >= 100 ? 0 : previous + 0.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [items.length]);

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
        selectedKey={items[indexItem]}
        radius="md"
        size="md"
        onSelectionChange={(key) => {
          setIndexItem(items.indexOf(key.toString()));
          setProgress(0);
        }}
      >
        {items.map((item) => {
          return (
            <Tab key={item} title={item}>
              <CardTab isLeaving={progress >= 95} title={item} />
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
