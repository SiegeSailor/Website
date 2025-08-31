"use server";

import { ComponentProps } from "react";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { getProfile } from "@/helper/server/document";
import Bar from "./Bar";
import CardBlock from "@/component/CardBlock";
import ContentHeader from "./ContentHeader";

Chart.register(ChartDataLabels);

export default async function ({
  ...props
}: Omit<
  ComponentProps<typeof CardBlock>,
  "children" | "contentHeader" | "href" | "title"
>) {
  const { metadata } = await getProfile();

  return (
    <CardBlock
      contentHeader={<ContentHeader experience={metadata.status.experience} />}
      href="/profile#summary"
      title="What I Bring to the Table"
      {...props}
    >
      <Bar />
    </CardBlock>
  );
}
