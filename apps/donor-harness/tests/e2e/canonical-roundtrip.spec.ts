import { expect, test } from "@playwright/test";
import { donorE2EContracts } from "./lib/contracts";
import { attachDonorEvidence } from "./lib/evidence";
import { takeFailureScreenshot } from "./utils";

function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

test.describe.configure({ mode: "serial" });

test("canonical round-trip through world-model public surface and donor routes", async ({ page }, testInfo) => {
  const suffix = uniqueSuffix();
  const worldId = `world-playwright-${suffix}`;
  const worldLabel = `Playwright World ${suffix}`;
  const entityId = `entity-playwright-${suffix}`;
  const entityLabel = `Playwright Entity ${suffix}`;
  const worldUrl = new URL("/world", donorE2EContracts.worldModel.url).toString();

  try {
    await page.goto(worldUrl, { waitUntil: "domcontentloaded" });
    const workspace = page.getByRole("main", { name: "workspace" });
    await expect(workspace.getByRole("button", { name: "Create world" })).toBeVisible();
    await workspace.getByRole("button", { name: "Create world" }).click();
    const worldDialog = page.getByRole("dialog", { name: "Create world" });
    await expect(worldDialog).toBeVisible();
    await worldDialog.getByLabel("World ID").fill(worldId);
    await worldDialog.getByLabel("Label").fill(worldLabel);
    await worldDialog.getByLabel("Summary").fill("Playwright canonical round-trip world.");
    await worldDialog.getByLabel("Tags").fill("playwright, world-model");
    await worldDialog.getByLabel("Description").fill("Created by browser-level E2E round-trip coverage.");
    await worldDialog.getByRole("button", { name: "Create world" }).click();

    await expect(workspace.getByText(worldLabel, { exact: false }).first()).toBeVisible();
    await workspace.getByRole("button", { name: "Create entity" }).click();
    const entityDialog = page.getByRole("dialog", { name: "Create entity" });
    await expect(entityDialog).toBeVisible();
    await entityDialog.getByLabel("Entity ID").fill(entityId);
    await entityDialog.getByLabel("Entity type").fill("city");
    await entityDialog.getByLabel("World ID").fill(worldId);
    await entityDialog.getByLabel("Label").fill(entityLabel);
    await entityDialog.getByLabel("Summary").fill("Playwright canonical entity.");
    await entityDialog.getByLabel("Tags").fill("playwright, entity");
    await entityDialog.getByLabel("Description").fill("Entity created through the canonical round-trip test.");
    await entityDialog.getByLabel("Map anchor").fill(`map-${suffix}`);
    await entityDialog.getByLabel("Spatial scope").fill("city");
    await entityDialog.getByRole("button", { name: "Create entity" }).click();

    await expect(workspace.getByText(worldLabel, { exact: false }).first()).toBeVisible();
    await expect(workspace.getByText(entityLabel, { exact: false }).first()).toBeVisible();
    await page.getByRole("button", { name: "Select current world" }).click();
    await page.getByRole("button", { name: "Select current entity" }).click();
    await expect(workspace.getByText(worldLabel, { exact: false }).first()).toBeVisible();
    await expect(workspace.getByText(entityLabel, { exact: false }).first()).toBeVisible();

    await page.getByRole("button", { name: "Save bundle" }).click();
    await page.getByRole("link", { name: "Mythforge" }).click();
    await expect(page.getByText(`World ${worldId}`, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(`Entity ${entityId}`, { exact: false }).first()).toBeVisible();
    await page.getByRole("link", { name: "Compare donors" }).click();
    await expect(page.getByText("Donor inventory and comparison surface", { exact: false })).toBeVisible();
    await page.getByRole("link", { name: "World / Story / Schema" }).click();
    await expect(page.getByText(`World ${worldId}`, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(`Entity ${entityId}`, { exact: false }).first()).toBeVisible();

    await attachDonorEvidence(testInfo, {
      donorId: "world-model",
      label: "world-model canonical round-trip",
      mode: "live-compare",
      route: "/world",
      liveUrl: null,
      worldModelRoute: "/world",
      status: "passed",
      rerunCommand: "npm run test:e2e:donor-world-model -- --grep canonical-roundtrip",
      screenshots: [],
      errors: [],
      assertions: ["world created", "entity created", "context retained across donor and comparison routes"]
    });
  } catch (error) {
    const screenshot = await takeFailureScreenshot(page, testInfo, "canonical-roundtrip-failure");
    await attachDonorEvidence(testInfo, {
      donorId: "world-model",
      label: "world-model canonical round-trip",
      mode: "live-compare",
      route: "/world",
      liveUrl: null,
      worldModelRoute: "/world",
      status: "failed",
      rerunCommand: "npm run test:e2e:donor-world-model -- --grep canonical-roundtrip",
      screenshots: [screenshot],
      errors: [error instanceof Error ? error.message : String(error)]
    });
    throw error;
  }
});
