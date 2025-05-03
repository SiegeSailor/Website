import React from "react";
import * as next from "next";

import { generateTitle } from "@/helper";

export const metadata: next.Metadata = {
  title: generateTitle("Project"),
};

export default function () {
  return <section></section>;
}
