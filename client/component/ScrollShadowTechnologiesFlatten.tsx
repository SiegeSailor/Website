"use client";

import { useArticleStore } from "@/store/article";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

export default function () {
  const uniqueTechnologies = useArticleStore(
    (state) => state.uniqueTechnologies
  );
  return (
    <div className="flex flex-col gap-2">
      <ScrollShadowTechnologies
        technologies={uniqueTechnologies}
        propsContainer={{ className: "flex-wrap", size: 0 }}
        propsItem={{
          className: "text-foreground",
          variant: "bordered",
          size: "md",
        }}
        propsIcon={{ color: "default" }}
      />
    </div>
  );
}
