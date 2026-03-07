"use client";

import { useRoute } from "@/helpers/client/history";

export default function () {
  const { route } = useRoute();

  return route;
}
