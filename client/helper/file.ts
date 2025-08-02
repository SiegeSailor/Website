import { execSync } from "child_process";

export async function getStatisticByFilePath(filePath: string) {
  const createdOn = execSync(
    `git log --diff-filter=A --format="%ad" --date=short "${filePath}" | tail -1`,
    { encoding: "utf8" }
  ).trim();

  const updatedOn = execSync(
    `git log -1 --format="%ad" --date=short "${filePath}"`,
    { encoding: "utf8" }
  ).trim();

  return { createdOn, updatedOn };
}
