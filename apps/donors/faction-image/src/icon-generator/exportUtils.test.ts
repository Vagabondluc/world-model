import { describe, expect, it } from "vitest";
import { parseExportPayload, toSVGString } from "./exportUtils";
import { buildIconSpec } from "./iconSpecBuilder";

describe("export utils contract", () => {
  it("C22 deterministic SVG output for same seed/config", () => {
    const config = { seed: "det-seed", domain: "order" as const, layerCount: 3, baseShape: "circle" as const };
    const a = toSVGString(buildIconSpec(config));
    const b = toSVGString(buildIconSpec(config));
    expect(a).toBe(b);
  });

  it("C23 rejects unsupported schemaVersion", () => {
    expect(() => parseExportPayload(JSON.stringify({ schemaVersion: "2.0.0" }))).toThrow(/Unsupported/);
  });

  it("C23 synthesizes legacy seedHistory when missing", () => {
    const payload = parseExportPayload(JSON.stringify({
      schemaVersion: "1.0.0",
      generatorVersion: "1.0.0",
      faction: { id: "f1", name: "Faction", domain: "order" },
      state: { seed: "legacyseed" },
    }));
    expect(payload.state.seedHistory.length).toBe(1);
    expect(payload.state.seedHistory[0].reason).toBe("imported-legacy");
    expect(payload.state.ownerByChannel.primaryColor).toBe("domain");
    expect(payload.state.symmetry.symmetryId).toBe("none");
  });

  it("normalizes legacy layersSidebar transform and schema revision", () => {
    const payload = parseExportPayload(JSON.stringify({
      schemaVersion: "1.0.0",
      generatorVersion: "1.0.0",
      faction: { id: "f1", name: "Faction" },
      state: {
        seed: "seed1",
        seedHistory: [{ revision: 0, seed: "seed1", reason: "initial", timestamp: "2026-03-10T00:00:00Z" }],
        ownerByChannel: {
          primaryColor: "domain",
          secondaryColor: "domain",
          accentColor: "domain",
          backgroundColor: "domain",
        },
        colorPresetKey: "domain",
        layersSidebar: {
          layers: [{
            layerId: "l1",
            name: "Layer 1",
            content: { type: "blank" },
            visible: true,
            locked: false,
            opacity: 100,
            blendMode: "normal",
            createdAt: "2026-03-10T00:00:00Z",
            modifiedAt: "2026-03-10T00:00:00Z",
            zIndex: 0,
          }],
          selectedLayerId: "l1",
          selectedLayerIds: ["l1"],
          sidebarOpen: true,
          sidebarWidth: 300,
          sidebarAutoHide: false,
          historyDepth: 0,
        },
      },
      selection: { variantIndex: 0 },
      composition: null,
      artifacts: { svg: "<svg/>", png: null },
    }));
    const layer = payload.state.layersSidebar?.layers[0];
    expect(payload.state.layersSidebar?.schemaRevision).toBe(1);
    expect(payload.state.layersSidebar?.pendingCommit).toBe(false);
    expect(payload.state.layersSidebar?.activeGesture).toBe(null);
    expect(layer?.transform.rotation).toBe(0);
    expect(layer?.transform.scaleX).toBe(1);
    expect(layer?.transform.scaleY).toBe(1);
  });

  it("C42 validates export payload symmetry metadata", () => {
    const payload = parseExportPayload(JSON.stringify({
      schemaVersion: "1.0.0",
      generatorVersion: "1.0.0",
      faction: { id: "f1", name: "Faction", domain: "divine" },
      state: {
        seed: "seed1",
        seedRevision: 1,
        seedHistory: [{ revision: 1, seed: "seed1", reason: "initial", timestamp: "2026-03-10T00:00:00Z" }],
        symmetry: {
          symmetryId: "rot-8",
          displayName: "8-Fold Rotation",
          foldCount: 8,
          mirrorCount: 0,
          category: "rotational",
          selectedAt: "2026-03-10T00:00:00Z",
          selectedBy: "user",
          revisionId: "sha256:any",
          symmetryVersion: "1.0.0",
          regenerateReason: null,
        },
        ownerByChannel: {
          primaryColor: "domain",
          secondaryColor: "domain",
          accentColor: "domain",
          backgroundColor: "domain",
        },
        colorPresetKey: "domain",
      },
      selection: { variantIndex: 0 },
      composition: null,
      artifacts: { svg: "<svg/>", png: null },
    }));
    expect(payload.state.symmetry.symmetryId).toBe("rot-8");
  });

  it("round-trips asset-symbol layer metadata without baked svg", () => {
    const payload = parseExportPayload(JSON.stringify({
      schemaVersion: "1.0.0",
      generatorVersion: "1.0.0",
      faction: { id: "f1", name: "Faction", domain: "order" },
      state: {
        seed: "seed1",
        seedRevision: 1,
        seedHistory: [{ revision: 1, seed: "seed1", reason: "initial", timestamp: "2026-03-10T00:00:00Z" }],
        symmetry: {
          symmetryId: "rot-8",
          displayName: "8-Fold Rotation",
          foldCount: 8,
          mirrorCount: 0,
          category: "rotational",
          selectedAt: "2026-03-10T00:00:00Z",
          selectedBy: "user",
          revisionId: "sha256:any",
          symmetryVersion: "1.0.0",
          regenerateReason: null,
        },
        ownerByChannel: {
          primaryColor: "domain",
          secondaryColor: "domain",
          accentColor: "domain",
          backgroundColor: "domain",
        },
        colorPresetKey: "domain",
        layersSidebar: {
          schemaRevision: 1,
          layers: [{
            layerId: "a1",
            name: "Asset 1",
            content: {
              type: "asset-symbol",
              assetId: "delapouite/ancient-sword",
              assetPath: "/icons/delapouite/ancient-sword.svg",
              recolor: { targetColor: "#f0f", brightness: 1, saturation: 1, opacity: 1, scope: "grayscale" },
              sourceHash: "h1",
              quality: 4,
              warnings: [],
            },
            visible: true,
            locked: false,
            opacity: 100,
            blendMode: "normal",
            transform: { rotation: 0, scaleX: 1, scaleY: 1, x: 0, y: 0, transformOrigin: "center" },
            createdAt: "2026-03-10T00:00:00Z",
            modifiedAt: "2026-03-10T00:00:00Z",
            zIndex: 0,
          }],
          selectedLayerId: "a1",
          selectedLayerIds: ["a1"],
          sidebarOpen: true,
          sidebarWidth: 300,
          sidebarAutoHide: false,
          pendingCommit: false,
          activeGesture: null,
          historyDepth: 0,
        },
      },
      selection: { variantIndex: 0 },
      composition: null,
      artifacts: { svg: "<svg/>", png: null },
    }));
    const content = payload.state.layersSidebar?.layers[0].content;
    expect(content?.type).toBe("asset-symbol");
    if (!content || content.type !== "asset-symbol") return;
    expect(content.assetId).toBe("delapouite/ancient-sword");
    expect("cachedSvg" in content).toBe(false);
  });
});
