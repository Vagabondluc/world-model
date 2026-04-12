import { describe, expect, it } from "vitest";
import { projectMappaImperiumWorld } from "@/donors/bridges/mappa-imperium/projector";
import { translateMappaImperiumAction } from "@/donors/bridges/mappa-imperium/actionTranslator";

describe("mappa-imperium bridge", () => {
  it("projects and translates donor state", () => {
    const projection = projectMappaImperiumWorld();
    const translation = translateMappaImperiumAction("world.territory");

    expect(projection.donorId).toBe("mappa-imperium");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/mappa-imperium");
    expect(translation.donorId).toBe("mappa-imperium");
    expect(translation.canonicalWrites).toEqual(["world.territory"]);
  });
});
