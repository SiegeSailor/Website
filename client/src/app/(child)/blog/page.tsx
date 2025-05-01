import React from "react";
import * as next from "next";

import { concatTitle } from "@/helper";

export const metadata: next.Metadata = {
  title: concatTitle("Blog"),
};

export default function () {
  return <section></section>;
}
