import { describe, expect, it } from "vitest";
import { buildIconSpec } from "./iconSpecBuilder";
import { computeSymmetryRevisionId } from "./symmetry";
import { nextSeedState } from "./seedManager";
import { PHASE_2_SYMMETRY_IDS, PHASE_3_SYMMETRY_IDS } from "./symmetryDefinitions";

describe("symmetry phase-1 contract", () => {
  it("C33 none symmetry keeps layers untransformed", () => {
    const spec = buildIconSpec({
      seed: "sym-none",
      symmetry: "none",
      baseShape: "circle",
      mood: "stark",
      layerCount: 3,
      complexity: 2,
    });
    const transformed = spec.layers.filter((layer) => layer.transform && layer.transform.length > 0);
    expect(transformed.length).toBe(0);
  });

  it("C34 mirror-v emits left-right mirrored clones", () => {
    const spec = buildIconSpec({
      seed: "sym-mv",
      symmetry: "mirror-v",
      baseShape: "triangle",
      mood: "stark",
      layerCount: 2,
    });
    const mirrors = spec.layers.filter((layer) => (layer.transform || "").includes("scale(-1,1)"));
    expect(mirrors.length).toBeGreaterThan(0);
  });

  it("C35 mirror-vh emits V, H and VH transforms", () => {
    const spec = buildIconSpec({
      seed: "sym-mvh",
      symmetry: "mirror-vh",
      baseShape: "diamond",
      mood: "stark",
      layerCount: 2,
    });
    const transforms = spec.layers.map((layer) => layer.transform || "");
    expect(transforms.some((t) => t.includes("scale(-1,1)"))).toBe(true);
    expect(transforms.some((t) => t.includes("scale(1,-1)"))).toBe(true);
    expect(transforms.some((t) => t.includes("scale(-1,-1)"))).toBe(true);
  });

  it("C36 rot-4 emits 90/180/270 rotate transforms", () => {
    const spec = buildIconSpec({
      seed: "sym-r4",
      symmetry: "rot-4",
      baseShape: "triangle",
      mood: "stark",
      layerCount: 2,
    });
    const transforms = spec.layers.map((layer) => layer.transform || "");
    expect(transforms.some((t) => t.includes("rotate(90)"))).toBe(true);
    expect(transforms.some((t) => t.includes("rotate(180)"))).toBe(true);
    expect(transforms.some((t) => t.includes("rotate(270)"))).toBe(true);
  });

  it("C37 rot-8 and radial-8 differ in structure", () => {
    const base = {
      seed: "sym-compare",
      baseShape: "triangle" as const,
      mood: "mystic" as const,
      layerCount: 3,
      complexity: 3 as const,
    };
    const rot = buildIconSpec({ ...base, symmetry: "rot-8" });
    const radial = buildIconSpec({ ...base, symmetry: "radial-8" });
    expect(rot.layers.some((l) => l.type === "rays")).toBe(false);
    expect(radial.layers.some((l) => l.type === "rays")).toBe(true);
    expect(rot.layers.length).not.toBe(radial.layers.length);
  });

  it("C38 locked seed + symmetry change keeps seed lineage and changes revision", () => {
    const history = [{ revision: 1, seed: "seed-locked", reason: "initial" as const, timestamp: "2026-03-10T00:00:00Z" }];
    const next = nextSeedState({
      currentSeed: "seed-locked",
      hasGenerated: true,
      locked: true,
      action: "generate",
      seedHistory: history,
    });
    expect(next.seed).toBe("seed-locked");
    expect(next.history.every((entry) => entry.seed === "seed-locked")).toBe(true);

    const r4 = computeSymmetryRevisionId({
      symmetryId: "rot-4",
      seed: next.seed,
      domain: "order",
      generatorVersion: "1.0.0",
    });
    const r8 = computeSymmetryRevisionId({
      symmetryId: "rot-8",
      seed: next.seed,
      domain: "order",
      generatorVersion: "1.0.0",
    });
    expect(r4).not.toBe(r8);
  });

  it("C39 revision id changes when symmetry changes with same seed", () => {
    const a = computeSymmetryRevisionId({
      symmetryId: "mirror-v",
      seed: "seed-a",
      domain: "divine",
      generatorVersion: "1.0.0",
    });
    const b = computeSymmetryRevisionId({
      symmetryId: "radial-8",
      seed: "seed-a",
      domain: "divine",
      generatorVersion: "1.0.0",
    });
    expect(a).not.toBe(b);
  });

  it("Phase 2 symmetry options render deterministically", () => {
    for (const symmetryId of PHASE_2_SYMMETRY_IDS) {
      const config = {
        seed: `phase2-${symmetryId}`,
        symmetry: symmetryId,
        baseShape: "circle" as const,
        mood: "stark" as const,
        layerCount: 2,
      };
      const a = buildIconSpec(config);
      const b = buildIconSpec(config);
      expect(a.layers.length).toBeGreaterThan(0);
      expect(a.layers).toEqual(b.layers);
    }
  });

  it("Phase 3 hybrid symmetry options render deterministically with mirrored transforms", () => {
    for (const symmetryId of PHASE_3_SYMMETRY_IDS) {
      const config = {
        seed: `phase3-${symmetryId}`,
        symmetry: symmetryId,
        baseShape: "circle" as const,
        mood: "stark" as const,
        layerCount: 2,
      };
      const a = buildIconSpec(config);
      const b = buildIconSpec(config);
      expect(a.layers).toEqual(b.layers);
      const hasMirrorScale = a.layers.some((layer) => (layer.transform || "").includes("scale(-1,1)"));
      expect(hasMirrorScale).toBe(true);
    }
  });
});
