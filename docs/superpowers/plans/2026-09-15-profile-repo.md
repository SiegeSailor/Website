# Profile Repo Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up `SiegeSailor/SiegeSailor` as the single home for profile facts, with two local skills that render them into the GitHub README and a one-page ATS-safe resume.

**Architecture:** Plain YAML in `profile/` with no routing metadata. An LLM reads it, writes a JSON _plan_ naming exactly which strings to print, a verifier asserts every one of those strings exists verbatim in the source, and a renderer turns the approved plan into `.docx`. Judgment is the model's; fidelity is enforced by code.

**Tech Stack:** Node 26 ESM, `docx` 9.7.1, `js-yaml`, `node --test` (built-in, no test framework dependency), `soffice` and `pdfinfo` for PDF conversion and page counting, `gh` CLI for release lookups.

**Spec:** [`docs/superpowers/specs/2026-09-13-three-repo-profile-split-design.md`](../specs/2026-09-13-three-repo-profile-split-design.md)

## Global Constraints

- Repository is `SiegeSailor/SiegeSailor`, public, default branch `main`. Clone to `/Users/user/Documents/SiegeSailor`.
- `README.md` at the repo root is the rendered GitHub profile README. Never hand-edit it.
- Node `>= 26.5.0`, npm `>= 11.17.0`.
- Only two runtime dependencies: `docx` and `js-yaml`. Do not add a test framework, a YAML schema validator, or a CLI argument parser.
- Every fact in `profile/` is verified and read by background-check vendors. No date, title, ranking, or number changes without explicit confirmation from Ken.
- The resume is one US-Letter page unless a request overrides it. Single column; no tables, text boxes, headers, or footers.
- Never emit a literal `•`. Bullets come from the docx numbering configuration.
- Dates are right-aligned with a right tab stop and a literal `\t` in the run, never with spaces.
- Commit messages are one Conventional Commits line, imperative, lowercase, under 72 characters, no body.

---

### Task 1: Bootstrap the repo and migrate `profile/`

**Files:**

- Create: `package.json`, `.gitignore`, `profile/*.yaml` (13 files)
- Create: `test/profile.test.mjs`

**Interfaces:**

- Consumes: nothing.
- Produces: `profile/` — 13 YAML files, each a mapping with exactly one top-level key, no `consumers:`, `heading:`, or `archived:` anywhere.

- [ ] **Step 1: Clone the repo and create the manifest**

```bash
cd /Users/user/Documents
git clone https://github.com/SiegeSailor/SiegeSailor.git
cd SiegeSailor
```

`package.json`:

```json
{
  "name": "@siegesailor/profile",
  "version": "1.0.0",
  "description": "SiegeSailor's profile facts, and the skills that render them.",
  "private": true,
  "type": "module",
  "engines": { "node": ">= 26.5.0", "npm": ">= 11.17.0" },
  "scripts": { "test": "node --test test/" },
  "dependencies": { "docx": "9.7.1", "js-yaml": "5.2.2" }
}
```

`.gitignore`:

```gitignore
.DS_Store
node_modules/
export/
*.docx
*.pdf
```

- [ ] **Step 2: Write the failing test**

`test/profile.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";

const DIR = join(import.meta.dirname, "../profile");
const FILES = readdirSync(DIR).filter((f) => /\.ya?ml$/.test(f));

const EXPECTED = [
  "activities.yaml",
  "certifications.yaml",
  "contact.yaml",
  "education.yaml",
  "experience.yaml",
  "identity.yaml",
  "media.yaml",
  "profile.yaml",
  "projects.yaml",
  "publications.yaml",
  "skills.yaml",
  "summary.yaml",
  "timeline.yaml",
];

test("every expected profile file is present", () => {
  assert.deepEqual(FILES.sort(), EXPECTED);
});

test("every file parses and holds exactly one top-level key", () => {
  for (const file of FILES) {
    const document = load(readFileSync(join(DIR, file), "utf8"));
    assert.ok(document, `${file} is empty`);
    assert.equal(
      Object.keys(document).length,
      1,
      `${file} must hold exactly one top-level key, found ${Object.keys(document).join(", ")}`,
    );
  }
});

test("no envelope keys survive the migration", () => {
  for (const file of FILES) {
    const raw = readFileSync(join(DIR, file), "utf8");
    for (const key of ["consumers:", "heading:", "archived:"]) {
      assert.ok(
        !raw.includes(key),
        `${file} still carries \`${key}\` — the tagging system is removed`,
      );
    }
  }
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm install && npm test`
Expected: FAIL — `profile/` does not exist, `readdirSync` throws ENOENT.

- [ ] **Step 4: Migrate the YAML**

Copy these 13 files from `/Users/user/Documents/Website/source/content/resume/` into `profile/`:

`activities.yaml`, `certifications.yaml`, `contact.yaml`, `education.yaml`, `experience.yaml`, `identity.yaml`, `media.yaml`, `profile.yaml`, `projects.yaml`, `publications.yaml`, `skills.yaml`, `summary.yaml`, `timeline.yaml`

Do **not** copy `routes.yaml`, `site-identity.yaml`, or `versions.generated.json` — those are website configuration and build output, and stay behind (see spec, Repository 1).

Do **not** copy anything from `source/content/profile/`. `schema.yaml`, `example.yaml`, and `e.yaml` are deleted: they exist to serve the validation system this design removes.

In each copied file:

1. Delete the `consumers:` block and its list items.
2. Delete the `heading:` line.
3. Delete every `archived: true` line. Where `archived: true` was the _only_ key distinguishing a list item (e.g. `- archived: true` followed by `text:`), leave the item as `- text: …`.
4. Where a node was an object solely because it carried `archived:` alongside `text:`, keep the object form — `build-resume.mjs` reads `bullet.text`, not a bare string.
5. Preserve every inline comment verbatim. They carry the reasoning behind the facts, and `POLICY.md` in Task 2 cross-references them.
6. Preserve the file's remaining single top-level key.

Worked example — `summary.yaml` before:

```yaml
consumers:
  - resume
  - readme
  - /about

heading: Summary

summary:
  - text: "Senior software engineer…"
  - archived: true
    text: "An older framing…"
```

after:

```yaml
summary:
  - text: "Senior software engineer…"
  - text: "An older framing…"
```

Both entries now exist as ordinary content. The resume skill picks one; having the alternative available is the point.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 3 tests, 0 failures.

- [ ] **Step 6: Sanity-check that no fact was lost**

```bash
grep -c "text:" profile/experience.yaml   # expect the same count as the source file
diff <(grep -o '[0-9]\+%\|[0-9,]\+ RPS\|0\.[0-9]\+' /Users/user/Documents/Website/source/content/resume/experience.yaml | sort) \
     <(grep -o '[0-9]\+%\|[0-9,]\+ RPS\|0\.[0-9]\+' profile/experience.yaml | sort)
```

Expected: the `diff` prints nothing. Every metric survived the migration.

- [ ] **Step 7: Commit**

```bash
git add package.json .gitignore profile/ test/
git commit -m "feat: seed profile facts from the website repository"
```

---

### Task 2: Write `POLICY.md` and `profile/CLAUDE.md`

**Files:**

- Create: `profile/POLICY.md`, `profile/CLAUDE.md`

**Interfaces:**

- Consumes: `profile/*.yaml` from Task 1.
- Produces: `profile/POLICY.md` — read by all three skills, including `update-website` in the Website repo.

This is a documentation task. Its deliverable is verified by review against the checklist in Step 3, not by a unit test: the content is prose whose correctness is a human judgment.

- [ ] **Step 1: Write `profile/POLICY.md`**

It must state these seven rules. Wording may be improved; none may be dropped.

```markdown
# POLICY

The judgment calls behind the facts in this folder. Every skill that renders
this content reads this file first. These are not style preferences — each one
exists because getting it wrong misrepresents a verified record.

## Employment History

- **StageSource is not employment.** It was a Boston University course team
  working a real client's requirements. It prints as a detail of the M.S.,
  never in a work-experience section. No employment-verification vendor should
  be sent after a job that was never one.
- **DY Game is not employment.** An internship taken during the B.F.A. It
  prints under that degree, on the same reasoning.
- **Never widen Servicetech's range.** The 2017–2018 role and the 2016–2017
  internship are separate lines. Print the internship as its own line or omit
  it; never absorb it into a single 2016–2018 range.
- **Never flatten stacked role lines.** CooperSurgical and Servicetech each
  keep one line per title. Background-check vendors verify titles and dates
  separately, so a widened range reads as a discrepancy.

## Claims

- **The Shopee retention figure is first-to-last-day within a single 3–14 day
  festival run.** It is not D1 or D7 cohort retention. Never compress it to
  "player retention" — the window is the claim.
- **Contact details are document-only.** The phone number and postal area in
  `contact.yaml` belong on the resume document. They never appear on the
  website or in the README.

## Changes

- **Every fact here is verified.** No date, title, ranking, or number changes
  without explicit confirmation from Ken. This is the folder a background-check
  vendor is effectively reading.
```

- [ ] **Step 2: Write `profile/CLAUDE.md`**

```markdown
# CLAUDE.md — profile

The single source of truth for the resume document, the GitHub README, and the
website. Nothing a reader sees is hard-coded in a consumer.

Read [`POLICY.md`](./POLICY.md) before rendering anything from this folder. It
states the judgment calls that the file contents alone do not show.

## Shape

One file per subject. Each holds exactly one top-level key and no routing
metadata — there are no `consumers:`, `heading:`, or `archived:` keys. What
appears in a given document is decided per run by the skill rendering it, not
by a flag stored here.

Inline comments carry the reasoning behind a fact. Preserve them.

## Who Reads This

| Reader            | Lives in                                                  |
| ----------------- | --------------------------------------------------------- |
| `update-readme`   | `.claude/skills/update-readme/` in this repository        |
| `generate-resume` | `.claude/skills/generate-resume/` in this repository      |
| `update-website`  | `.claude/skills/update-website/` in `SiegeSailor/Website` |

## Constraint That Must Never Break

- **The facts here are verified** — see [`POLICY.md`](./POLICY.md#changes)
```

- [ ] **Step 3: Verify against the checklist**

Confirm by reading `POLICY.md`:

- [ ] StageSource named, with the course-team reason
- [ ] DY Game named, with the B.F.A.-internship reason
- [ ] Servicetech range-widening prohibited
- [ ] Stacked role lines protected, with the vendor-verification reason
- [ ] Shopee retention window defined precisely
- [ ] Contact details restricted to the resume document
- [ ] Verified-facts rule with the confirmation requirement

- [ ] **Step 4: Commit**

```bash
git add profile/POLICY.md profile/CLAUDE.md
git commit -m "docs: state the judgment calls the tags used to encode"
```

---

### Task 3: `verify-verbatim.mjs`

**Files:**

- Create: `.claude/skills/generate-resume/scripts/verify-verbatim.mjs`
- Create: `test/verify-verbatim.test.mjs`

**Interfaces:**

- Consumes: `profile/*.yaml` from Task 1.
- Produces: `export function verifyVerbatim(plan, sourceText) -> { ok: boolean, misses: Array<{ path: string, value: string, nearest: string | null }> }` and `export function readSourceText(dir) -> string`. Task 4's renderer refuses to run when `ok` is false without explicit confirmation.

This is the mechanism that replaces node ids. It lets the model select, reorder, and drop freely, while making paraphrase and invention impossible to ship silently.

- [ ] **Step 1: Write the failing test**

`test/verify-verbatim.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  verifyVerbatim,
  readSourceText,
} from "../.claude/skills/generate-resume/scripts/verify-verbatim.mjs";
import { join } from "node:path";

const SOURCE = `
summary:
  - text: >-
      Senior software engineer working on distributed systems
      and developer infrastructure.
experience:
  - company: CooperSurgical
    bullets:
      - text: >-
          Cut RFID data-transition time by 90% with database caching
          and gRPC streaming
`;

test("a plan quoting the source verbatim passes", () => {
  const plan = {
    sections: [
      {
        key: "experience",
        heading: "Work Experience",
        entries: [
          {
            company: "CooperSurgical",
            bullets: [
              "Cut RFID data-transition time by 90% with database caching and gRPC streaming",
            ],
          },
        ],
      },
    ],
  };
  const result = verifyVerbatim(plan, SOURCE);
  assert.equal(result.ok, true);
  assert.deepEqual(result.misses, []);
});

test("folded YAML line breaks do not cause a false miss", () => {
  const plan = {
    sections: [
      {
        key: "summary",
        heading: "Summary",
        text: "Senior software engineer working on distributed systems and developer infrastructure.",
      },
    ],
  };
  assert.equal(verifyVerbatim(plan, SOURCE).ok, true);
});

test("a reworded bullet is caught and its nearest source line reported", () => {
  const plan = {
    sections: [
      {
        key: "experience",
        heading: "Work Experience",
        entries: [
          {
            company: "CooperSurgical",
            bullets: [
              "Cut RFID transition time by 90% using caching and streaming",
            ],
          },
        ],
      },
    ],
  };
  const result = verifyVerbatim(plan, SOURCE);
  assert.equal(result.ok, false);
  assert.equal(result.misses.length, 1);
  assert.match(result.misses[0].value, /Cut RFID transition time/);
  assert.match(
    result.misses[0].nearest,
    /Cut RFID data-transition time by 90%/,
  );
});

test("an invented bullet is caught with no nearest match", () => {
  const plan = {
    sections: [
      {
        key: "experience",
        heading: "Work Experience",
        entries: [
          {
            company: "CooperSurgical",
            bullets: ["Led a team of 5 vendor engineers"],
          },
        ],
      },
    ],
  };
  const result = verifyVerbatim(plan, SOURCE);
  assert.equal(result.ok, false);
  assert.equal(result.misses[0].nearest, null);
});

test("headings and keys are exempt — they come from layout.md, not profile/", () => {
  const plan = {
    sections: [
      {
        key: "summary",
        heading: "Summary",
        text: "Senior software engineer working on distributed systems and developer infrastructure.",
      },
    ],
  };
  const result = verifyVerbatim(plan, SOURCE);
  assert.equal(result.ok, true);
});

test("readSourceText concatenates every YAML file in the directory", () => {
  const text = readSourceText(join(import.meta.dirname, "../profile"));
  assert.match(text, /CooperSurgical/);
  assert.match(text, /Shopee/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../verify-verbatim.mjs'`.

- [ ] **Step 3: Write the implementation**

`.claude/skills/generate-resume/scripts/verify-verbatim.mjs`:

```js
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Keys whose values are chosen by reference/layout.md rather than taken from
// profile/, so they have no source string to match.
const EXEMPT = new Set(["key", "heading", "audience", "pageLimit"]);

const normalise = (value) => String(value).replace(/\s+/g, " ").trim();

export const readSourceText = (dir) =>
  normalise(
    readdirSync(dir)
      .filter((file) => /\.ya?ml$/.test(file))
      .map((file) => readFileSync(join(dir, file), "utf8"))
      .join("\n"),
  );

// The longest run of leading words from `value` that still occurs in the
// source. Empty means nothing recognisable — an invention rather than a
// rewording, which is the more serious of the two.
const nearest = (value, haystack) => {
  const words = value.split(" ");
  let match = "";
  for (let count = 1; count <= words.length; count += 1) {
    const candidate = words.slice(0, count).join(" ");
    if (!haystack.includes(candidate)) break;
    match = candidate;
  }
  if (match.split(" ").length < 3) return null;
  const start = haystack.indexOf(match);
  return haystack.slice(
    start,
    start + Math.max(match.length, value.length) + 20,
  );
};

const walk = (node, path, visit) => {
  if (typeof node === "string") return visit(node, path);
  if (Array.isArray(node))
    return node.forEach((item, index) =>
      walk(item, `${path}[${index}]`, visit),
    );
  if (node && typeof node === "object")
    for (const [key, value] of Object.entries(node)) {
      if (EXEMPT.has(key)) continue;
      walk(value, path ? `${path}.${key}` : key, visit);
    }
};

export function verifyVerbatim(plan, sourceText) {
  const haystack = normalise(sourceText);
  const misses = [];

  walk(plan, "", (value, path) => {
    const needle = normalise(value);
    if (!needle || haystack.includes(needle)) return;
    misses.push({ path, value: needle, nearest: nearest(needle, haystack) });
  });

  return { ok: misses.length === 0, misses };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 9 tests total (3 from Task 1, 6 here), 0 failures.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/generate-resume/scripts/verify-verbatim.mjs test/verify-verbatim.test.mjs
git commit -m "feat: block reworded facts from reaching a rendered document"
```

---

### Task 4: `build-resume.mjs` — render an approved plan

**Files:**

- Create: `.claude/skills/generate-resume/scripts/build-resume.mjs`
- Create: `test/build-resume.test.mjs`
- Reference: `/Users/user/Documents/Website/source/tooling/scripts/build-resume.mjs` (the builder being ported)

**Interfaces:**

- Consumes: `verifyVerbatim` from Task 3.
- Produces: `export async function buildResume(plan, outputDir) -> string` (absolute path to the written `.docx`). Task 5 converts that file; Task 6 invokes this through the skill.

**The port.** Copy the reference builder and change exactly these things. Everything else — `splitLine`, `sectionHeader`, `bullet`, `bodyLine`, `clean`, the `FONT`/`SZ`/`SPACE`/`RIGHT_TAB` constants, the numbering config, the page size and margins — is carried over **byte-for-byte**. Those values encode the one-page fit and the ATS constraints, and changing any of them invalidates the layout parity check in Task 6.

1. Delete the `loadContent` import and the `const { data: DATA, headings: HEADINGS } = loadContent("resume")` line. The plan is the input.
2. Delete the `VERSION` read of the root `package.json` and the `keywords: \`v${VERSION}\`` document property. No version is stamped any more.
3. Replace `heading(key)` with the section's own `heading` field from the plan.
4. Change each `buildX()` to take its section object rather than reach into
   `DATA`. Two exceptions: `buildHeader(plan)` takes the whole plan, because it
   reads `plan.identity` and `plan.contact` rather than a section; and
   `buildSchools(section)` drops its `key` parameter, since the heading now
   arrives on the section.
5. Change `bullets.map((b) => bullet(b.text))` to `bullets.map(bullet)` — the plan carries bare strings.
6. Change the section list from a fixed sequence of `buildX()` calls to a dispatch over `plan.sections` in the order the plan gives, so the model controls section order within the constraints `reference/layout.md` states.
7. Export `buildResume(plan, outputDir)` instead of running on import. Remove the trailing `convert(await buildDocument())`.

**Plan shape** — this is the contract between the model and the renderer:

```json
{
  "pageLimit": 1,
  "audience": "distributed systems / developer infrastructure",
  "identity": {
    "legal": "Jin Yu (Ken) Zhang",
    "display": "Jin Yu (Ken) Zhang"
  },
  "contact": { "line1": "…", "line2": "…" },
  "sections": [
    { "key": "summary", "heading": "Summary", "text": "…" },
    {
      "key": "skills",
      "heading": "Skills",
      "rows": [{ "label": "Languages", "items": "C++, Python, …" }]
    },
    {
      "key": "experience",
      "heading": "Work Experience",
      "entries": [
        {
          "company": "CooperSurgical",
          "location": "NJ / MA / CT, USA",
          "blurb": "Medical device R&D — …",
          "roles": [
            {
              "title": "Senior Software Engineer",
              "dates": "Jun 2025 – Present"
            }
          ],
          "bullets": ["…", "…"]
        }
      ]
    },
    { "key": "publications", "heading": "Publications", "items": ["…"] },
    {
      "key": "education",
      "heading": "Education",
      "entries": [
        {
          "school": "Boston University",
          "degree": "M.S. in Computer Science",
          "dates": "May 2022 – Jan 2024",
          "details": ["…"]
        }
      ]
    },
    { "key": "certifications", "heading": "Certifications", "entries": [] },
    { "key": "activities", "heading": "Activities", "items": ["…"] }
  ]
}
```

- [ ] **Step 1: Write the failing test**

`test/build-resume.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { buildResume } from "../.claude/skills/generate-resume/scripts/build-resume.mjs";

const PLAN = {
  pageLimit: 1,
  identity: { legal: "Jin Yu (Ken) Zhang", display: "Jin Yu (Ken) Zhang" },
  contact: { line1: "NYC Metropolitan Area", line2: "jinyu-zhang.com" },
  sections: [
    { key: "summary", heading: "Summary", text: "Senior software engineer." },
    {
      key: "experience",
      heading: "Work Experience",
      entries: [
        {
          company: "CooperSurgical",
          location: "NJ, USA",
          roles: [
            { title: "Senior Software Engineer", dates: "Jun 2025 – Present" },
            { title: "Software Engineer", dates: "Jan 2024 – May 2025" },
          ],
          bullets: ["Architected a cross-product device SDK"],
        },
      ],
    },
  ],
};

const build = async () => {
  const dir = mkdtempSync(join(tmpdir(), "resume-"));
  const file = await buildResume(PLAN, dir);
  // A .docx is a zip; document.xml holds the body.
  const xml = execFileSync("unzip", [
    "-p",
    file,
    "word/document.xml",
  ]).toString();
  return { file, xml };
};

test("writes a .docx", async () => {
  const { file } = await build();
  assert.match(file, /\.docx$/);
  assert.ok(readFileSync(file).length > 0);
});

test("never emits a literal bullet character in the body", async () => {
  const { xml } = await build();
  assert.ok(!xml.includes("•"), "found a literal • in document.xml");
});

test("renders the selected bullet text", async () => {
  const { xml } = await build();
  assert.ok(xml.includes("Architected a cross-product device SDK"));
});

test("keeps stacked role lines as separate paragraphs", async () => {
  const { xml } = await build();
  assert.ok(xml.includes("Senior Software Engineer"));
  assert.ok(xml.includes("Software Engineer"));
  assert.ok(xml.includes("Jun 2025 – Present"));
  assert.ok(xml.includes("Jan 2024 – May 2025"));
});

test("right-aligns dates with a tab, not spaces", async () => {
  const { xml } = await build();
  assert.ok(
    xml.includes("<w:tab/>"),
    "expected a literal tab run for the date",
  );
  assert.ok(
    !/ {3,}Jun 2025/.test(xml),
    "dates must not be positioned with spaces",
  );
});

test("uses no tables, text boxes, headers, or footers", async () => {
  const { xml } = await build();
  for (const tag of ["<w:tbl>", "<w:txbxContent>", "<w:hdr>", "<w:ftr>"]) {
    assert.ok(!xml.includes(tag), `${tag} breaks ATS parsing`);
  }
});

test("renders sections in the order the plan gives", async () => {
  const { xml } = await build();
  assert.ok(xml.indexOf("Summary") < xml.indexOf("Work Experience"));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../build-resume.mjs'`.

- [ ] **Step 3: Port the builder**

Apply the seven changes above to a copy of the reference file. The section dispatch replacing the fixed `children:` array:

```js
const BUILDERS = {
  summary: buildSummary,
  skills: buildSkills,
  experience: buildExperience,
  publications: buildPublications,
  education: buildSchools,
  certifications: buildSchools,
  activities: buildActivities,
};

const buildSections = (plan) =>
  plan.sections.flatMap((section) => {
    const build = BUILDERS[section.key];
    if (!build)
      throw new Error(
        `plan section "${section.key}" has no builder; known keys are ${Object.keys(BUILDERS).join(", ")}`,
      );
    return build(section);
  });
```

and the exported entry point:

```js
export async function buildResume(plan, outputDir) {
  const doc = new Document({
    title: `${clean(plan.identity.display)} — Resume`,
    creator: clean(plan.identity.display),
    subject: "Resume",
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
              text: "\u2022",
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
        children: [...buildHeader(plan), ...buildSections(plan)],
      },
    ],
  });

  mkdirSync(outputDir, { recursive: true });
  const file = join(outputDir, "JinYu-Zhang-Resume.docx");
  writeFileSync(file, await Packer.toBuffer(doc));
  return file;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 16 tests total, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/generate-resume/scripts/build-resume.mjs test/build-resume.test.mjs
git commit -m "feat: render an approved resume plan to docx"
```

---

### Task 5: `check-pages.mjs` — convert and assert the page count

**Files:**

- Create: `.claude/skills/generate-resume/scripts/check-pages.mjs`
- Create: `test/check-pages.test.mjs`

**Interfaces:**

- Consumes: the `.docx` path returned by `buildResume` from Task 4.
- Produces: `export function checkPages(docxPath, outputDir, pageLimit) -> { pdf: string | null, pages: number | null, status: "ok" | "over" | "unverified", reason?: string }`.

**The behaviour change from the reference implementation.** Today's builder exits 0 when `soffice` or `pdfinfo` is missing, so a host build proves nothing about the one-page constraint — `source/tooling/CLAUDE.md` names this as "the one that is silent when broken." This version returns `status: "unverified"` with a reason, and the skill reports it. It never reports success it did not verify.

- [ ] **Step 1: Write the failing test**

`test/check-pages.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildResume } from "../.claude/skills/generate-resume/scripts/build-resume.mjs";
import { checkPages } from "../.claude/skills/generate-resume/scripts/check-pages.mjs";

const PLAN = {
  pageLimit: 1,
  identity: { legal: "Jin Yu (Ken) Zhang", display: "Jin Yu (Ken) Zhang" },
  contact: { line1: "NYC Metropolitan Area", line2: "jinyu-zhang.com" },
  sections: [
    { key: "summary", heading: "Summary", text: "Senior software engineer." },
  ],
};

test("a short resume converts and reports one page", async () => {
  const dir = mkdtempSync(join(tmpdir(), "pages-"));
  const result = checkPages(await buildResume(PLAN, dir), dir, 1);
  assert.equal(result.status, "ok");
  assert.equal(result.pages, 1);
  assert.match(result.pdf, /\.pdf$/);
});

test("reports unverified rather than ok when the toolchain is absent", async () => {
  const dir = mkdtempSync(join(tmpdir(), "pages-"));
  const docx = await buildResume(PLAN, dir);
  const path = process.env.PATH;
  process.env.PATH = "/nonexistent";
  try {
    const result = checkPages(docx, dir, 1);
    assert.equal(result.status, "unverified");
    assert.equal(result.pages, null);
    assert.match(result.reason, /LibreOffice|soffice/i);
  } finally {
    process.env.PATH = path;
  }
});

test("reports over when the document exceeds the limit", async () => {
  const dir = mkdtempSync(join(tmpdir(), "pages-"));
  const long = {
    ...PLAN,
    sections: [
      {
        key: "activities",
        heading: "Activities",
        items: Array.from(
          { length: 400 },
          (_, index) => `Line number ${index} of filler text`,
        ),
      },
    ],
  };
  const result = checkPages(await buildResume(long, dir), dir, 1);
  assert.equal(result.status, "over");
  assert.ok(result.pages > 1);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../check-pages.mjs'`.

- [ ] **Step 3: Write the implementation**

```js
import { execSync } from "node:child_process";

const SOFFICE = process.env.SOFFICE_CMD ?? "soffice --headless";

const has = (command) => {
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

export function checkPages(docxPath, outputDir, pageLimit = 1) {
  if (!has(SOFFICE))
    return {
      pdf: null,
      pages: null,
      status: "unverified",
      reason:
        "LibreOffice (soffice) is not on PATH, so the page count was not checked",
    };

  execSync(
    `${SOFFICE} --convert-to pdf --outdir "${outputDir}" "${docxPath}"`,
    { stdio: "ignore" },
  );
  const pdf = docxPath.replace(/\.docx$/, ".pdf");

  if (!has("pdfinfo"))
    return {
      pdf,
      pages: null,
      status: "unverified",
      reason:
        "pdfinfo (poppler) is not on PATH, so the page count was not checked",
    };

  const pages = Number(
    execSync(`pdfinfo "${pdf}"`)
      .toString()
      .match(/^Pages:\s+(\d+)$/m)?.[1],
  );
  return { pdf, pages, status: pages <= pageLimit ? "ok" : "over" };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 19 tests total, 0 failures. The conversion tests take a few seconds each; LibreOffice is slow to start.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/generate-resume/scripts/check-pages.mjs test/check-pages.test.mjs
git commit -m "feat: assert the page count instead of passing silently"
```

---

### Task 6: The `generate-resume` skill

**Files:**

- Create: `.claude/skills/generate-resume/SKILL.md`
- Create: `.claude/skills/generate-resume/reference/layout.md`

**Interfaces:**

- Consumes: `buildResume` (Task 4), `checkPages` (Task 5), `verifyVerbatim` + `readSourceText` (Task 3), `profile/` (Task 1), `POLICY.md` (Task 2).
- Produces: a user-invocable skill. No code depends on it.

- [ ] **Step 1: Write `reference/layout.md`**

The document-format constraints, as distinct from the content policy in `profile/POLICY.md`:

```markdown
# Resume Layout

Format rules for the rendered document. Content rules live in
[`profile/POLICY.md`](../../../../profile/POLICY.md).

## Hard Constraints

- One US-Letter page unless the request overrides the limit.
- ATS-safe: single column; no tables, text boxes, headers, or footers.
- Never emit a literal `•`. Bullets come from the numbering configuration as
  native Word bullets.
- Dates are right-aligned with a right tab stop and a literal tab in the run,
  never with spaces. LibreOffice ignores the docx `PositionalTab`.
- Calibri. Sizes in half-points; spacing and indents in twips.
- The `.docx` is the primary deliverable; the `.pdf` is a convenience.

## Section Names

Use exactly these, because ATS parsers match on them:

`Summary`, `Skills`, `Work Experience`, `Publications`, `Education`,
`Certifications`, `Activities`

## Section Order

The order above is the default and is ATS-sensitive. Reorder only when the
request gives a reason, and never move `Work Experience` below `Education` for
a role requiring professional experience.

## Fitting One Page

Spacing is already tight, so fit by dropping content, not by shrinking type.
Drop in this order:

1. `Activities`, then `Publications`, unless the audience is academic
2. The lowest-ranked bullets from the oldest roles
3. Company blurbs
4. Whole roles older than ten years, subject to `POLICY.md`

Never drop a role to make room while keeping a more junior one from the same
employer — that reads as a gap.
```

- [ ] **Step 2: Write `SKILL.md`**

```markdown
---
name: generate-resume
description: Use when generating or tailoring a resume for a job posting, an application, or a stated audience, including requests naming a page limit or required sections.
---

# Generate Resume

Renders a resume from `profile/` for a specific requirement. The model chooses
what appears; code guarantees that what appears is what the source says.

## Inputs

| Input                       | Default                                      |
| --------------------------- | -------------------------------------------- |
| Page limit                  | 1                                            |
| Target audience             | ask if not given                             |
| Required sections           | none beyond Summary, Skills, Work Experience |
| Posting or requirement text | optional                                     |

Output lands in the working directory. No run history is kept — this skill
always reads the current `profile/`, which is local to this repository.

## Process

1. Read `profile/*.yaml`, `profile/POLICY.md`, and `reference/layout.md`.
2. Build a plan — ordered sections, and for each the exact strings selected
   from `profile/`. Copy strings; do not retype or rephrase them.
3. Verify: `verifyVerbatim(plan, readSourceText("profile"))`. Any miss is
   reported beside its nearest source match, and requires explicit
   confirmation before rendering. Never confirm on the user's behalf.
4. Render: `buildResume(plan, outputDir)`.
5. Check: `checkPages(docx, outputDir, pageLimit)`.
   - `ok` — report the path and the page count.
   - `over` — drop selections per `reference/layout.md` and re-render.
   - `unverified` — say the page count was **not** checked, and why. Never
     report success for an unverified document.

## Constraints That Must Never Break

- **Never print a string absent from `profile/` without confirmation** — the
  verifier exists because a background-check vendor reads these facts
- **Never violate `POLICY.md`** — it holds the judgment calls that the YAML
  alone does not show
```

- [ ] **Step 3: Verify layout parity against the current document**

Generate a resume selecting the same content the existing builder prints, then compare against the document the old pipeline produces.

```bash
cd /Users/user/Documents/Website && npm run build:resume
cd /Users/user/Documents/SiegeSailor
```

Then invoke the skill in this repository with: _"Generate a resume, one page,
audience: the same content the current document prints."_ Approve no verifier
misses — a miss here means the port changed a string, not that the model chose
to reword. Then compare:

```bash
pdftotext -layout /Users/user/Documents/Website/source/tooling/export/resume/JinYu-Zhang-Resume.pdf /tmp/old.txt
pdftotext -layout ./JinYu-Zhang-Resume.pdf /tmp/new.txt
diff /tmp/old.txt /tmp/new.txt
pdfinfo ./JinYu-Zhang-Resume.pdf | grep Pages
```

Expected: `diff` shows only differences you can account for by selection choices. `Pages: 1`. Investigate any spacing, font, or alignment difference before continuing — the old builder is deleted in Plan 3, and this is the last chance to compare.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/generate-resume/
git commit -m "feat: add the generate-resume skill"
```

---

### Task 7: The `update-readme` skill

**Files:**

- Create: `.claude/skills/update-readme/SKILL.md`
- Create: `.claude/skills/update-readme/scripts/build-readme.mjs`
- Create: `test/build-readme.test.mjs`
- Reference: `/Users/user/Documents/Website/source/tooling/scripts/build-readme.mjs`

**Interfaces:**

- Consumes: `profile/` (Task 1), `POLICY.md` (Task 2).
- Produces: `export function buildReadme({ identity, profile, summary, projects, media, site, timeline, versions, headings }) -> string`, and `export async function resolveVersions(projects) -> Record<string, string>`.

The README writes to `README.md` in this repository — the same repo. The current workflow clones `SiegeSailor/SiegeSailor` from the Website repo and pushes; that indirection disappears.

- [ ] **Step 1: Write the failing test**

`test/build-readme.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildReadme } from "../.claude/skills/update-readme/scripts/build-readme.mjs";

const INPUT = {
  identity: { display: "Jin Yu (Ken) Zhang" },
  profile: {
    headlines: ["Senior Software Engineer", "Distributed Systems"],
    status: { location: "NYC Metropolitan Area", position: "CooperSurgical" },
  },
  summary: "Senior software engineer working on distributed systems.",
  projects: [
    {
      title: "Website",
      href: "https://github.com/SiegeSailor/Website",
      stage: "Production",
    },
    {
      title: "Later",
      href: "https://github.com/SiegeSailor/Later",
      stage: "Planning",
    },
    {
      title: "Now",
      href: "https://github.com/SiegeSailor/Now",
      stage: "Development",
    },
  ],
  media: [{ label: "GitHub", href: "https://github.com/SiegeSailor" }],
  site: { domain: "jinyu-zhang.com" },
  timeline: { start: "2017-06-01", excluded: [] },
  versions: { "SiegeSailor/Website": "2.0.0" },
  headings: { summary: "Summary", projects: "Projects", media: "Links" },
};

test("hides Planning projects and orders Production before Development", () => {
  const readme = buildReadme(INPUT);
  assert.ok(!readme.includes("Later"), "Planning projects must not appear");
  assert.ok(readme.indexOf("Website") < readme.indexOf("Now"));
});

test("labels a project with its resolved version, or its stage when absent", () => {
  const readme = buildReadme(INPUT);
  assert.match(
    readme,
    /\[Website\]\(https:\/\/github\.com\/SiegeSailor\/Website\) — v2\.0\.0/,
  );
  assert.match(
    readme,
    /\[Now\]\(https:\/\/github\.com\/SiegeSailor\/Now\) — development/,
  );
});

test("computes experience from the timeline rather than printing a stated figure", () => {
  const readme = buildReadme(INPUT);
  assert.match(readme, /\d+ Years/);
  assert.ok(!readme.includes("undefined"));
});

test("subtracts excluded periods from the experience total", () => {
  const withGap = {
    ...INPUT,
    timeline: {
      start: "2017-06-01",
      excluded: [{ start: "2022-01-01", end: "2024-01-01" }],
    },
  };
  const full = buildReadme(INPUT).match(/(\d+) Years/)[1];
  const gapped = buildReadme(withGap).match(/(\d+) Years/)[1];
  assert.ok(Number(gapped) < Number(full));
});

test("marks the file as generated", () => {
  assert.match(buildReadme(INPUT), /do not edit by hand/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../build-readme.mjs'`.

- [ ] **Step 3: Port the builder**

Copy the reference file and change exactly these things; the `experienceYears`, `repoKey`, `versionLabel`, `STAGE_ORDER`, and `MILLISECOND_ONE_YEAR` logic carries over byte-for-byte.

1. Delete the `loadContent` / `loadVersions` imports and the `loadContent("readme")` call. Take an input object instead.
2. Delete the `heading(key)` throw-on-missing helper; headings come from the input.
3. Export `buildReadme(input)` returning the string rather than writing a file.
4. Add `resolveVersions(projects)`, moving the `gh api` release lookup out of the deleted `build-versions.mjs`: try `repos/{owner}/{repo}/releases/latest` for `tag_name`, fall back to `repos/{owner}/{repo}/tags` for `[0].name`, and return no entry on any failure. Never throw — a project without a version simply shows its stage.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 24 tests total, 0 failures.

- [ ] **Step 5: Write `SKILL.md`**

```markdown
---
name: update-readme
description: Use when updating, syncing, or regenerating the GitHub profile README from profile facts.
---

# Update README

Regenerates this repository's `README.md` — the GitHub profile README — from
`profile/`.

## Process

1. Read `profile/*.yaml` and `profile/POLICY.md`.
2. Resolve project versions with `resolveVersions(projects)`. Network failure
   is not fatal; a project without a version shows its stage instead.
3. Compose with `buildReadme(input)`. Experience is computed from
   `timeline.yaml` against today's date — never print a stated figure.
4. Show the diff against the current `README.md`.
5. Write only on confirmation.

## Constraints That Must Never Break

- **Never print contact details** — `POLICY.md` restricts the phone number and
  postal area to the resume document
- **Never hand-edit `README.md`** — change `profile/` and regenerate
```

- [ ] **Step 6: Verify against the README the workflow produces today**

```bash
cd /Users/user/Documents/Website && npm run build:versions && npm run build:readme
diff /Users/user/Documents/Website/source/tooling/export/SiegeSailor-README.md \
     /Users/user/Documents/SiegeSailor/README.md
```

Expected: differences only in the trailing generated-from line, which now names this repository rather than the website's `/about` page. Any other difference is a port bug.

- [ ] **Step 7: Commit and push**

```bash
git add .claude/skills/update-readme/ test/build-readme.test.mjs README.md
git commit -m "feat: add the update-readme skill"
git push -u origin main
```

---

## After This Plan

Plan 2 (`Claude-Plugins`, the conventional-commit plugin) and Plan 3 (the
Website refactor: `settings/content.ts`, the flatten, the deletions, and the
`update-website` skill) follow. Plan 3 depends on this repository being pushed,
because `update-website` fetches `profile/` from `SiegeSailor@main`.

Nothing in the Website repository changes until Plan 3. It keeps building and
deploying from its existing pipeline throughout.
