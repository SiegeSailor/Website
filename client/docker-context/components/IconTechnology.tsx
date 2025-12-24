"use client";

import { ComponentProps, ComponentType } from "react";
import { IconType } from "@icons-pack/react-simple-icons";
import { LucideProps } from "lucide-react";

import { getArticleByFilename } from "@/helpers/server/article";
import { getValues } from "@/helpers/utility";
import { TECHNOLOGY_TO_ICON, LUCIDE_ICON } from "@/settings/icon";

function IconLucide({
  Component,
}: Readonly<{ Component: ComponentType<Omit<LucideProps, "ref">> }>) {
  return (
    <Component
      color="hsl(var(--heroui-default-700))"
      strokeWidth={1.15}
      size="1.15rem"
      width="1.15rem"
      height="1.15rem"
    />
  );
}

type TIconProps = ComponentProps<IconType> & LucideProps;

export default function ({
  technology,
  ...props
}: TIconProps &
  Readonly<{
    technology: Awaited<
      ReturnType<typeof getArticleByFilename>
    >["metadata"]["technologies"][number];
  }>) {
  const Icon = TECHNOLOGY_TO_ICON[technology];

  const propsBase: TIconProps = {
    size: "1rem",
    width: "1rem",
    height: "1rem",
    title: technology,
    ...props,
  };

  if (getValues(LUCIDE_ICON).includes(Icon))
    return (
      <IconLucide
        Component={(propsOverride) => (
          <Icon {...propsBase} {...propsOverride} />
        )}
      />
    );

  return <Icon {...propsBase} />;
}
