import { expect, test } from "@playwright/test";
import { appDonors, donorLiveUrl, donorWorldModelUrl } from "./lib/contracts";
import { attachDonorEvidence } from "./lib/evidence";
import { loadE2EServerState } from "./lib/server-manager";
import { assertRequiredControl, assertTextVisible, collectPageDiagnostics, takeFailureScreenshot } from "./utils";

test.describe.configure({ mode: "parallel" });

for (const contract of appDonors) {
  test(`${contract.donorId} live donor parity`, async ({ browser }, testInfo) => {
    const serverState = await loadE2EServerState();
    const startupFailure = serverState?.servers.find((server) => server.donorId === contract.donorId)?.failed ?? null;
    if (startupFailure) {
      await attachDonorEvidence(testInfo, {
        donorId: contract.donorId,
        label: contract.label,
        mode: contract.mode,
        route: contract.worldModelRoute,
        liveUrl: donorLiveUrl(contract),
        worldModelRoute: donorWorldModelUrl(contract),
        status: "failed",
        rerunCommand: contract.rerunCommand,
        screenshots: [],
        errors: [`startup failure: ${startupFailure}`]
      });
      throw new Error(`Live donor startup failure for ${contract.donorId}: ${startupFailure}`);
    }

    const context = await browser.newContext();
    const livePage = await context.newPage();
    const modelPage = await context.newPage();
    const liveUrl = donorLiveUrl(contract);
    if (!liveUrl) {
      throw new Error(`Missing live URL for ${contract.donorId}`);
    }
    const modelUrl = donorWorldModelUrl(contract);
    const liveLogs: string[] = [];
    const modelLogs: string[] = [];
    livePage.on("console", (message) => liveLogs.push(`[console:${message.type()}] ${message.text()}`));
    livePage.on("pageerror", (error) => liveLogs.push(`[pageerror] ${error.message}`));
    modelPage.on("console", (message) => modelLogs.push(`[console:${message.type()}] ${message.text()}`));
    modelPage.on("pageerror", (error) => modelLogs.push(`[pageerror] ${error.message}`));

    try {
      await livePage.goto(liveUrl, { waitUntil: "domcontentloaded" });
      await modelPage.goto(modelUrl, { waitUntil: "domcontentloaded" });

      await assertTextVisible(livePage, contract.requiredLandmarks);
      await assertTextVisible(modelPage, contract.requiredLandmarks);

      for (const requirement of contract.requiredControls) {
        await assertRequiredControl(livePage, requirement);
        await assertRequiredControl(modelPage, requirement);
      }

      await expect(modelPage.getByTestId(contract.worldModelSentinel.testId)).toHaveAttribute(
        "data-mount-kind",
        contract.worldModelSentinel.mountKind
      );
      await expect(modelPage.getByTestId(contract.worldModelSentinel.testId)).toHaveAttribute("data-donor-id", contract.donorId);
      await expect(modelPage.getByTestId(contract.worldModelSentinel.testId)).toHaveAttribute(
        "data-runtime-root",
        `world-model/apps/donors/${contract.donorId}`
      );
      await expect(modelPage.getByText(/SourceUiPreview|iframe|source baseline|live source UI/i)).toHaveCount(0);

      await attachDonorEvidence(testInfo, {
        donorId: contract.donorId,
        label: contract.label,
        mode: contract.mode,
        route: contract.worldModelRoute,
        liveUrl,
        worldModelRoute: modelUrl,
        status: "passed",
        rerunCommand: contract.rerunCommand,
        screenshots: [],
        errors: [],
        assertions: ["live donor matched required landmarks", "world-model donor matched required controls"]
      });
    } catch (error) {
      const liveScreenshot = await takeFailureScreenshot(livePage, testInfo, `${contract.donorId}-live-failure`);
      const modelScreenshot = await takeFailureScreenshot(modelPage, testInfo, `${contract.donorId}-world-model-failure`);
      const liveDiagnostics = await collectPageDiagnostics(livePage).catch((diagError) => `diagnostic failure: ${String(diagError)}`);
      const modelDiagnostics = await collectPageDiagnostics(modelPage).catch((diagError) => `diagnostic failure: ${String(diagError)}`);
      await testInfo.attach(`${contract.donorId}-live-diagnostics`, {
        body: liveDiagnostics,
        contentType: "text/plain"
      });
      await testInfo.attach(`${contract.donorId}-world-model-diagnostics`, {
        body: modelDiagnostics,
        contentType: "text/plain"
      });
      await testInfo.attach(`${contract.donorId}-live-console`, {
        body: liveLogs.join("\n"),
        contentType: "text/plain"
      });
      await testInfo.attach(`${contract.donorId}-world-model-console`, {
        body: modelLogs.join("\n"),
        contentType: "text/plain"
      });
      await attachDonorEvidence(testInfo, {
        donorId: contract.donorId,
        label: contract.label,
        mode: contract.mode,
        route: contract.worldModelRoute,
        liveUrl,
        worldModelRoute: modelUrl,
        status: "failed",
        rerunCommand: contract.rerunCommand,
        screenshots: [liveScreenshot, modelScreenshot],
        errors: [error instanceof Error ? error.message : String(error), "diagnostics attached", `live logs: ${liveLogs.length}`, `world-model logs: ${modelLogs.length}`]
      });
      throw error;
    } finally {
      await context.close();
    }
  });
}
