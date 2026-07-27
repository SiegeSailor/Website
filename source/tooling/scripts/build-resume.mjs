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

import { loadContent } from "./load-content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// Only the content declaring `resume` in its `consumers:`, already pruned of
// archived nodes — a section is absent here because content says so, not
// because this script filters it.
const { data: DATA, headings: HEADINGS } = loadContent("resume");
const OUTPUT = join(ROOT, "export/resume");
// The repository root package.json is the single version source (semantic-release
// bumps it); stamped into the document metadata.
const VERSION = JSON.parse(
  readFileSync(join(ROOT, "../../package.json"), "utf8"),
).version;

// The resume must stay within one US-Letter page.
const PAGES = 1;
const SOFFICE_CMD = process.env.SOFFICE_CMD ?? "soffice --headless";

const FONT = "Calibri";
// Sizes are half-points; spacing/indents are twips (1440 = 1 inch).
const SZ = { name: 32, contact: 18, section: 20, body: 19, blurb: 18 };
// Tightened to keep the resume on one US-Letter page after the Certifications
// section was split out of Education (see root CLAUDE.md).
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

// Section names come from each content file's `heading:`. Section *order* stays
// below, in code: it is ATS-sensitive and drives the one-page fit.
const heading = (key) => {
  const text = HEADINGS[key];
  if (!text)
    throw new Error(
      `source/content/resume/ gives the resume a \`${key}\` key with no \`heading:\` to title its section`,
    );
  return text;
};

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
      new TextRun({
        // Upper-casing is presentation, so content stores the name as written.
        text: clean(DATA.identity.legal).toUpperCase(),
        bold: true,
        font: FONT,
        size: SZ.name,
      }),
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

const buildSummary = () => {
  const text = (DATA.summary || [])[0]?.text;
  if (!text) return [];
  return [
    sectionHeader(heading("summary")),
    bodyLine([new TextRun({ text: clean(text), font: FONT, size: SZ.body })]),
  ];
};

const buildSkills = () => {
  const rows = DATA.skills || [];
  if (!rows.length) return [];
  return [
    sectionHeader(heading("skills")),
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

const buildExperience = () => {
  const jobs = DATA.experience || [];
  if (!jobs.length) return [];
  const out = [sectionHeader(heading("experience"))];
  for (const job of jobs) {
    const bullets = job.bullets || [];
    if (!bullets.length) continue;

    const roles = job.roles || [];
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
    if (job.blurb)
      out.push(
        bodyLine(
          [
            new TextRun({
              text: clean(job.blurb.text),
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

const buildPublications = () => {
  const publications = DATA.publications || [];
  if (!publications.length) return [];
  return [
    sectionHeader(heading("publications")),
    ...publications.map((p) =>
      bodyLine([
        new TextRun({ text: clean(p.text), font: FONT, size: SZ.body }),
      ]),
    ),
  ];
};

const buildSchools = (key, list) => {
  const rows = list || [];
  if (!rows.length) return [];
  const out = [sectionHeader(heading(key))];
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
    for (const detail of entry.details || []) out.push(bullet(detail.text));
  }
  return out;
};

const buildEducation = () => buildSchools("education", DATA.education);
const buildCertifications = () =>
  buildSchools("certifications", DATA.certifications);

const buildActivities = () => {
  const items = DATA.activities?.items || [];
  if (!items.length) return [];
  return [
    sectionHeader(heading("activities")),
    ...items.map((text) => bullet(text)),
  ];
};

const buildDocument = async () => {
  const doc = new Document({
    title: `${clean(DATA.identity.display)} — Resume`,
    creator: clean(DATA.identity.display),
    subject: "Resume",
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
          ...buildSummary(),
          ...buildSkills(),
          ...buildExperience(),
          ...buildPublications(),
          ...buildEducation(),
          ...buildCertifications(),
          ...buildActivities(),
        ],
      },
    ],
  });

  mkdirSync(OUTPUT, { recursive: true });
  const file = join(OUTPUT, "JinYu-Zhang-Resume.docx");
  writeFileSync(file, await Packer.toBuffer(doc));
  console.log(`built ${relative(ROOT, file)}`);
  return file;
};

const convert = (file) => {
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
  if (pages !== PAGES)
    throw new Error(
      `${relative(ROOT, pdf)} has ${pages} pages; the resume must have ${PAGES}`,
    );
  console.log(
    `verified ${relative(ROOT, pdf)} (${pages} page${pages === 1 ? "" : "s"})`,
  );
};

convert(await buildDocument());
