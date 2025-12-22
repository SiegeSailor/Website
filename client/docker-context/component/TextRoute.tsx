"use client";

import { useRoute } from "@/helper/client/history";

export default function () {
  const { route } = useRoute();

  return route;
}
