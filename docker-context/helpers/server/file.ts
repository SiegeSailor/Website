import { promises } from "fs";

const DEFAULT = "2018-11-17" as const;

export async function getStatisticByFilePath(filePath: string) {
  try {
    const stats = await promises.stat(filePath);

    const createdOn = stats.birthtime.toISOString().split("T")[0];
    const updatedOn = stats.mtime.toISOString().split("T")[0];

    return { createdOn, updatedOn };
  } catch (error) {
    return { createdOn: DEFAULT, updatedOn: DEFAULT };
  }
}
