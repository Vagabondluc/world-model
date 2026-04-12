import { promises as fs } from "node:fs";
import path from "node:path";

type RecordShape = {
  id: string;
  assetPath: string;
  category: string;
  keywords: string[];
};

async function run() {
  const target = path.resolve(process.cwd(), "public/icons/keywords.index.json");
  const raw = await fs.readFile(target, "utf8");
  const parsed = JSON.parse(raw) as { records?: RecordShape[] };
  if (!Array.isArray(parsed.records)) throw new Error("records[] missing");
  const ids = new Set<string>();
  for (const row of parsed.records) {
    if (!row.id || !row.assetPath || !row.category) throw new Error(`invalid row: ${JSON.stringify(row)}`);
    if (!Array.isArray(row.keywords) || row.keywords.length < 2) throw new Error(`keyword coverage too low: ${row.id}`);
    if (ids.has(row.id)) throw new Error(`duplicate id: ${row.id}`);
    ids.add(row.id);
  }
  process.stdout.write(`Validated ${parsed.records.length} records.\n`);
}

void run();
