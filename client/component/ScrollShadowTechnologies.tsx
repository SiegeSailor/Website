import { ComponentProps, createElement } from "react";

import { getArticleByFilename } from "@/helper/article";
import { TECHNOLOGY_ICON } from "@/setting/icon";
import ScrollShadowChips from "@/component/ScrollShadowChips";

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
        icon: createElement(TECHNOLOGY_ICON[technology]),
      }))}
    />
  );
}
