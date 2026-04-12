import { describe, expect, it, vi } from "vitest";
import { LocalIconIndexProvider } from "./discoveryService";

describe("LocalIconIndexProvider", () => {
  it("ranks by keyword match and domain affinity", async () => {
    const provider = new LocalIconIndexProvider();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        generatedAt: "2026-01-01T00:00:00.000Z",
        records: [
          {
            id: "a",
            assetPath: "/a.svg",
            category: "weapon",
            keywords: ["sword"],
            domains: { order: 0.1 },
            quality: { recolorQuality: 5, hasGradients: false, hasOpacity: false },
          },
          {
            id: "b",
            assetPath: "/b.svg",
            category: "weapon",
            keywords: ["sword"],
            domains: { order: 0.9 },
            quality: { recolorQuality: 3, hasGradients: false, hasOpacity: false },
          },
        ],
      }),
    } as Response);
    const result = await provider.search({ query: "sword", domain: "order", limit: 10 });
    expect(result.items[0].id).toBe("b");
    vi.restoreAllMocks();
  });

  it("searches 10k records under practical latency budget", async () => {
    const provider = new LocalIconIndexProvider();
    const records = Array.from({ length: 10_000 }, (_, i) => ({
      id: `id-${i}`,
      assetPath: `/a/${i}.svg`,
      category: i % 2 ? "weapon" : "creature",
      keywords: [i % 3 ? "sword" : "demon", `k${i}`],
      domains: { order: (i % 10) / 10, chaos: ((9 - (i % 10)) / 10) },
      quality: { recolorQuality: 4, hasGradients: false, hasOpacity: false },
    }));
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        generatedAt: "2026-01-01T00:00:00.000Z",
        records,
      }),
    } as Response);
    const started = performance.now();
    const result = await provider.search({ query: "sword", domain: "order", limit: 50 });
    const elapsed = performance.now() - started;
    expect(result.items.length).toBe(50);
    expect(elapsed).toBeLessThan(200);
    vi.restoreAllMocks();
  });
});
