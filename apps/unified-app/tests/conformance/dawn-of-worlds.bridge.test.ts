import { describe, expect, it } from "vitest";
import { projectDawnOfWorldsWorld } from "@/donors/bridges/dawn-of-worlds/projector";
import { translateDawnOfWorldsAction } from "@/donors/bridges/dawn-of-worlds/actionTranslator";

describe("dawn-of-worlds bridge", () => {
  it("projects and translates donor state", () => {
    const projection = projectDawnOfWorldsWorld();
    const translation = translateDawnOfWorldsAction("workflow.turn");

    expect(projection.donorId).toBe("dawn-of-worlds");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/dawn-of-worlds");
    expect(translation.donorId).toBe("dawn-of-worlds");
    expect(translation.canonicalWrites).toEqual(["workflow.turn"]);
  });
});
