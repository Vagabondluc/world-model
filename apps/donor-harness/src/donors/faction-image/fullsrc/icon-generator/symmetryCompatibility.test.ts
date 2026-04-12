import { describe, expect, it } from "vitest";
import { getSymmetryCompatibility } from "./symmetryCompatibility";

describe("symmetry compatibility warnings", () => {
  it("warns for known awkward combinations", () => {
    expect(getSymmetryCompatibility("rot-8", "triangle")).toBe("warn");
    expect(getSymmetryCompatibility("radial-16", "triangle")).toBe("warn");
    expect(getSymmetryCompatibility("mirror-vh", "triangle")).toBe("warn");
  });

  it("returns good for compatible defaults", () => {
    expect(getSymmetryCompatibility("rot-4", "square")).toBe("good");
    expect(getSymmetryCompatibility("radial-8", "circle")).toBe("good");
    expect(getSymmetryCompatibility("none", "triangle")).toBe("good");
  });

  it("normalizes shape aliases", () => {
    expect(getSymmetryCompatibility("rot-4", "diamond")).toBe("good");
    expect(getSymmetryCompatibility("rot-8", "sun")).toBe("good");
  });
});

