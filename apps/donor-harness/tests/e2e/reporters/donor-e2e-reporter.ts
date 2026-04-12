import fs from "node:fs/promises";
import path from "node:path";
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { donorE2EContracts } from "../lib/contracts";
import { loadE2EServerState } from "../lib/server-manager";
import { resolveWorkspacePath } from "../lib/paths";

interface DonorAttachment {
  donorId: string;
  label: string;
  mode: string;
  route: string;
  liveUrl: string | null;
  worldModelRoute: string;
  status: string;
  rerunCommand: string;
  screenshots?: string[];
  errors?: string[];
}

interface DonorTestEntry {
  title: string;
  file: string;
  status: TestResult["status"];
  durationMs: number;
  screenshots: string[];
  errors: string[];
  attachment?: DonorAttachment;
}

interface DonorReportEntry {
  donorId: string;
  label: string;
  mode: string;
  route: string;
  liveUrl: string | null;
  worldModelRoute: string;
  status: string;
  rerunCommand: string;
  tests: DonorTestEntry[];
  screenshots: string[];
  errors: string[];
}

function parseAttachment(result: TestResult): DonorAttachment | null {
  for (const attachment of result.attachments) {
    if (attachment.name !== "donor-e2e" || !attachment.body) {
      continue;
    }
    try {
      return JSON.parse(attachment.body.toString()) as DonorAttachment;
    } catch {
      return null;
    }
  }
  return null;
}

export default class DonorE2EReporter implements Reporter {
  private readonly tests: Array<{ test: TestCase; result: TestResult; attachment: DonorAttachment | null }> = [];

  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    this.tests.push({ test, result, attachment: parseAttachment(result) });
    await this.writeReport(result);
  }

  async onEnd(result: FullResult): Promise<void> {
    await this.writeReport(result);
  }

  private async writeReport(result: FullResult | TestResult): Promise<void> {
    const serverState = await loadE2EServerState();
    const donorEntries = new Map<string, DonorReportEntry>();

    for (const contract of donorE2EContracts.donors) {
      donorEntries.set(contract.donorId, {
        donorId: contract.donorId,
        label: contract.label,
        mode: contract.mode,
        route: contract.worldModelRoute,
        liveUrl: contract.liveUrl,
        worldModelRoute: contract.worldModelRoute,
        status: "missing",
        rerunCommand: contract.rerunCommand,
        tests: [],
        screenshots: [],
        errors: []
      });
    }

    for (const entry of this.tests) {
      const attachment = entry.attachment;
      if (!attachment) {
        continue;
      }
      const donorEntry = donorEntries.get(attachment.donorId);
      if (!donorEntry) {
        continue;
      }
      donorEntry.tests.push({
        title: entry.test.title,
        file: path.relative(process.cwd(), entry.test.location.file),
        status: entry.result.status,
        durationMs: entry.result.duration,
        screenshots: attachment.screenshots ?? [],
        errors: attachment.errors ?? [],
        attachment
      });
      donorEntry.screenshots.push(...(attachment.screenshots ?? []));
      donorEntry.errors.push(...(attachment.errors ?? []));
      donorEntry.status = entry.result.status;
    }

    for (const donorEntry of donorEntries.values()) {
      if (donorEntry.tests.length === 0) {
        donorEntry.status = "missing";
        donorEntry.errors.push(`No Playwright evidence recorded for ${donorEntry.donorId}`);
      }
    }

    const report = {
      ok: result.status === "passed",
      generatedAt: new Date().toISOString(),
      reportPath: resolveWorkspacePath(donorE2EContracts.reportPath),
      workspaceRoot: resolveWorkspacePath("."),
      appRoot: path.resolve(process.cwd()),
      worldModel: {
        label: donorE2EContracts.worldModel.label,
        cwd: resolveWorkspacePath(donorE2EContracts.worldModel.cwd),
        command: donorE2EContracts.worldModel.command,
        url: donorE2EContracts.worldModel.url
      },
      servers:
        serverState?.servers.map((server) => ({
          donorId: server.donorId,
          label: server.label,
          cwd: server.cwd,
          command: server.command,
          url: server.url,
          pid: server.pid,
          reused: server.reused,
          failed: server.failed
        })) ??
        donorE2EContracts.donors
          .filter((contract) => contract.server !== null)
          .map((contract) => ({
            donorId: contract.donorId,
            label: contract.label,
            cwd: resolveWorkspacePath(contract.server!.cwd),
            command: contract.server!.command,
            url: contract.server!.url,
            rerunCommand: contract.rerunCommand
          })),
      donors: [...donorEntries.values()],
      startupErrors:
        serverState?.servers.filter((server) => Boolean(server.failed)).map((server) => `${server.donorId}: ${server.failed}`) ?? [],
      errors: this.tests
        .filter(({ result: testResult }) => testResult.status !== "passed")
        .flatMap(({ test, result: testResult, attachment }) => {
          const donorId = attachment?.donorId ?? test.title;
          return [`${donorId}: ${testResult.status}`];
        })
    };

    const reportPath = resolveWorkspacePath(donorE2EContracts.reportPath);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf-8");
  }
}
