import type { Frame, Page, TestInfo } from "@playwright/test";

export function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function takeFailureScreenshot(page: Page, testInfo: TestInfo, slug: string): Promise<string> {
  const screenshotPath = testInfo.outputPath(`${slug}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(`${slug}-screenshot`, {
    path: screenshotPath,
    contentType: "image/png"
  });
  return screenshotPath;
}

function searchTargets(page: Page): Array<Page | Frame> {
  return [page, ...page.frames().filter((frame) => frame.url() !== "about:blank")];
}

export async function collectPageDiagnostics(page: Page): Promise<string> {
  const lines: string[] = [];
  lines.push(`title: ${await page.title().catch(() => "")}`);
  lines.push(`frames: ${page.frames().map((frame) => frame.url()).join(" | ")}`);
  const targets = searchTargets(page);
  for (const [index, target] of targets.entries()) {
    const kind = index === 0 ? "page" : `frame:${target.url()}`;
    const bodyText = await target.locator("body").innerText().catch(() => "");
    const buttons = await target.getByRole("button").evaluateAll((els) =>
      els.map((el) => ({
        text: (el.innerText || el.textContent || "").trim(),
        aria: el.getAttribute("aria-label"),
        title: el.getAttribute("title")
      }))
    ).catch(() => []);
    const links = await target.getByRole("link").evaluateAll((els) =>
      els.map((el) => ({
        text: (el.innerText || el.textContent || "").trim(),
        aria: el.getAttribute("aria-label"),
        title: el.getAttribute("title")
      }))
    ).catch(() => []);
    const headings = await target.locator("h1,h2,h3,h4,[role='heading']").evaluateAll((els) =>
      els.map((el) => ({
        text: (el.innerText || el.textContent || "").trim(),
        aria: el.getAttribute("aria-label")
      }))
    ).catch(() => []);
    lines.push(`-- ${kind} --`);
    lines.push(`body: ${bodyText.slice(0, 1500)}`);
    lines.push(`buttons: ${JSON.stringify(buttons)}`);
    lines.push(`links: ${JSON.stringify(links)}`);
    lines.push(`headings: ${JSON.stringify(headings)}`);
  }
  return lines.join("\n");
}

export async function assertTextVisible(page: Page, candidates: string[]): Promise<string> {
  for (const candidate of candidates) {
    for (const target of searchTargets(page)) {
      const locator = target.getByText(candidate, { exact: false });
      const count = await locator.count().catch(() => 0);
      for (let index = 0; index < count; index += 1) {
        if (await locator.nth(index).isVisible().catch(() => false)) {
          return candidate;
        }
      }
    }
  }
  throw new Error(`None of the visible text candidates matched: ${candidates.join(", ")}`);
}

export async function assertRequiredControl(page: Page, requirement: { role: string; anyOf?: string[] }): Promise<void> {
  let foundAny = false;
  for (const target of searchTargets(page)) {
    const locator = target.getByRole(requirement.role as never);
    const count = await locator.count().catch(() => 0);
    if (count === 0) {
      continue;
    }
    foundAny = true;
    if (!requirement.anyOf || requirement.anyOf.length === 0) {
      return;
    }
    for (const candidate of requirement.anyOf) {
      const namedLocator = target.getByRole(requirement.role as never, { name: new RegExp(escapeForRegExp(candidate), "i") });
      const count = await namedLocator.count().catch(() => 0);
      for (let index = 0; index < count; index += 1) {
        if (await namedLocator.nth(index).isVisible().catch(() => false)) {
          return;
        }
      }
    }
    if (requirement.role === "button" && requirement.anyOf && requirement.anyOf.length > 0) {
      const rawButtons = await target.locator("button").evaluateAll((els) =>
        els.map((el) => `${(el.innerText || el.textContent || "").trim()} | ${(el.getAttribute("aria-label") || "")} | ${(el.getAttribute("title") || "")}`)
      ).catch(() => []);
      for (const candidate of requirement.anyOf) {
        const normalized = candidate.toLowerCase();
        if (rawButtons.some((entry) => entry.toLowerCase().includes(normalized))) {
          return;
        }
      }
    }
  }
  if (!foundAny) {
    throw new Error(`Expected at least one ${requirement.role} control`);
  }
  throw new Error(`No ${requirement.role} matched any of: ${requirement.anyOf.join(", ")}`);
}
