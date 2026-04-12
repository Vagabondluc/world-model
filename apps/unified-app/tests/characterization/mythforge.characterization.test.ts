import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const captureRoot = path.join(repoRoot, "tests", "characterization", "mythforge", "captured");

function readJson(name: string) {
  return JSON.parse(fs.readFileSync(path.join(captureRoot, name), "utf8"));
}

describe("mythforge characterization", () => {
  it("captures the runnable donor route and main panels", () => {
    const routeMap = readJson("route-map.json");
    const uiBaseline = readJson("ui-baseline.json");

    expect(routeMap.classification).toBe("app donor");
    expect(routeMap.methodology).toBe("behavioral capture");
    expect(routeMap.basis).toBe("captured");
    expect(routeMap.routes).toContain("/");
    expect(uiBaseline.basis).toBe("captured");
    expect(uiBaseline.panels).toEqual(expect.arrayContaining(["TopNav", "ExplorerTree", "Workspace"]));
    expect(uiBaseline.controls).toEqual(expect.arrayContaining(["New World", "Open World", "Save Canonical"]));
  });

  it("records full source coverage for the captured donor files", () => {
    const report = readJson("characterization-report.json");
    expect(report.coverage.existingSources).toBe(report.coverage.expectedSources);
    expect(report.coverage.missingSources).toBe(0);
  });
});
