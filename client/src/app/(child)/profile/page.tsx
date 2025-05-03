import React from "react";
import * as next from "next";

import { generateTitle } from "@/helper";

export const metadata: next.Metadata = {
  title: generateTitle("Profile"),
};

export default function () {
  return <section></section>;
}
