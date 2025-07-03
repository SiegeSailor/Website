import { readFileSync, statSync } from "fs";
import { join } from "path";

import { DOMAIN_PATH } from "@/setting/site";

export async function getProfile() {
  const filePath = join(process.cwd(), DOMAIN_PATH.document, "Profile.md");
  const profile = readFileSync(filePath, "utf8");
  const statistics = statSync(filePath);

  return { profile, statistics };
}
