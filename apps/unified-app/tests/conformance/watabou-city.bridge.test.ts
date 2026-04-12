import { describe, expect, it } from "vitest";
import { projectWatabouCityWorld } from "@/donors/bridges/watabou-city/projector";
import { translateWatabouCityAction } from "@/donors/bridges/watabou-city/actionTranslator";

describe("watabou-city bridge", () => {
  it("projects and translates reference donor state", () => {
    const projection = projectWatabouCityWorld();
    const translation = translateWatabouCityAction("city.layout");

    expect(projection.donorId).toBe("watabou-city");
    expect(projection.runtimeRoot).toBe("world-model/apps/donors/watabou-city");
    expect(translation.donorId).toBe("watabou-city");
    expect(translation.canonicalWrites).toEqual(["city.layout"]);
  });
});
