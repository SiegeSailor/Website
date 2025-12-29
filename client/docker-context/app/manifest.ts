import type { MetadataRoute } from "next";

import { globalMetadata } from "@/settings/head";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // The value is `--heroui-background`.
    background_color: "hsl(0 0% 100%)",
    description: globalMetadata.description?.toString(),
    display: "standalone",
    icons: [
      {
        src: String(globalMetadata.icons),
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    name: globalMetadata.title?.toString(),
    orientation: "natural",
    short_name: globalMetadata.title?.toString(),
    start_url: "/",
    // The value is `--heroui-primary`.
    theme_color: "hsl(212.01999999999998 100% 46.67%)",
  };
}
