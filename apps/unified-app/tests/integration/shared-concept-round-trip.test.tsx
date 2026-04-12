import { describe, expect, it } from "vitest";
import sampleBundle from "../fixtures/canonical-bundle.sample.json";
import {
  CROSS_DONOR_JOURNEYS,
  SHARED_CONCEPT_FAMILIES,
  projectSharedConcept,
  type SharedConceptFamily
} from "@/product/surface-contract";
import type { CanonicalBundle } from "@/domain/canonical";

const LENSES = ["mythforge", "adventure-generator", "orbis"] as const;

describe("shared concept round-trip", () => {
  it("projects every shared concept family across all donor lenses without mutating the bundle", () => {
    const bundle = structuredClone(sampleBundle) as CanonicalBundle;
    const before = JSON.stringify(bundle);

    for (const family of SHARED_CONCEPT_FAMILIES) {
      for (const lens of LENSES) {
        const projection = projectSharedConcept(bundle, family.family as SharedConceptFamily, lens);

        expect(projection.family).toBe(family.family);
        expect(projection.canonicalKey).toBeTruthy();
        expect(projection.facts.length).toBeGreaterThan(0);
      }
    }

    expect(JSON.stringify(bundle)).toBe(before);
  });

  it("documents the cross-donor journey set used by the integration plan", () => {
    expect(CROSS_DONOR_JOURNEYS).toHaveLength(2);
    expect(CROSS_DONOR_JOURNEYS[0].steps.map((step) => step.route)).toEqual(
      expect.arrayContaining(["/donor/mythforge", "/donor/adventure-generator", "/donor/orbis", "/world"])
    );
  });
});
