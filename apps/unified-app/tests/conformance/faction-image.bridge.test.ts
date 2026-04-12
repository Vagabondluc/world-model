import { describe, expect, it } from "vitest";
import { projectFactionImageWorld } from "@/donors/bridges/faction-image/projector";
import { translateFactionImageAction } from "@/donors/bridges/faction-image/actionTranslator";

describe("faction-image bridge", () => {
  it("projects and translates donor state", () => {
    const projection = projectFactionImageWorld();
    const translation = translateFactionImageAction("asset.sigil");

    expect(projection.donorId).toBe("faction-image");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/faction-image");
    expect(translation.donorId).toBe("faction-image");
    expect(translation.canonicalWrites).toEqual(["asset.sigil"]);
  });
});
