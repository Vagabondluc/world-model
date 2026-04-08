import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const forbidden = ["mythforge", "mechanical-sycophant", "to be merged", "antigravity"];
const hits = [];

function collectFiles(entry) {
  if (!fs.existsSync(entry)) {
    return [];
  }
  const stat = fs.statSync(entry);
  if (stat.isFile()) {
    return [entry];
  }
  const out = [];
  for (const child of fs.readdirSync(entry, { withFileTypes: true })) {
    if (child.name === "node_modules" || child.name === "dist" || child.name === "coverage") {
      continue;
    }
    out.push(...collectFiles(path.join(entry, child.name)));
  }
  return out;
}

for (const file of collectFiles(root)) {
  if (!/\.(?:ts|tsx|js|jsx|mjs|json)$/.test(file)) {
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  for (const token of forbidden) {
    const tokenPattern = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const importLike = new RegExp(`(?:import|from|require).*${tokenPattern}`, "i");
    if (importLike.test(text)) {
      hits.push(`${path.relative(root, file)} :: ${token}`);
    }
  }
}

if (hits.length > 0) {
  console.error("Forbidden donor runtime import references found:");
  for (const hit of hits) {
    console.error(`- ${hit}`);
  }
  process.exit(1);
}

console.log("No forbidden donor runtime imports found.");
