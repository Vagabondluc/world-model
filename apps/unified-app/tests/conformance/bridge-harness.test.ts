import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import exactnessManifest from "@/donors/exactness-manifest.json";

const workspaceRoot = path.resolve(process.cwd(), "../../..");

describe("phase 9B bridge harness", () => {
  it("has executable bridge tests for every donor in the exactness manifest", () => {
    const missingBridgeTests = Object.entries(exactnessManifest.donors)
      .flatMap(([donor, definition]) => definition.canonicalBridge.tests.map((testPath) => ({ donor, testPath })))
      .filter(({ testPath }) => !fs.existsSync(path.resolve(workspaceRoot, testPath)));

    expect(missingBridgeTests).toEqual([]);
  });
});
