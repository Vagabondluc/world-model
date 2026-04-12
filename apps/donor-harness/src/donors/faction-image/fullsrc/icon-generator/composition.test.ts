import { describe, expect, it } from "vitest";
import { buildCompositionConfig, compositionRevisionId } from "./composition";

describe("composition determinism", () => {
  it("C21 revision id is stable for same normalized config", () => {
    const input = { mode: "overlay-center", overlays: [{ symbol: "star", opacity: 0.5 }] };
    const a = compositionRevisionId(input);
    const b = compositionRevisionId(input);
    expect(a).toBe(b);
  });

  it("revision id changes when config changes", () => {
    const a = compositionRevisionId({ mode: "overlay-center", overlays: [{ symbol: "star" }] });
    const b = compositionRevisionId({ mode: "overlay-center", overlays: [{ symbol: "shield" }] });
    expect(a).not.toBe(b);
  });

  it("buildCompositionConfig includes deterministic revision", () => {
    const cfg = buildCompositionConfig({
      mode: "overlay-center",
      normalizedInput: { blend: "screen", filter: "glow" },
      updatedAt: "2026-03-10T00:00:00.000Z",
    });
    expect(cfg.revisionId).toMatch(/^sha256:/);
    expect(cfg.mode).toBe("overlay-center");
  });
});

