import { ComponentProps } from "react";

import { getArticleByFilename } from "@/helper/server/article";
import ScrollShadowChips from "@/component/ScrollShadowChips";
import IconTechnology from "@/component/IconTechnology";

export default function ({
  technologies,
  propsIcon,
  ...props
}: Omit<ComponentProps<typeof ScrollShadowChips>, "row"> &
  Readonly<{
    technologies: Awaited<
      ReturnType<typeof getArticleByFilename>
    >["metadata"]["technologies"];
    propsIcon?: Omit<ComponentProps<typeof IconTechnology>, "technology">;
  }>) {
  return (
    <ScrollShadowChips
      {...props}
      row={technologies.map((technology) => ({
        name: technology,
        icon: <IconTechnology {...propsIcon} technology={technology} />,
      }))}
    />
  );
}
