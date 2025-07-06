import { readFileSync, statSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

import { DOMAIN_PATH, AUTHOR } from "@/setting/site";
import { getAnchorsByContent, getSlugByTitle } from "@/helper/article";

const REGEX_URL = /^https?:\/\/.+/;

export async function getProfile() {
  const filename = "Profile.md";

  try {
    const filePath = join(process.cwd(), DOMAIN_PATH.document, filename);
    const fileContents = readFileSync(filePath, "utf8");
    const { content: source, data } = matter(fileContents);

    const sources = source.split("<!-- description -->");
    const description = sources[0]?.trim();
    const content = sources[1]?.trim();
    const headlines: string[] = data.headlines;
    const media: { resume: string; github: string; linkedin: string } =
      data.media;
    const status: {
      experience: string;
      location: string;
      position: string;
      visa: string;
    } = data.status;

    if (typeof description !== "string" || description.length === 0)
      throw new Error("Description must be a non-empty string");
    if (typeof content !== "string" || content.length === 0)
      throw new Error("Content must be a non-empty string");
    if (typeof data.picture !== "string" || data.picture.length === 0)
      throw new Error("Picture must be a non-empty string");
    if (!Array.isArray(data.headlines))
      throw new Error("Headlines must be an array");
    if (headlines.length === 0)
      throw new Error("Headlines must not be an empty array");
    if (headlines.some((line) => typeof line !== "string" || line.length === 0))
      throw new Error("Each headline must be a non-empty string");
    if (!media || typeof media !== "object")
      throw new Error("Media must be an object");
    if (!REGEX_URL.test(media.resume))
      throw new Error("Resume URL must be a valid URL");
    if (!REGEX_URL.test(media.github))
      throw new Error("GitHub URL must be a valid URL");
    if (!REGEX_URL.test(media.linkedin))
      throw new Error("LinkedIn URL must be a valid URL");
    if (!status || typeof status !== "object")
      throw new Error("Status must be an object");
    if (typeof status.experience !== "string" || status.experience.length === 0)
      throw new Error("Experience must be a non-empty string");
    if (typeof status.location !== "string" || status.location.length === 0)
      throw new Error("Location must be a non-empty string");
    if (typeof status.position !== "string" || status.position.length === 0)
      throw new Error("Position must be a non-empty string");
    if (typeof status.visa !== "string" || status.visa.length === 0)
      throw new Error("Visa must be a non-empty string");

    const anchors: ReturnType<typeof getAnchorsByContent> = [
      { level: 1, title: AUTHOR, identifier: getSlugByTitle(AUTHOR) },
      ...getAnchorsByContent(content),
    ];

    return {
      content,
      filename,
      metadata: {
        anchors,
        description,
        picture: data.picture,
        headlines,
        media,
        status,
        statistics: statSync(filePath),
        title: AUTHOR,
      },
    };
  } catch (_) {
    const error = _ as Error;
    throw new Error(
      `Document Parsing Error: ${error.message} (reading ${filename})`
    );
  }
}
