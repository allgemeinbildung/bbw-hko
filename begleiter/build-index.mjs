#!/usr/bin/env node
/* Scans begleiter/markdowns/ and writes index.json with one entry per .md file.
 * Each entry: { file, titel, kompetenz, kompetenz_slug }
 * Run via:  npm run md:index   (or: node begleiter/build-index.mjs)
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const MD_DIR = join(HERE, "markdowns");
const OUT = join(MD_DIR, "index.json");

function parseFrontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
  if (!m) return {};
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const km = /^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/.exec(line);
    if (!km) continue;
    let v = km[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    meta[km[1]] = v;
  }
  return meta;
}

const entries = (await readdir(MD_DIR))
  .filter((f) => /\.(md|markdown)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, "de"));

const files = [];
for (const file of entries) {
  const raw = await readFile(join(MD_DIR, file), "utf8");
  const meta = parseFrontmatter(raw);
  files.push({
    file,
    titel: meta.titel || file.replace(/\.(md|markdown)$/i, ""),
    kompetenz: meta.kompetenz || "",
    kompetenz_slug: meta.kompetenz_slug || "",
  });
}

await writeFile(
  OUT,
  JSON.stringify({ generated: new Date().toISOString(), files }, null, 2) + "\n",
  "utf8"
);

console.log(`Wrote ${files.length} entr${files.length === 1 ? "y" : "ies"} → ${OUT}`);
