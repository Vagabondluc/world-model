import { promises as fs } from "node:fs";
import path from "node:path";

function inferCategory(tokens) {
  if (tokens.some((t) => ["sword", "blade", "dagger", "hammer"].includes(t))) return "weapon";
  if (tokens.some((t) => ["shield", "armor"].includes(t))) return "defense";
  if (tokens.some((t) => ["demon", "dragon", "beast", "angel"].includes(t))) return "creature";
  return "misc";
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

const root = path.resolve(process.cwd(), "icons");
const files = await collectSvgFiles(root);
const records = files.map((absolutePath) => {
  const relative = path.relative(root, absolutePath).replace(/\\/g, "/");
  const name = relative.replace(/\.svg$/i, "");
  const tokens = name
    .split(/[/-]/g)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 1);
  return {
    id: `icon/${name}`,
    assetPath: `/icons/${relative}`,
    category: inferCategory(tokens),
    keywords: Array.from(new Set(tokens)),
    domains: {},
    quality: {
      recolorQuality: 4,
      hasGradients: false,
      hasOpacity: false,
    },
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
