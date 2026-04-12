import type { TestInfo } from "@playwright/test";

export async function attachDonorEvidence(testInfo: TestInfo, payload: unknown): Promise<void> {
  await testInfo.attach("donor-e2e", {
    body: JSON.stringify(payload, null, 2),
    contentType: "application/json"
  });
}
