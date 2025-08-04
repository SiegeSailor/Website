import { ComponentProps } from "react";
import { IconType } from "@icons-pack/react-simple-icons";

import { getArticleByFilename } from "@/helper/server/article";
import { TECHNOLOGY_ICON } from "@/setting/icon";

export default function ({
  technology,
  ...props
}: ComponentProps<IconType> &
  Readonly<{
    technology: Awaited<
      ReturnType<typeof getArticleByFilename>
    >["metadata"]["technologies"][number];
  }>) {
  const Icon = TECHNOLOGY_ICON[technology];
  return <Icon size="1rem" title={technology} {...props} />;
}
