import { describe, expect, it } from "vitest";
import { projectEncounterBalancerWorld } from "@/donors/bridges/encounter-balancer/projector";
import { translateEncounterBalancerAction } from "@/donors/bridges/encounter-balancer/actionTranslator";

describe("encounter-balancer bridge", () => {
  it("projects and translates scaffold donor state", () => {
    const projection = projectEncounterBalancerWorld();
    const translation = translateEncounterBalancerAction("encounter.balance");

    expect(projection.donorId).toBe("encounter-balancer");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/encounter-balancer");
    expect(translation.donorId).toBe("encounter-balancer");
    expect(translation.canonicalWrites).toEqual(["encounter.balance"]);
  });
});
