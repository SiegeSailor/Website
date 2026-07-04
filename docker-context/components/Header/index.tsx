import Bar, { HEIGHT } from "./Bar";
import ContentActions from "./ContentActions";
import ContentTitle from "./ContentTitle";
import Menu from "./Menu";

export default async function () {
  return (
    <>
      <Bar>
        <ContentTitle />
        <ContentActions />
        <Menu />
      </Bar>
      <div style={{ minHeight: HEIGHT, height: HEIGHT }} />
    </>
  );
}
