"use server";

import { join } from "path";
import { readFileSync } from "fs";
import matter from "gray-matter";

import { AUTHOR, TITLE_TO_ROUTE } from "@/settings/constant";
import { getAnchorsByContent } from "@/helpers/article";
import { getSlugByTitle } from "@/helpers/utility";
import { getStatisticByFilePath } from "@/helpers/server/file";

const REGEX_URL = /^https?:\/\/.+/;
const MILLISECOND_ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const TIMELINE = {
  start: "2016-06-01",
  intervals: [
    { start: "2017-01-01", end: "2017-06-30", reason: "Military Service" },
    { start: "2022-02-01", end: "2024-01-31", reason: "Career Gap" },
  ],
} as const;

function getExperienceYears(): string {
  const dateCurrent = new Date();
  const dateCareerStart = new Date(TIMELINE.start);

  const timeTotal = dateCurrent.getTime() - dateCareerStart.getTime();
  const timeExcluded = TIMELINE.intervals.reduce((total, period) => {
    return (
      total +
      (new Date(period.end).getTime() - new Date(period.start).getTime())
    );
  }, 0);

  const [year, month] = ((timeTotal - timeExcluded) / MILLISECOND_ONE_YEAR)
    .toFixed(1)
    .split(".");
  const monthFloor = Math.floor((Number(month) / 10) * 12);
  return `${year} Years ${month === "0" ? "" : `${monthFloor} Months`}`.trim();
}

export type TProfile = Awaited<ReturnType<typeof getProfile>>;

export async function getProfile() {
  const filename = "Profile.md";

  try {
    const filePath = join(process.cwd(), "files/documents", filename);
    const fileContents = readFileSync(filePath, "utf8");
    const { content: source, data } = matter(fileContents);

    const sources = source.split("<!-- description -->");
    const description = sources[0]?.trim();
    // MDX cannot compile HTML comments, e.g. the generated section markers.
    const content = sources[1]?.replace(/<!--[\s\S]*?-->/g, "").trim();
    const headlines: string[] = data.headlines;
    const media: { resume: string; github: string; linkedin: string } =
      data.media;
    const status: {
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
    if (typeof status.location !== "string" || status.location.length === 0)
      throw new Error("Location must be a non-empty string");
    if (typeof status.position !== "string" || status.position.length === 0)
      throw new Error("Position must be a non-empty string");
    if (typeof status.visa !== "string" || status.visa.length === 0)
      throw new Error("Visa must be a non-empty string");

    const identifierProfile = getSlugByTitle(AUTHOR);
    const anchors: ReturnType<typeof getAnchorsByContent> = [
      {
        level: 1,
        title: AUTHOR,
        identifier: identifierProfile,
        route: `${TITLE_TO_ROUTE.Profile}#${identifierProfile}`,
      },
      ...getAnchorsByContent(content, TITLE_TO_ROUTE.Profile),
    ];

    const statistics = await getStatisticByFilePath(filePath);

    return {
      content,
      filename,
      metadata: {
        anchors,
        createdOn: statistics.createdOn,
        description,
        headlines,
        media,
        picture: data.picture,
        status: {
          ...status,
          experience: getExperienceYears(),
        },
        title: AUTHOR,
        updatedOn: statistics.updatedOn,
      },
    };
  } catch (_) {
    const error = _ as Error;
    throw new Error(
      `Document Parsing Error: ${error.message} (reading ${filename})`,
    );
  }
}
