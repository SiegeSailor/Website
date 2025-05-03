import React from "react";
import * as next from "next";

import { generateTitle } from "@/helper";

export const metadata: next.Metadata = {
  title: generateTitle("Blog"),
};

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
