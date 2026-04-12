import { describe, expect, it } from "vitest";
import sampleBundle from "./fixtures/canonical-bundle.sample.json";
import {
  assertContractCompatibility,
  createEmptyCanonicalBundle,
  getCanonicalContractVersion,
  loadCanonicalBundle,
  saveCanonicalBundle
} from "@/services/canonical-bundle";
import { extractCanonicalFromAppState, hydrateAppStateFromCanonical } from "@/state/app-store";

describe("canonical bundle bridge", () => {
  it("loads and saves a canonical bundle without drift", () => {
    const bundle = loadCanonicalBundle(sampleBundle);
    const saved = saveCanonicalBundle(bundle);
    const roundtrip = loadCanonicalBundle(saved);

    expect(roundtrip).toEqual(bundle);
  });

  it("hydrates and extracts canonical state without overlay leakage", () => {
    const bundle = createEmptyCanonicalBundle();
    const state = hydrateAppStateFromCanonical(bundle);
    state.overlay.mode = "architect";
    state.overlay.selectedWorldId = "world:overlay";

    expect(extractCanonicalFromAppState(state)).toEqual(bundle);
  });

  it("rejects invalid canonical bundle JSON before hydration", () => {
    expect(() => loadCanonicalBundle({})).toThrow("Canonical bundle validation failed");
  });

  it("matches the emitted contract version", () => {
    expect(getCanonicalContractVersion()).toBe("0.1.0");
    expect(() => assertContractCompatibility("0.1.0")).not.toThrow();
  });
});
