import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
} from "docx";

import { loadContent } from "./content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = loadContent();
const OUTPUT = join(ROOT, "export/resume");
// The repository root package.json is the single version source (semantic-release
// bumps it); stamped into the document metadata.
const VERSION = JSON.parse(
  readFileSync(join(ROOT, "../package.json"), "utf8"),
).version;

const VARIANT_TO_LABEL = { professional: "Professional", academic: "Academic" };
// The professional variant must stay within one US-Letter page.
const VARIANT_TO_PAGES = { professional: 1, academic: 2 };
const SOFFICE_CMD = process.env.SOFFICE_CMD ?? "soffice --headless";

const FONT = "Calibri";
// Sizes are half-points; spacing/indents are twips (1440 = 1 inch).
const SZ = { name: 32, contact: 18, section: 20, body: 19, blurb: 18 };
// Tightened to keep the professional variant on one US-Letter page after the
// Certifications section was split out of Education (see root CLAUDE.md).
const SPACE = {
  afterBullet: 9,
  afterBody: 32,
  beforeSection: 44,
  afterSection: 26,
};
const RIGHT_TAB = 12240 - 792 * 2;

const clean = (s) =>
  String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
const inVariant = (item, v) => !item?.variants || item.variants.includes(v);

const hasCommand = (command) => {
  try {
    execSync(`command -v ${command.split(" ")[0]}`, {
      stdio: "ignore",
      shell: "/bin/bash",
    });
    return true;
  } catch {
    return false;
  }
};

// LibreOffice ignores docx PositionalTab; right-aligned dates need a classic
// right tab stop plus a literal "\t" in the run.
const splitLine = (leftRuns, rightText, opts = {}) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
    ...opts,
    children: rightText
      ? [
          ...leftRuns,
          new TextRun({
            text: "\t" + clean(rightText),
            font: FONT,
            size: SZ.body,
          }),
        ]
      : leftRuns,
  });

const sectionHeader = (text) =>
  new Paragraph({
    spacing: { before: SPACE.beforeSection, after: SPACE.afterSection },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "444444", space: 2 },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        font: FONT,
        size: SZ.section,
        allCaps: true,
      }),
    ],
  });

const bullet = (text) =>
  new Paragraph({
    numbering: { reference: "resume-bullets", level: 0 },
    spacing: { after: SPACE.afterBullet },
    children: [new TextRun({ text: clean(text), font: FONT, size: SZ.body })],
  });

const bodyLine = (runs, opts = {}) =>
  new Paragraph({
    spacing: { after: SPACE.afterBody },
    ...opts,
    children: runs,
  });

const buildHeader = () => [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [
      new TextRun({ text: DATA.name, bold: true, font: FONT, size: SZ.name }),
    ],
  }),
  ...[DATA.contact.line1, DATA.contact.line2].map(
    (line) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({ text: clean(line), font: FONT, size: SZ.contact }),
        ],
      }),
  ),
];

const buildSummary = (v) => {
  const text = DATA.summary?.[v];
  if (!text) return [];
  return [
    sectionHeader("Summary"),
    bodyLine([new TextRun({ text: clean(text), font: FONT, size: SZ.body })]),
  ];
};

const buildSkills = (v) => {
  const rows = (DATA.skills || []).filter((s) => inVariant(s, v));
  if (!rows.length) return [];
  return [
    sectionHeader("Skills"),
    ...rows.map((s) =>
      bodyLine(
        [
          new TextRun({
            text: `${s.label}: `,
            bold: true,
            font: FONT,
            size: SZ.body,
          }),
          new TextRun({ text: clean(s.items), font: FONT, size: SZ.body }),
        ],
        { spacing: { after: 20 } },
      ),
    ),
  ];
};

const buildExperience = (v) => {
  const jobs = (DATA.experience || []).filter((j) => inVariant(j, v));
  const out = [sectionHeader("Work Experience")];
  for (const job of jobs) {
    const bullets = (job.bullets || []).filter((b) => inVariant(b, v));
    if (!bullets.length) continue;

    const roles = (job.roles || []).filter((r) => inVariant(r, v));
    out.push(
      splitLine(
        [
          new TextRun({
            text: job.company,
            bold: true,
            font: FONT,
            size: SZ.body,
          }),
          new TextRun({
            text: ` — ${clean(job.location)}`,
            font: FONT,
            size: SZ.body,
          }),
        ],
        roles.length === 1 ? roles[0].dates : "",
        { spacing: { before: 60, after: 10 } },
      ),
    );
    const blurb =
      typeof job.blurb === "string" ? { text: job.blurb } : job.blurb;
    if (blurb?.text && inVariant(blurb, v))
      out.push(
        bodyLine(
          [
            new TextRun({
              text: clean(blurb.text),
              italics: true,
              font: FONT,
              size: SZ.blurb,
            }),
          ],
          { spacing: { after: 20 } },
        ),
      );
    if (roles.length === 1) {
      out.push(
        bodyLine(
          [
            new TextRun({
              text: roles[0].title,
              bold: true,
              italics: true,
              font: FONT,
              size: SZ.body,
            }),
          ],
          { spacing: { after: 20 } },
        ),
      );
    } else {
      for (const role of roles)
        out.push(
          splitLine(
            [
              new TextRun({
                text: role.title,
                bold: true,
                italics: true,
                font: FONT,
                size: SZ.body,
              }),
            ],
            role.dates,
            { spacing: { after: 10 } },
          ),
        );
    }
    out.push(...bullets.map((b) => bullet(b.text)));
  }
  return out;
};

const buildPublications = (v) => {
  const publications = (DATA.publications || []).filter((p) => inVariant(p, v));
  if (!publications.length) return [];
  return [
    sectionHeader("Publications"),
    ...publications.map((p) =>
      bodyLine([
        new TextRun({ text: clean(p.text), font: FONT, size: SZ.body }),
      ]),
    ),
  ];
};

const buildSchools = (title, list, v) => {
  const rows = (list || []).filter((e) => inVariant(e, v));
  if (!rows.length) return [];
  const out = [sectionHeader(title)];
  for (const entry of rows) {
    out.push(
      splitLine(
        [
          new TextRun({
            text: entry.school,
            bold: true,
            font: FONT,
            size: SZ.body,
          }),
          new TextRun({
            text: ` — ${clean(entry.degree)}`,
            font: FONT,
            size: SZ.body,
          }),
        ],
        entry.dates,
        { spacing: { before: 40, after: 10 } },
      ),
    );
    for (const detail of entry.details || []) {
      const item = typeof detail === "string" ? { text: detail } : detail;
      if (inVariant(item, v)) out.push(bullet(item.text));
    }
  }
  return out;
};

const buildEducation = (v) => buildSchools("Education", DATA.education, v);
const buildCertifications = (v) =>
  buildSchools("Certifications", DATA.certifications, v);

const buildActivities = (v) => {
  const activities = DATA.activities;
  if (!activities || !inVariant(activities, v)) return [];
  return [
    sectionHeader("Activities & Leadership"),
    ...(activities.items || []).map((text) => bullet(text)),
  ];
};

const buildVariant = async (v) => {
  const doc = new Document({
    title: `${clean(DATA.name)} — Resume (${VARIANT_TO_LABEL[v]})`,
    creator: clean(DATA.name),
    subject: `Resume (${VARIANT_TO_LABEL[v]})`,
    keywords: `v${VERSION}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SZ.body },
          paragraph: { spacing: { line: 226 } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "resume-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 280, hanging: 160 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 600, bottom: 600, left: 792, right: 792 },
          },
        },
        children: [
          ...buildHeader(),
          ...buildSummary(v),
          ...buildSkills(v),
          ...buildExperience(v),
          ...buildPublications(v),
          ...buildEducation(v),
          ...buildCertifications(v),
          ...buildActivities(v),
        ],
      },
    ],
  });

  mkdirSync(OUTPUT, { recursive: true });
  const file = join(OUTPUT, `JinYu-Zhang-Resume-${VARIANT_TO_LABEL[v]}.docx`);
  writeFileSync(file, await Packer.toBuffer(doc));
  console.log(`built ${relative(ROOT, file)}`);
  return file;
};

const convertVariant = (v, file) => {
  if (hasCommand("pandoc")) {
    execSync(
      `pandoc --wrap=none -t plain "${file}" -o "${file.replace(/\.docx$/, ".txt")}"`,
    );
    console.log(`built ${relative(ROOT, file.replace(/\.docx$/, ".txt"))}`);
  } else {
    console.warn(
      `skipped .txt for ${relative(ROOT, file)} (pandoc not available)`,
    );
  }

  if (!hasCommand(SOFFICE_CMD)) {
    console.warn(
      `skipped .pdf for ${relative(ROOT, file)} (LibreOffice not available)`,
    );
    return;
  }
  execSync(`${SOFFICE_CMD} --convert-to pdf --outdir "${OUTPUT}" "${file}"`, {
    stdio: "ignore",
  });
  const pdf = file.replace(/\.docx$/, ".pdf");
  console.log(`built ${relative(ROOT, pdf)}`);

  if (!hasCommand("pdfinfo")) {
    console.warn(
      `skipped page count check for ${relative(ROOT, pdf)} (pdfinfo not available)`,
    );
    return;
  }
  const pages = Number(
    execSync(`pdfinfo "${pdf}"`)
      .toString()
      .match(/^Pages:\s+(\d+)$/m)?.[1],
  );
  if (!VARIANT_TO_PAGES[v]) {
    console.warn(
      `skipped page count check for ${relative(ROOT, pdf)} (no expected count for ${v})`,
    );
    return;
  }
  if (pages !== VARIANT_TO_PAGES[v])
    throw new Error(
      `${relative(ROOT, pdf)} has ${pages} pages; the ${v} variant must have ${VARIANT_TO_PAGES[v]}`,
    );
  console.log(
    `verified ${relative(ROOT, pdf)} (${pages} page${pages === 1 ? "" : "s"})`,
  );
};

const requested = process.argv.slice(2);
const variants =
  requested.length && !requested.includes("all")
    ? requested
    : Object.keys(VARIANT_TO_LABEL);

for (const variant of variants) {
  if (!VARIANT_TO_LABEL[variant])
    throw new Error(
      `unknown variant "${variant}" — expected: ${Object.keys(VARIANT_TO_LABEL).join(", ")}`,
    );
  convertVariant(variant, await buildVariant(variant));
}
