import { describe, expect, it } from "vitest";
import { assetRecordKey, rehydrateDeterminismInputs, toAssetRecord } from "./assetLibrary";
import type { ExportPayload } from "./types";

function mockPayload(overrides?: Partial<ExportPayload>): ExportPayload {
  return {
    schemaVersion: "1.0.0",
    generatorVersion: "1.0.0",
    faction: { id: "f1", name: "Faction", domain: "order" },
    state: {
      seed: "seed1",
      seedRevision: 3,
      seedHistory: [
        { revision: 1, seed: "seed0", reason: "initial", timestamp: "2026-01-01T00:00:00Z" },
        { revision: 2, seed: "seed1", reason: "generate-next", timestamp: "2026-01-02T00:00:00Z" },
      ],
      symmetry: {
        symmetryId: "rot-8",
        displayName: "8-Fold Rotation",
        foldCount: 8,
        mirrorCount: 0,
        category: "rotational",
        selectedAt: "2026-03-10T00:00:00Z",
        selectedBy: "user",
        revisionId: "sha256:sym",
        symmetryVersion: "1.0.0",
        regenerateReason: null,
      },
      ownerByChannel: {
        primaryColor: "domain",
        secondaryColor: "preset",
        accentColor: "manual",
        backgroundColor: "domain",
      },
      colorPresetKey: "vivid",
    },
    selection: { variantIndex: 1, style: "shield" },
    composition: {
      id: "composition-main",
      compositionVersion: 1,
      mode: "overlay-center",
      revisionId: "sha256:test",
      appliedToVariants: "all",
      updatedAt: "2026-03-10T00:00:00Z",
    },
    artifacts: {
      svg: "<svg/>",
      png: null,
    },
    ...overrides,
  };
}

describe("asset library contract", () => {
  it("C25/C26 stores seed lineage and composition revision", () => {
    const rec = toAssetRecord(mockPayload());
    expect(rec.seed).toBe("seed1");
    expect(rec.seedRevision).toBe(3);
    expect(rec.seedHistory.length).toBeGreaterThan(0);
    expect(rec.compositionRevisionId).toBe("sha256:test");
  });

  it("C27/C29 creates stable uniqueness key", () => {
    const key = assetRecordKey({ factionId: "f1", seed: "seed1", variantIndex: 1, compositionRevisionId: "sha256:test" });
    expect(key).toBe("f1:seed1:1:sha256:test");
  });

  it("C28/C32 rehydrates determinism inputs for replay", () => {
    const rec = toAssetRecord(mockPayload());
    const data = rehydrateDeterminismInputs(rec);
    expect(data.seed).toBe("seed1");
    expect(data.seedRevision).toBe(3);
    expect(data.variantIndex).toBe(1);
    expect(data.compositionRevisionId).toBe("sha256:test");
  });

  it("C31 preserves mixed color ownership across asset round-trip", () => {
    const payload = mockPayload({
      state: {
        seed: "seed1",
        seedRevision: 1,
        seedHistory: [{ revision: 1, seed: "seed1", reason: "initial", timestamp: "2026-01-01T00:00:00Z" }],
        symmetry: {
          symmetryId: "mirror-v",
          displayName: "Mirror Vertical",
          foldCount: 1,
          mirrorCount: 1,
          category: "mirror",
          selectedAt: "2026-03-10T00:00:00Z",
          selectedBy: "user",
          revisionId: "sha256:sym2",
          symmetryVersion: "1.0.0",
          regenerateReason: null,
        },
        ownerByChannel: {
          primaryColor: "manual",
          secondaryColor: "preset",
          accentColor: "domain",
          backgroundColor: "manual",
        },
        colorPresetKey: "muted",
      },
    });
    const rec = toAssetRecord(payload);
    expect(rec.payload.state.ownerByChannel.primaryColor).toBe("manual");
    expect(rec.payload.state.ownerByChannel.backgroundColor).toBe("manual");
  });
});
