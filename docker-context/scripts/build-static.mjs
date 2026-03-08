import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const BACKUP_FILE = ".static-build-overrides.json";
const SOURCE_ROOT = process.cwd();
const SOURCE_FILE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "dist",
  "export",
  "node_modules",
]);

const stripUseServerDirective = (source) =>
  source.replace(/^[\t ]*["']use server["'];\n{1,2}/, "");

const hasUseServerDirective = (source) =>
  /^[\t ]*["']use server["'];/.test(source.trimStart());

const collectSourceFiles = async (directoryPath) => {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORIES.has(entry.name)) {
        continue;
      }
      files.push(...(await collectSourceFiles(fullPath)));
      continue;
    }

    const extension = entry.name.slice(entry.name.lastIndexOf("."));
    if (SOURCE_FILE_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
};

const saveBackup = async (entries) => {
  await writeFile(BACKUP_FILE, JSON.stringify(entries), "utf8");
};

const prepare = async () => {
  const files = await collectSourceFiles(SOURCE_ROOT);
  const entries = [];

  for (const filePath of files) {
    const source = await readFile(filePath, "utf8");

    if (!hasUseServerDirective(source)) {
      continue;
    }

    entries.push({ filePath: relative(SOURCE_ROOT, filePath), source });
    await writeFile(filePath, stripUseServerDirective(source), "utf8");
  }

  await saveBackup(entries);
  await rm("export", { recursive: true, force: true });
};

const restore = async () => {
  let entries;

  try {
    const raw = await readFile(BACKUP_FILE, "utf8");
    entries = JSON.parse(raw);
  } catch {
    return;
  }

  for (const entry of entries) {
    await writeFile(join(SOURCE_ROOT, entry.filePath), entry.source, "utf8");
  }

  await rm(BACKUP_FILE, { force: true });
};

const mode = process.argv[2];

if (mode === "prepare") {
  await prepare();
} else if (mode === "restore") {
  await restore();
} else {
  throw new Error("Usage: node ./scripts/build-static.mjs <prepare|restore>");
}
