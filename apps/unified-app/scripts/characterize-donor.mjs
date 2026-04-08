import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(appRoot, "..", "..");
const workspaceRoot = path.resolve(repoRoot, "..");

const DONOR_CONFIG = {
  mythforge: {
    label: "Mythforge",
    classification: "app donor",
    methodology: "behavioral capture",
    basis: "captured",
    sources: [
      "mythforge/package.json",
      "mythforge/src/app/page.tsx",
      "mythforge/src/components/mythosforge/TopNav.tsx",
      "mythforge/src/components/mythosforge/ExplorerTree.tsx",
      "mythforge/src/components/mythosforge/Workspace.tsx"
    ],
    routes: ["/"],
    panels: ["TopNav", "ExplorerTree", "Workspace"],
    controls: ["New World", "Open World", "Save Canonical", "New Entity", "Grid", "Graph"],
    states: ["loading canonical bundle", "saving canonical bundle", "no entities yet"]
  },
  orbis: {
    label: "Orbis",
    classification: "semantic-only donor",
    methodology: "designed intent authoring",
    basis: "designed",
    sources: [
      "world-model/docs/adapters/ORBIS_ADAPTER.md",
      "to be merged/Orbis Spec 2.0/Orbis 1.0/.env.local"
    ],
    routes: ["/donor/orbis"],
    panels: ["Simulation profile", "Enabled domains", "Snapshots", "Event stream"],
    controls: ["Inspect import", "View migration"],
    states: ["no simulation attachment", "no domain toggles", "no events"]
  },
  "adventure-generator": {
    label: "Adventure Generator",
    classification: "fragment donor",
    methodology: "intent reconstruction",
    basis: "reconstructed",
    sources: [
      "world-model/docs/adapters/ADVENTURE_GENERATOR_ADAPTER.md",
      "to be merged/dungeon generator/zai2/next-env.d.ts",
      "to be merged/dungeon generator/zai2/.next"
    ],
    routes: ["/donor/adventure-generator"],
    panels: ["Workflow registry", "Guided steps", "Checkpoints", "Generated outputs"],
    controls: ["Create linked entity", "Start generator"],
    states: ["no workflow records", "no checkpoints", "no outputs"]
  }
};

function resolveWorkspacePath(relativePath) {
  return path.resolve(workspaceRoot, relativePath);
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function characterize(donor) {
  const config = DONOR_CONFIG[donor];
  if (!config) {
    throw new Error(`Unsupported donor: ${donor}`);
  }

  const captureRoot = path.resolve(repoRoot, "tests", "characterization", donor, "captured");
  const sourceInventory = config.sources.map((relativePath) => {
    const absolutePath = resolveWorkspacePath(relativePath);
    return {
      relativePath,
      absolutePath,
      exists: fs.existsSync(absolutePath),
      kind: fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory() ? "directory" : "file"
    };
  });

  const existing = sourceInventory.filter((entry) => entry.exists);
  const missing = sourceInventory.filter((entry) => !entry.exists);
  const routeMap = {
    donor,
    label: config.label,
    classification: config.classification,
    methodology: config.methodology,
    basis: config.basis,
    routes: config.routes
  };
  const uiBaseline = {
    donor,
    basis: config.basis,
    panels: config.panels,
    controls: config.controls,
    visibleStates: config.states
  };
  const report = {
    donor,
    label: config.label,
    classification: config.classification,
    methodology: config.methodology,
    basis: config.basis,
    sourceInventory,
    coverage: {
      expectedSources: sourceInventory.length,
      existingSources: existing.length,
      missingSources: missing.length
    },
    parityTarget: donor === "mythforge" ? "exact+adapted" : "adapted+waived",
    unstableSurfaces: missing.map((entry) => entry.relativePath)
  };

  writeJson(path.join(captureRoot, "route-map.json"), routeMap);
  writeJson(path.join(captureRoot, "ui-baseline.json"), uiBaseline);
  writeJson(path.join(captureRoot, "characterization-report.json"), report);

  return report;
}

const donor = process.argv[2];
if (!donor) {
  console.error("usage: node scripts/characterize-donor.mjs <donor>");
  process.exit(1);
}

const report = characterize(donor);
console.log(JSON.stringify(report, null, 2));
