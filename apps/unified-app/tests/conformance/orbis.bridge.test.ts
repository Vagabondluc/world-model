import { describe, expect, it } from "vitest";
import { projectOrbisWorld } from "@/donors/bridges/orbis/projector";
import { translateOrbisAction } from "@/donors/bridges/orbis/actionTranslator";

describe("orbis bridge", () => {
  it("projects and translates donor state", () => {
    const projection = projectOrbisWorld();
    const translation = translateOrbisAction("simulation.toggle");

    expect(projection.donorId).toBe("orbis");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/orbis");
    expect(translation.donorId).toBe("orbis");
    expect(translation.canonicalWrites).toEqual(["simulation.toggle"]);
  });
});
