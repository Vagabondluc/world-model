import { describe, expect, it } from "vitest";
import { buildIconSpec } from "./iconSpecBuilder";
import { getDomainPalette } from "./domainPalettes";

describe("buildIconSpec - batch 1 domain and complexity", () => {
  it("uses selected domain palette when no manual colors are provided", () => {
    const palette = getDomainPalette("arcane");
    const spec = buildIconSpec({
      seed: "domain-color-seed",
      domain: "arcane",
      mood: "gentle",
      baseShape: "circle",
      layerCount: 2,
      symmetry: "none",
    });

    const baseLayer = spec.layers.find((layer) => layer.id === "l0");
    expect(baseLayer).toBeDefined();
    expect(baseLayer?.fill).toBe(palette.primary);
    expect(baseLayer?.stroke).toBe(palette.secondary);
  });

  it("uses domain palette colors", () => {
    const palette = getDomainPalette("storm");
    const spec = buildIconSpec({
      seed: "dark-domain-seed",
      domain: "storm",
      mood: "gentle",
      baseShape: "circle",
      layerCount: 2,
      symmetry: "none",
    });

    const baseLayer = spec.layers.find((layer) => layer.id === "l0");
    expect(baseLayer).toBeDefined();
    expect(baseLayer?.fill).toBe(palette.primary);
    expect(baseLayer?.stroke).toBe(palette.secondary);
  });

  it("increases layer density and ornament rings at higher complexity", () => {
    const lowSpec = buildIconSpec({
      seed: "complexity-seed",
      mood: "mystic",
      symmetry: "none",
      layerCount: 4,
      complexity: 1,
      baseShape: "circle",
    });

    const highSpec = buildIconSpec({
      seed: "complexity-seed",
      mood: "mystic",
      symmetry: "none",
      layerCount: 4,
      complexity: 5,
      baseShape: "circle",
    });

    const lowRings = lowSpec.layers.filter((layer) => layer.type === "ring").length;
    const highRings = highSpec.layers.filter((layer) => layer.type === "ring").length;
    expect(highRings).toBeGreaterThan(lowRings);
    expect(highSpec.layers.length).toBeGreaterThan(lowSpec.layers.length);
  });

  it("builds all batch 2 symbols with non-empty paths", () => {
    const symbols = ["mandala", "rune", "beast", "star", "crown"] as const;
    for (const mainSymbol of symbols) {
      const spec = buildIconSpec({
        seed: `symbol-${mainSymbol}`,
        mainSymbol,
        layerCount: 1,
        baseShape: "circle",
      });

      const symbolLayer = spec.layers.find((layer) => layer.type === mainSymbol);
      expect(symbolLayer).toBeDefined();
      expect(symbolLayer?.d?.length ?? 0).toBeGreaterThan(10);
    }
  });
});
