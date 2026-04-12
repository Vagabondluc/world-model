import { promises as fs } from "node:fs";
import path from "node:path";

const draftPath = path.resolve(process.cwd(), "data/icons/keywords.draft.json");
const outPath = path.resolve(process.cwd(), "public/icons/keywords.index.json");

const draftRaw = await fs.readFile(draftPath, "utf8");
const draft = JSON.parse(draftRaw);
if (!Array.isArray(draft.records)) throw new Error("Invalid draft keywords format.");

const records = draft.records.map((r) => ({
  id: r.id,
  assetPath: r.assetPath,
  category: r.category || "misc",
  keywords: Array.isArray(r.keywords) ? Array.from(new Set(r.keywords.map((k) => String(k).toLowerCase()))) : [],
  domains: r.domains || {},
  quality: r.quality || {
    recolorQuality: 4,
    hasGradients: false,
    hasOpacity: false,
  },
}));

const output = {
  version: "1.0.0",
  generatedAt: new Date().toISOString(),
  records,
};

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, JSON.stringify(output, null, 2), "utf8");
process.stdout.write(`Built keywords index with ${records.length} records.\n`);
