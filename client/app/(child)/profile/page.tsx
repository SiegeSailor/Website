import { Metadata } from "next";

import { generateTitle } from "@/helper";

export const metadata: Metadata = {
  title: generateTitle("Profile"),
};

export default function () {
  return <section></section>;
}
