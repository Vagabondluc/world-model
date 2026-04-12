import { describe, expect, it } from "vitest";
import { projectAdventureGeneratorWorld } from "@/donors/bridges/adventure-generator/projector";
import { translateAdventureGeneratorAction } from "@/donors/bridges/adventure-generator/actionTranslator";

describe("adventure-generator bridge", () => {
  it("projects and translates donor state", () => {
    const projection = projectAdventureGeneratorWorld();
    const translation = translateAdventureGeneratorAction("workflow.advance");

    expect(projection.donorId).toBe("adventure-generator");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/adventure-generator");
    expect(translation.donorId).toBe("adventure-generator");
    expect(translation.canonicalWrites).toEqual(["workflow.advance"]);
  });
});
