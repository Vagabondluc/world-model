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
    classification: "app donor",
    methodology: "behavioral capture",
    basis: "captured",
    sources: [
      "to be merged/true orbis/Orbis Spec 2.0/",
      "to be merged/true orbis/Orbis Spec 2.0/Orbis 1.0/",
      "world-model/docs/adapters/ORBIS_ADAPTER.md"
    ],
    routes: ["/", "/donor/orbis"],
    panels: ["Simulation profile", "Enabled domains", "Snapshots", "Event stream"],
    controls: ["Domain toggles", "Run simulation", "Inspect snapshot", "View event stream"],
    states: ["no domains enabled", "no snapshots", "no events"]
  },
  "adventure-generator": {
    label: "Adventure Generator",
    classification: "app donor",
    methodology: "behavioral capture",
    basis: "captured",
    sources: [
      "to be merged/dungeon generator/",
      "to be merged/dungeon generator/zai2/",
      "world-model/docs/adapters/ADVENTURE_GENERATOR_ADAPTER.md"
    ],
    routes: ["/", "/donor/adventure-generator"],
    panels: ["Workflow registry", "Guided steps", "Checkpoints", "Generated outputs"],
    controls: ["Create linked entity", "Start generator", "Resume", "Inspect output"],
    states: ["no workflow records", "no checkpoints", "no outputs"]
  },
  "mappa-imperium": {
    label: "Mappa Imperium",
    classification: "app donor",
    methodology: "behavioral capture",
    basis: "captured",
    sources: [
      "to be merged/mappa imperium/",
      "world-model/docs/donors/MAPPA_IMPERIUM.md"
    ],
    routes: ["/", "/donor/mappa-imperium"],
    panels: ["Era timeline", "Territory map", "Session controls"],
    controls: ["Create territory", "Advance era", "Link world"],
    states: ["no era active", "no territory selected", "no session state"]
  },
  "dawn-of-worlds": {
    label: "Dawn of Worlds",
    classification: "app donor",
    methodology: "behavioral capture",
    basis: "captured",
    sources: [
      "to be merged/world-builder-ui/",
      "world-model/docs/donors/DAWN_OF_WORLDS.md"
    ],
    routes: ["/", "/donor/dawn-of-worlds"],
    panels: ["World kind", "Turn controls", "Multiplayer session"],
    controls: ["Start turn", "Apply world command", "Sync session"],
    states: ["no world kind selected", "no active turn", "no multiplayer session"]
  },
  "faction-image": {
    label: "Sacred Sigil Generator",
    classification: "app donor",
    methodology: "behavioral capture",
    basis: "captured",
    sources: [
      "to be merged/faction-image/",
      "world-model/docs/donors/FACTION_IMAGE.md"
    ],
    routes: ["/", "/donor/faction-image"],
    panels: ["Layer stack", "Icon discovery", "Variant preview"],
    controls: ["Add layer", "Search icon", "Export sigil"],
    states: ["no layers", "no icons found", "no active variant"]
  },
  "watabou-city": {
    label: "Watabou City",
    classification: "clean-room app donor",
    methodology: "clean-room app characterization",
    basis: "clean-room implementation",
    sources: [
      "to be merged/watabou-city-clean-room/2nd/",
      "world-model/docs/donors/WATABOU_CITY.md"
    ],
    routes: ["/donor/watabou-city"],
    panels: ["City layout", "Seed controls", "Render options"],
    controls: ["Regenerate city", "Adjust seed", "Export map"],
    states: ["no seed", "no layout generated", "no export selected"]
  },
  "encounter-balancer": {
    label: "Encounter Balancer Scaffold",
    classification: "scaffold-copy donor",
    methodology: "representative baseline + clone-equivalence",
    basis: "reconstructed",
    sources: [
      "to be merged/apocalypse/",
      "to be merged/character-creator/",
      "to be merged/deity creator/",
      "to be merged/genesis/",
      "world-model/docs/donors/ENCOUNTER_BALANCER_SCAFFOLD.md"
    ],
    routes: ["/donor/encounter-balancer"],
    panels: ["Balancer tab", "Environmental tab"],
    controls: ["Adjust difficulty", "Set environment", "Preview encounter"],
    states: ["no encounter config", "no environment config", "no encounter output"]
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
    parityTarget: config.classification === "clean-room app donor" ? "exact clean-room rehost" : config.classification === "app donor" ? "exact+adapted" : "adapted+waived",
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
