import { expect, test } from "@playwright/test";
import { donorE2EContracts, donorWorldModelUrl } from "./lib/contracts";
import { attachDonorEvidence } from "./lib/evidence";
import { assertTextVisible, takeFailureScreenshot } from "./utils";

test.describe.configure({ mode: "parallel" });

for (const contract of donorE2EContracts.donors) {
  test(`${contract.donorId} donor route smoke`, async ({ page }, testInfo) => {
    const url = donorWorldModelUrl(contract);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await expect(page.getByTestId(contract.worldModelSentinel.testId)).toHaveAttribute(
        "data-mount-kind",
        contract.worldModelSentinel.mountKind
      );
      await expect(page.getByTestId(contract.worldModelSentinel.testId)).toHaveAttribute("data-donor-id", contract.donorId);
      await expect(page.getByTestId(contract.worldModelSentinel.testId)).toHaveAttribute(
        "data-runtime-root",
        `world-model/apps/donors/${contract.donorId}`
      );
      await assertTextVisible(page, contract.requiredLandmarks);
      await expect(page.getByText(/SourceUiPreview|live source UI|source baseline/i)).toHaveCount(0);
      await attachDonorEvidence(testInfo, {
        donorId: contract.donorId,
        label: contract.label,
        mode: contract.mode,
        route: contract.worldModelRoute,
        liveUrl: contract.liveUrl,
        worldModelRoute: url,
        status: "passed",
        rerunCommand: contract.rerunCommand,
        screenshots: [],
        errors: [],
        assertions: ["route mounted", "mount kind matched", "landmarks visible", "no placeholder preview"]
      });
    } catch (error) {
      const screenshotPath = await takeFailureScreenshot(page, testInfo, `${contract.donorId}-smoke-failure`);
      await attachDonorEvidence(testInfo, {
        donorId: contract.donorId,
        label: contract.label,
        mode: contract.mode,
        route: contract.worldModelRoute,
        liveUrl: contract.liveUrl,
        worldModelRoute: url,
        status: "failed",
        rerunCommand: contract.rerunCommand,
        screenshots: [screenshotPath],
        errors: [error instanceof Error ? error.message : String(error)]
      });
      throw error;
    }
  });
}
