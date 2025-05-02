"use client";

import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { motion } from "framer-motion";
import clsx from "clsx";

import CardTab from "@/component/CardProject/CardTab";

export default function () {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs aria-label="Options" placement="bottom">
        {[{ title: "AT" }, { title: "BT" }, { title: "CT" }].map((item) => {
          return (
            <Tab key={item.title} title={item.title}>
              <CardTab title={item.title} />
            </Tab>
          );
        })}
      </Tabs>
    </motion.div>
  );
}
