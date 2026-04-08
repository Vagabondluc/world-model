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
  if (!/\.(?:ts|tsx|js|jsx|mjs)$/.test(file)) {
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  const specifiers = [
    ...text.matchAll(/\bimport\b[\s\S]*?\bfrom\s*["']([^"']+)["']/g),
    ...text.matchAll(/\brequire\(\s*["']([^"']+)["']\s*\)/g)
  ]
    .map((match) => match[1])
    .filter(Boolean);

  for (const specifier of specifiers) {
    if (specifier.startsWith("@/donors/") || specifier.startsWith("./") || specifier.startsWith("../")) {
      continue;
    }
    for (const token of forbidden) {
      if (specifier.toLowerCase().includes(token.toLowerCase())) {
        hits.push(`${path.relative(root, file)} :: ${specifier}`);
      }
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
