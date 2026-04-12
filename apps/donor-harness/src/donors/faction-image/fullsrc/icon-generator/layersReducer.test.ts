import { describe, expect, it } from "vitest";
import { createInitialLayersState, layersReducer, layersToRenderableFlat } from "./layersReducer";
import { buildIconSpec } from "./iconSpecBuilder";
import { toSVGString } from "./exportUtils";

describe("layers reducer", () => {
  it("adds blank and symbol layers (L1)", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, { type: "add-blank-layer" });
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "star", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    expect(state.layers.length).toBeGreaterThanOrEqual(3);
    expect(layersToRenderableFlat(state.layers).some((layer) => layer.content.type === "symbol")).toBe(true);
  });

  it("adds asset-symbol layer and keeps reducer operations compatible", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, {
      type: "add-asset-layer",
      assetId: "delapouite/ancient-sword",
      assetPath: "/assets/delapouite/ancient-sword.svg",
      sourceHash: "h1",
      recolor: { targetColor: "#ff00ff", brightness: 1, saturation: 1, opacity: 1, scope: "grayscale" },
      quality: 5,
      warnings: [],
    });
    const layer = layersToRenderableFlat(state.layers).find((l) => l.content.type === "asset-symbol");
    expect(layer).toBeTruthy();
    if (!layer) return;
    state = layersReducer(state, { type: "set-opacity", layerId: layer.layerId, opacity: 64 });
    expect(layersToRenderableFlat(state.layers).find((l) => l.layerId === layer.layerId)?.opacity).toBe(64);
    state = layersReducer(state, { type: "set-asset-recolor", layerId: layer.layerId, recolor: { scope: "black-only", targetColor: "#00ff00" } });
    const updated = layersToRenderableFlat(state.layers).find((l) => l.layerId === layer.layerId);
    if (!updated || updated.content.type !== "asset-symbol") return;
    expect(updated.content.recolor.scope).toBe("black-only");
    expect(updated.content.recolor.targetColor).toBe("#00ff00");
  });

  it("visibility toggle changes renderability (L2)", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "beast", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    const id = layersToRenderableFlat(state.layers).find((layer) => layer.content.type === "symbol")!.layerId;
    state = layersReducer(state, { type: "toggle-visible", layerId: id });
    const layer = layersToRenderableFlat(state.layers).find((l) => l.layerId === id)!;
    expect(layer.visible).toBe(false);
  });

  it("locked layers are selectable but immutable (lock contract)", () => {
    let state = createInitialLayersState();
    const id = state.layers[0].layerId;
    state = layersReducer(state, { type: "toggle-locked", layerId: id });
    state = layersReducer(state, { type: "select-layer", layerId: id });
    expect(state.selectedLayerId).toBe(id);
    state = layersReducer(state, { type: "rename-layer", layerId: id, name: "New Name" });
    expect(state.layers[0].name).not.toBe("New Name");
  });

  it("reorder + undo/redo works (L6 + history)", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "star", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "crown", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    const topId = state.layers[2].layerId;
    state = layersReducer(state, { type: "move-layer-top", layerId: topId });
    expect(state.layers[0].layerId).toBe(topId);
    state = layersReducer(state, { type: "undo" });
    expect(state.layers[2].layerId).toBe(topId);
    state = layersReducer(state, { type: "redo" });
    expect(state.layers[0].layerId).toBe(topId);
  });

  it("L14-L16 transform actions update layer transform", () => {
    let state = createInitialLayersState();
    const id = state.layers[0].layerId;
    state = layersReducer(state, { type: "set-rotation", layerId: id, rotation: 45 });
    state = layersReducer(state, { type: "set-scale", layerId: id, scaleX: 1.2, scaleY: 0.8 });
    state = layersReducer(state, { type: "set-position", layerId: id, x: 12, y: -6 });
    const layer = state.layers[0];
    expect(layer.transform.rotation).toBe(45);
    expect(layer.transform.scaleX).toBeCloseTo(1.2);
    expect(layer.transform.scaleY).toBeCloseTo(0.8);
    expect(layer.transform.x).toBe(12);
    expect(layer.transform.y).toBe(-6);
    state = layersReducer(state, { type: "reset-transform", layerId: id });
    expect(state.layers[0].transform.rotation).toBe(0);
    expect(state.layers[0].transform.scaleX).toBe(1);
    expect(state.layers[0].transform.scaleY).toBe(1);
    expect(state.layers[0].transform.x).toBe(0);
    expect(state.layers[0].transform.y).toBe(0);
  });

  it("coalesces continuous gesture updates into one undo entry", () => {
    let state = createInitialLayersState();
    const id = state.layers[0].layerId;
    state = layersReducer(state, { type: "begin-gesture", kind: "opacity", gestureId: "g1" });
    state = layersReducer(state, { type: "set-opacity", layerId: id, opacity: 90 });
    state = layersReducer(state, { type: "set-opacity", layerId: id, opacity: 70 });
    state = layersReducer(state, { type: "set-opacity", layerId: id, opacity: 55 });
    state = layersReducer(state, { type: "end-gesture" });
    expect(state.undoStack.length).toBe(1);
    expect(state.undoStack[0].gestureId).toBe("g1");
    expect(state.undoStack[0].coalesced).toBe(true);
    state = layersReducer(state, { type: "undo" });
    expect(state.layers[0].opacity).toBe(100);
  });

  it("reorders nested layers by explicit target position", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "star", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "beast", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    const first = state.layers[0].layerId;
    const second = state.layers[1].layerId;
    const third = state.layers[2].layerId;
    state = layersReducer(state, { type: "select-layer", layerId: first, additive: false });
    state = layersReducer(state, { type: "select-layer", layerId: second, additive: true });
    state = layersReducer(state, { type: "group-selected" });
    const group = state.layers[state.layers.length - 1];
    expect(group.content.type).toBe("group");
    expect(group.children?.length).toBe(2);
    state = layersReducer(state, { type: "reorder-layer", layerId: third, targetLayerId: second, position: "before" });
    const movedGroup = state.layers.find((layer) => layer.content.type === "group");
    const childIds = movedGroup?.children?.map((child) => child.layerId) || [];
    expect(childIds.includes(third)).toBe(true);
    expect(childIds.indexOf(third)).toBeLessThan(childIds.indexOf(second));
  });

  it("rename target is cleared on confirm/cancel transitions", () => {
    let state = createInitialLayersState();
    const id = state.layers[0].layerId;
    state = layersReducer(state, { type: "set-rename-target", layerId: id });
    expect(state.renameTargetLayerId).toBe(id);
    state = layersReducer(state, { type: "rename-layer", layerId: id, name: "Renamed Layer" });
    expect(state.renameTargetLayerId).toBe(null);
    state = layersReducer(state, { type: "set-rename-target", layerId: id });
    state = layersReducer(state, { type: "set-rename-target", layerId: null });
    expect(state.renameTargetLayerId).toBe(null);
  });

  it("supports transform origin updates (L26)", () => {
    let state = createInitialLayersState();
    const id = state.layers[0].layerId;
    state = layersReducer(state, { type: "set-transform-origin", layerId: id, transformOrigin: "top-left" });
    expect(state.layers[0].transform.transformOrigin).toBe("top-left");
  });

  it("merge-down composes transforms into lower-layer identity (L28)", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "star", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    const lower = state.layers[0].layerId;
    const top = state.layers[1].layerId;
    state = layersReducer(state, { type: "set-position", layerId: lower, x: 10, y: 5 });
    state = layersReducer(state, { type: "set-scale", layerId: lower, scaleX: 2, scaleY: 2 });
    state = layersReducer(state, { type: "set-position", layerId: top, x: 3, y: -2 });
    state = layersReducer(state, { type: "set-scale", layerId: top, scaleX: 0.5, scaleY: 0.25 });
    state = layersReducer(state, { type: "merge-down", layerId: top });
    expect(state.layers.length).toBe(1);
    expect(state.layers[0].layerId).toBe(lower);
    expect(state.layers[0].transform.x).toBe(13);
    expect(state.layers[0].transform.y).toBe(3);
    expect(state.layers[0].transform.scaleX).toBeCloseTo(1);
    expect(state.layers[0].transform.scaleY).toBeCloseTo(0.5);
  });

  it("phase3 template action adds preset symbol stack", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, { type: "phase3-apply-template", templateId: "mystic-triad" });
    const symbols = layersToRenderableFlat(state.layers).filter((layer) => layer.content.type === "symbol");
    expect(symbols.length).toBe(3);
    expect(symbols.some((layer) => layer.content.type === "symbol" && layer.content.symbol === "mandala")).toBe(true);
  });

  it("batch delete removes multiple selected unlocked layers", () => {
    let state = createInitialLayersState();
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "star", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    state = layersReducer(state, { type: "add-symbol-layer", symbol: "beast", color: "#fff", scale: 1, blendMode: "normal", opacity: 1 });
    const ids = state.layers.slice(1).map((l) => l.layerId);
    state = layersReducer(state, { type: "select-layer", layerId: ids[0] });
    state = layersReducer(state, { type: "select-layer", layerId: ids[1], additive: true });
    state = layersReducer(state, { type: "batch-delete" });
    expect(state.layers.length).toBe(1);
    expect(state.layers[0].content.type).toBe("blank");
  });

  it("L25/L26 baseline performance and SVG size for 50 layers", () => {
    let state = createInitialLayersState();
    for (let i = 0; i < 50; i++) {
      state = layersReducer(state, {
        type: "add-symbol-layer",
        symbol: i % 2 ? "star" : "beast",
        color: "#ffffff",
        scale: 0.8,
        blendMode: "normal",
        opacity: 0.8,
      });
    }
    const t0 = Date.now();
    const spec = buildIconSpec({ seed: "perf-layers", baseShape: "circle", layerCount: 2 });
    const svg = toSVGString({
      ...spec,
      layers: [
        ...spec.layers,
        ...layersToRenderableFlat(state.layers).slice(0, 50).map((layer, idx) => ({
          id: `test-${idx}`,
          type: "star" as const,
          d: "M64 20 L74 54 L110 54 L80 72 L90 106 L64 84 L38 106 L48 72 L18 54 L54 54 Z",
          fill: "#fff",
          opacity: layer.opacity / 100,
        })),
      ],
    });
    const elapsed = Date.now() - t0;
    expect(elapsed).toBeLessThan(500);
    expect(svg.length).toBeLessThan(10 * 1024 * 1024);
  });
});
