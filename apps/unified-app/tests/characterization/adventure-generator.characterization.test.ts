import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const captureRoot = path.join(repoRoot, "tests", "characterization", "adventure-generator", "captured");

function readJson(name: string) {
  return JSON.parse(fs.readFileSync(path.join(captureRoot, name), "utf8"));
}

describe("adventure generator characterization", () => {
  it("freezes the donor as a fragment donor from surviving app residue", () => {
    const routeMap = readJson("route-map.json");
    const report = readJson("characterization-report.json");

    expect(routeMap.classification).toBe("fragment donor");
    expect(routeMap.methodology).toBe("intent reconstruction");
    expect(routeMap.basis).toBe("reconstructed");
    expect(report.coverage.existingSources).toBeGreaterThanOrEqual(2);
    expect(report.parityTarget).toBe("adapted+waived");
  });

  it("captures the guided workflow panels required by the rehost surface", () => {
    const uiBaseline = readJson("ui-baseline.json");
    expect(uiBaseline.panels).toEqual(
      expect.arrayContaining(["Workflow registry", "Guided steps", "Checkpoints", "Generated outputs"])
    );
  });
});
