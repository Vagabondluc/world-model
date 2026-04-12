import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const captureRoot = path.join(repoRoot, "tests", "characterization", "watabou-city", "captured");

function readJson(name: string) {
  return JSON.parse(fs.readFileSync(path.join(captureRoot, name), "utf8"));
}

describe("watabou city characterization", () => {
  it("freezes the clean-room donor as a rehostable app baseline", () => {
    const routeMap = readJson("route-map.json");
    const report = readJson("characterization-report.json");

    expect(routeMap.classification).toBe("clean-room app donor");
    expect(routeMap.basis).toBe("clean-room implementation");
    expect(report.parityTarget).toBe("exact clean-room rehost");
  });
});
