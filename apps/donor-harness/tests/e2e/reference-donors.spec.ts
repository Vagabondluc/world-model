import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { donorWorldModelUrl, referenceDonors } from "./lib/contracts";
import { attachDonorEvidence } from "./lib/evidence";
import { resolveWorkspacePath } from "./lib/paths";
import { assertTextVisible, takeFailureScreenshot } from "./utils";

test.describe.configure({ mode: "parallel" });

function fingerprintCloneRoot(root: string): string {
  const resolved = resolveWorkspacePath(root);
  const candidates = [
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "vite.config.js",
    "next.config.js",
    "next.config.mjs",
    "app/page.tsx",
    "pages/index.tsx",
    "src/App.tsx",
    "src/app/App.tsx",
    "src/main.tsx",
    "index.tsx",
    "App.tsx"
  ];

  const entries: string[] = [];
  for (const candidate of candidates) {
    const absolute = path.resolve(resolved, candidate);
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      entries.push(`${candidate}:${fs.readFileSync(absolute, "utf8")}`);
    }
  }
  return entries.join("\n---\n");
}

test("watabou city is not treated as reference-only", async () => {
  const contract = referenceDonors.find((entry) => entry.donorId === "watabou-city");
  expect(contract).toBeUndefined();
});

test("encounter balancer scaffold preserves clone equivalence", async ({ page }, testInfo) => {
  const contract = referenceDonors.find((entry) => entry.donorId === "encounter-balancer");
  if (!contract) {
    throw new Error("Missing encounter-balancer contract");
  }
  const url = donorWorldModelUrl(contract);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId(contract.worldModelSentinel.testId)).toHaveAttribute(
      "data-mount-kind",
      contract.worldModelSentinel.mountKind
    );
    await expect(page.getByRole("heading", { name: contract.label, exact: true })).toBeVisible();
    await assertTextVisible(page, contract.requiredLandmarks);

    const fingerprints = (contract.cloneRoots ?? []).map((root) => fingerprintCloneRoot(root));
    expect(new Set(fingerprints).size).toBe(1);

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
      assertions: ["representative scaffold mounted", "clone roots equivalent"]
    });
  } catch (error) {
    const screenshot = await takeFailureScreenshot(page, testInfo, "encounter-balancer-reference-failure");
    await attachDonorEvidence(testInfo, {
      donorId: contract.donorId,
      label: contract.label,
      mode: contract.mode,
      route: contract.worldModelRoute,
      liveUrl: contract.liveUrl,
      worldModelRoute: url,
      status: "failed",
      rerunCommand: contract.rerunCommand,
      screenshots: [screenshot],
      errors: [error instanceof Error ? error.message : String(error)]
    });
    throw error;
  }
});
