"use server";

import Bar from "@/component/Header/Bar";
import ContentActions from "@/component/Header/ContentActions";
import ContentTitle from "@/component/Header/ContentTitle";
import Menu from "@/component/Header/Menu";

export default async function () {
  return (
    <Bar>
      <ContentTitle />
      <ContentActions />
      <Menu />
    </Bar>
  );
}
