import { describe, expect, it, vi } from "vitest";
import { ApiIconAssetProvider, ApiIconIndexProvider, createIconProviders } from "./providers";

describe("icon providers", () => {
  it("builds API search query with params", async () => {
    const provider = new ApiIconIndexProvider("/api");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], elapsedMs: 1 }),
    } as Response);
    await provider.search({ query: "sword holy", domain: "order", category: "weapon", limit: 12 });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const called = String(fetchSpy.mock.calls[0][0]);
    expect(called).toContain("/api/icon-index/search?");
    expect(called).toContain("q=sword+holy");
    expect(called).toContain("domain=order");
    expect(called).toContain("category=weapon");
    expect(called).toContain("limit=12");
    vi.restoreAllMocks();
  });

  it("fetches raw SVG through API asset provider", async () => {
    const provider = new ApiIconAssetProvider("/api");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: async () => "<svg/>",
    } as Response);
    const svg = await provider.loadRawSvg("/assets/delapouite/holy-shield.svg");
    expect(svg).toContain("<svg");
    vi.restoreAllMocks();
  });

  it("selects provider mode via factory", () => {
    const local = createIconProviders("local");
    const api = createIconProviders("api", "/x");
    expect(local.mode).toBe("local");
    expect(api.mode).toBe("api");
  });
});
