import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("donor import guard", () => {
  it("reports no forbidden runtime donor imports", () => {
    const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const output = execFileSync("node", ["scripts/check-donor-imports.mjs"], { cwd, encoding: "utf8" });
    expect(output).toContain("No forbidden donor runtime imports found.");
  });
});
