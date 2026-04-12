import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const captureRoot = path.join(repoRoot, "tests", "characterization", "orbis", "captured");

function readJson(name: string) {
  return JSON.parse(fs.readFileSync(path.join(captureRoot, name), "utf8"));
}

describe("orbis characterization", () => {
  it("freezes the donor as an app donor with behavioral capture baseline", () => {
    const routeMap = readJson("route-map.json");
    const report = readJson("characterization-report.json");

    expect(routeMap.classification).toBe("app donor");
    expect(routeMap.methodology).toBe("behavioral capture");
    expect(routeMap.basis).toBe("captured");
    expect(report.parityTarget).toBe("exact+adapted");
    expect(report.coverage.existingSources).toBeGreaterThanOrEqual(1);
  });

  it("captures the simulation panels required by the rehost surface", () => {
    const uiBaseline = readJson("ui-baseline.json");
    expect(uiBaseline.panels).toEqual(
      expect.arrayContaining(["Simulation profile", "Enabled domains", "Snapshots", "Event stream"])
    );
  });
});
