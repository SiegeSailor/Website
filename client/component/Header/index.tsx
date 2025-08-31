"use server";

import Bar from "./Bar";
import ContentActions from "./ContentActions";
import ContentTitle from "./ContentTitle";
import Menu from "./Menu";

export default async function () {
  return (
    <Bar>
      <ContentTitle />
      <ContentActions />
      <Menu />
    </Bar>
  );
}
