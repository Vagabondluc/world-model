import { promises as fs } from "node:fs";
import path from "node:path";

const target = path.resolve(process.cwd(), "public/icons/keywords.index.json");
const raw = await fs.readFile(target, "utf8");
const parsed = JSON.parse(raw);
if (!Array.isArray(parsed.records)) throw new Error("records[] missing");
const ids = new Set();
for (const row of parsed.records) {
  if (!row.id || !row.assetPath || !row.category) throw new Error(`invalid row: ${JSON.stringify(row)}`);
  if (!Array.isArray(row.keywords) || row.keywords.length < 2) throw new Error(`keyword coverage too low: ${row.id}`);
  if (ids.has(row.id)) throw new Error(`duplicate id: ${row.id}`);
  ids.add(row.id);
}

async function collectSvgFiles(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".svg")) {
        out.push(absolute);
      }
    }
  }
  return out;
}

const iconsRoot = path.resolve(process.cwd(), "icons");
const expected = (await collectSvgFiles(iconsRoot)).length;
let allowExcluded = 0;
const exclusionsPath = path.resolve(process.cwd(), "data/icons/exclusions.json");
try {
  const exclusionsRaw = await fs.readFile(exclusionsPath, "utf8");
  const parsedExclusions = JSON.parse(exclusionsRaw);
  if (Array.isArray(parsedExclusions)) allowExcluded = parsedExclusions.length;
} catch {
  // optional file
}
const minimum = Math.max(0, expected - allowExcluded);
if (parsed.records.length < minimum) {
  throw new Error(`index coverage too low: records=${parsed.records.length}, expected>=${minimum} (icons=${expected}, exclusions=${allowExcluded})`);
}

process.stdout.write(`Validated ${parsed.records.length} records.\n`);
