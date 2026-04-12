import { describe, expect, it } from "vitest";
import { DONOR_DEFINITIONS, DONOR_ORDER, type DonorId } from "@/donors/config";
import exactnessManifest from "@/donors/exactness-manifest.json";

describe("donor manifest exactness", () => {
  it("keeps donor config and exactness manifest aligned", () => {
    expect(DONOR_ORDER).toEqual(exactnessManifest.donorOrder);

    for (const donor of exactnessManifest.donorOrder as DonorId[]) {
      expect(DONOR_DEFINITIONS[donor]).toMatchObject(exactnessManifest.donors[donor]);
    }
  });
});
