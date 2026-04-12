import { describe, expect, it } from "vitest";
import { projectMythforgeWorld } from "@/donors/bridges/mythforge/projector";
import { translateMythforgeAction } from "@/donors/bridges/mythforge/actionTranslator";

describe("mythforge bridge", () => {
  it("projects and translates donor state", () => {
    const projection = projectMythforgeWorld();
    const translation = translateMythforgeAction("world.create");

    expect(projection.donorId).toBe("mythforge");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/mythforge");
    expect(translation.donorId).toBe("mythforge");
    expect(translation.canonicalWrites).toEqual(["world.create"]);
  });
});
