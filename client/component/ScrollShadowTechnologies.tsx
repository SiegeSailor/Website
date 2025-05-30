import { ComponentProps } from "react";

import { getArticleByFilename } from "@/helper/article";
import ScrollShadowChips from "@/component/ScrollShadowChips";
import IconTechnology from "@/component/IconTechnology";

export default function ({
  technologies,
  ...props
}: Omit<ComponentProps<typeof ScrollShadowChips>, "row"> &
  Readonly<{
    technologies: Awaited<
      ReturnType<typeof getArticleByFilename>
    >["metadata"]["technologies"];
  }>) {
  return (
    <ScrollShadowChips
      {...props}
      row={technologies.map((technology) => ({
        name: technology,
        icon: <IconTechnology technology={technology} />,
      }))}
    />
  );
}
