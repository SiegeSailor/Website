import type { MetadataRoute } from "next";

import { ROUTES } from "@/settings/constant";
import { createGlobalMetadata } from "@/settings/heads";
import { getSite } from "@/helpers/server/content";

export const revalidate = false;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { site } = await getSite();
  const metadata = createGlobalMetadata(site);

  return {
    // This value is `--heroui-background`.
    background_color: "hsl(0 0% 100%)",
    description: metadata.description?.toString(),
    display: "standalone",
    icons: [
      {
        src: String(metadata.icons),
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    name: metadata.title?.toString(),
    orientation: "natural",
    short_name: metadata.title?.toString(),
    start_url: ROUTES.home,
    // This value is `--heroui-primary`.
    theme_color: "hsl(212.01999999999998 100% 46.67%)",
  };
}
