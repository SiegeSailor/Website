"use server";

import { ComponentProps } from "react";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { getProfile } from "@/helper/server/document";
import Bar from "@/component/CardSummary/Bar";
import CardBlock from "@/component/CardBlock";
import ContentHeader from "@/component/CardSummary/ContentHeader";

Chart.register(ChartDataLabels);

export default async function ({
  ...props
}: Omit<ComponentProps<typeof CardBlock>, "href" | "title" | "contentHeader">) {
  const { metadata } = await getProfile();

  return (
    <CardBlock
      href="/profile#summary"
      title="What I Bring to the Table"
      contentHeader={<ContentHeader experience={metadata.status.experience} />}
      {...props}
    >
      <Bar />
    </CardBlock>
  );
}
