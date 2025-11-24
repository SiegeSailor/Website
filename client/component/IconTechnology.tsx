"use client";

import { ComponentProps, ComponentType } from "react";
import { IconType } from "@icons-pack/react-simple-icons";
import * as lucide from "lucide-react";

import { getArticleByFilename } from "@/helper/server/article";
import { TECHNOLOGY_ICON } from "@/setting/icon";

function IconLucide({
  Component,
}: Readonly<{ Component: ComponentType<Omit<lucide.LucideProps, "ref">> }>) {
  return (
    <Component color="hsl(var(--heroui-default-700))" strokeWidth={0.75} />
  );
}

type TIconProps = ComponentProps<IconType> & lucide.LucideProps;

export default function ({
  technology,
  ...props
}: TIconProps &
  Readonly<{
    technology: Awaited<
      ReturnType<typeof getArticleByFilename>
    >["metadata"]["technologies"][number];
  }>) {
  const Icon = TECHNOLOGY_ICON[technology];

  const propsBase: TIconProps = { size: "1rem", title: technology, ...props };

  if ((Icon.displayName ?? "") in lucide)
    return (
      <IconLucide
        Component={(propsOverride) => (
          <Icon {...propsBase} {...propsOverride} />
        )}
      />
    );

  return <Icon {...propsBase} />;
}
