import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const captureRoot = path.join(repoRoot, "tests", "characterization", "faction-image", "captured");

function readJson(name: string) {
  return JSON.parse(fs.readFileSync(path.join(captureRoot, name), "utf8"));
}

describe("faction image characterization", () => {
  it("captures app-donor metadata and panels", () => {
    const routeMap = readJson("route-map.json");
    const uiBaseline = readJson("ui-baseline.json");

    expect(routeMap.classification).toBe("app donor");
    expect(routeMap.methodology).toBe("behavioral capture");
    expect(routeMap.basis).toBe("captured");
    expect(uiBaseline.panels).toEqual(expect.arrayContaining(["Layer stack", "Icon discovery", "Variant preview"]));
  });
});
