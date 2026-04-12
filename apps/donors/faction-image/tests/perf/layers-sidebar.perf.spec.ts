import { expect, test } from "@playwright/test";

type LayerItem = {
  layerId: string;
  name: string;
  content: { type: "symbol"; symbol: "star"; color: string; scale: number };
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: "normal";
  transform: {
    rotation: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    transformOrigin: "center";
  };
  createdAt: string;
  modifiedAt: string;
  zIndex: number;
};

const STORAGE_KEY = "faction-image.layers-sidebar.v1";

function makeLayer(index: number): LayerItem {
  const now = new Date(0).toISOString();
  return {
    layerId: `perf-${index}`,
    name: `Perf ${index}`,
    content: { type: "symbol", symbol: "star", color: "#ffffff", scale: 0.9 },
    visible: true,
    locked: false,
    opacity: 80,
    blendMode: "normal",
    transform: {
      rotation: (index * 7) % 180,
      scaleX: 1,
      scaleY: 1,
      x: (index % 5) * 2,
      y: (index % 7) * -2,
      transformOrigin: "center",
    },
    createdAt: now,
    modifiedAt: now,
    zIndex: index,
  };
}

test.describe("L25/L26 browser perf harness", () => {
  test("L25: 50-layer render under threshold and stable", async ({ page }) => {
    await page.addInitScript(({ key }) => {
      const layers = Array.from({ length: 50 }, (_, i) => ({
        layerId: `perf-${i}`,
        name: `Perf ${i}`,
        content: { type: "symbol", symbol: "star", color: "#ffffff", scale: 0.9 },
        visible: true,
        locked: false,
        opacity: 80,
        blendMode: "normal",
        transform: {
          rotation: (i * 7) % 180,
          scaleX: 1,
          scaleY: 1,
          x: (i % 5) * 2,
          y: (i % 7) * -2,
          transformOrigin: "center",
        },
        createdAt: new Date(0).toISOString(),
        modifiedAt: new Date(0).toISOString(),
        zIndex: i,
      }));
      localStorage.setItem(key, JSON.stringify({
        schemaRevision: 1,
        layers,
        selectedLayerId: layers[0].layerId,
        selectedLayerIds: [layers[0].layerId],
        sidebarOpen: false,
        sidebarWidth: 300,
        sidebarAutoHide: false,
        pendingCommit: false,
        activeGesture: null,
        historyDepth: 0,
      }));
    }, { key: STORAGE_KEY });

    await page.goto("/");
    const start = Date.now();
    await page.getByRole("button", { name: "Generate Icon" }).click();
    await expect(page.locator("svg").first()).toBeVisible();
    const elapsed = Date.now() - start;
    // Includes app bootstrap + first render in CI; keep threshold pragmatic for nightly stability.
    expect(elapsed).toBeLessThan(1200);
  });

  test("L26: SVG/DOM size under threshold for 50-layer scene", async ({ page }) => {
    await page.addInitScript(({ key, layers }) => {
      localStorage.setItem(key, JSON.stringify({
        schemaRevision: 1,
        layers,
        selectedLayerId: layers[0].layerId,
        selectedLayerIds: [layers[0].layerId],
        sidebarOpen: false,
        sidebarWidth: 300,
        sidebarAutoHide: false,
        pendingCommit: false,
        activeGesture: null,
        historyDepth: 0,
      }));
    }, { key: STORAGE_KEY, layers: Array.from({ length: 50 }, (_, i) => makeLayer(i)) });

    await page.goto("/");
    await page.getByRole("button", { name: "Generate Icon" }).click();
    await expect(page.locator("svg").first()).toBeVisible();
    const totalBytes = await page.evaluate(() => {
      const markup = document.documentElement.outerHTML;
      return new Blob([markup]).size;
    });
    expect(totalBytes).toBeLessThan(10 * 1024 * 1024);
  });
});
