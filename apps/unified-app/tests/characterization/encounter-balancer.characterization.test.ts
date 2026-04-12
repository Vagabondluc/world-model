import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const captureRoot = path.join(repoRoot, "tests", "characterization", "encounter-balancer", "captured");

function readJson(name: string) {
  return JSON.parse(fs.readFileSync(path.join(captureRoot, name), "utf8"));
}

describe("encounter balancer characterization", () => {
  it("freezes scaffold-copy donor baseline and clone-equivalence metadata", () => {
    const routeMap = readJson("route-map.json");
    const report = readJson("characterization-report.json");

    expect(routeMap.classification).toBe("scaffold-copy donor");
    expect(routeMap.basis).toBe("reconstructed");
    expect(report.sourceInventory.length).toBeGreaterThanOrEqual(4);
  });
});
