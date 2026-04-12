import { promises as fs } from "node:fs";
import path from "node:path";

type DraftRecord = {
  id: string;
  assetPath: string;
  category: string;
  keywords: string[];
};

function inferCategory(tokens: string[]): string {
  if (tokens.some((t) => ["sword", "blade", "dagger", "hammer"].includes(t))) return "weapon";
  if (tokens.some((t) => ["shield", "armor"].includes(t))) return "defense";
  if (tokens.some((t) => ["demon", "dragon", "beast", "angel"].includes(t))) return "creature";
  return "misc";
}

async function run() {
  const root = path.resolve(process.cwd(), "public/assets/delapouite");
  const files = (await fs.readdir(root)).filter((f) => f.endsWith(".svg"));
  const records: DraftRecord[] = files.map((file) => {
    const name = file.replace(/\.svg$/i, "");
    const tokens = name.split("-").map((t) => t.toLowerCase()).filter((t) => t.length > 2);
    return {
      id: `delapouite/${name}`,
      assetPath: `/assets/delapouite/${file}`,
      category: inferCategory(tokens),
      keywords: Array.from(new Set(tokens)),
    };
  });
  const output = {
    version: "1.0.0-draft",
    generatedAt: new Date().toISOString(),
    records,
  };
  await fs.mkdir(path.resolve(process.cwd(), "data/icons"), { recursive: true });
  await fs.writeFile(path.resolve(process.cwd(), "data/icons/keywords.draft.json"), JSON.stringify(output, null, 2), "utf8");
  process.stdout.write(`Wrote ${records.length} draft records.\n`);
}

void run();
