import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import type { DonorE2EContract } from "./contracts";
import { appDonors, donorE2EContracts, donorServerCwd } from "./contracts";
import { donorServerStatePath, resolveWorkspacePath } from "./paths";

export interface ManagedServer {
  donorId: string;
  label: string;
  url: string;
  cwd: string;
  command: string[];
  logPath: string;
  pid: number | null;
  reused: boolean;
  failed: string | null;
}

interface SerializableServerState extends ManagedServer {
  startedAt: string;
}

const SERVER_LOG_ROOT = path.resolve(process.cwd(), ".playwright-servers");
const WAIT_TIMEOUT_MS = 180_000;
const POLL_INTERVAL_MS = 1000;

function quoteArg(value: string): string {
  return /\s|"/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
}

function executableFor(command: string): string {
  if (os.platform() !== "win32") {
    return command;
  }
  if (command.endsWith(".cmd") || command.endsWith(".exe")) {
    return command;
  }
  return `${command}.cmd`;
}

async function urlReady(url: string): Promise<boolean> {
  try {
    await fetch(url, { redirect: "manual" });
    return true;
  } catch {
    return false;
  }
}

async function waitForUrl(url: string, timeoutMs = WAIT_TIMEOUT_MS): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await urlReady(url)) {
      return;
    }
    await delay(POLL_INTERVAL_MS);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function startServer(contract: DonorE2EContract, command: string[], cwd: string, logRoot: string): Promise<ManagedServer> {
  const url = contract.server?.url ?? donorE2EContracts.worldModel.url;
  const logPath = path.resolve(logRoot, `${contract.donorId}.log`);
  if (await urlReady(url)) {
    return {
      donorId: contract.donorId,
      label: contract.label,
      url,
      cwd,
      command,
      logPath,
      pid: null,
      reused: true,
      failed: null
    };
  }

  let child: ReturnType<typeof spawn> | null = null;
  try {
    await fs.mkdir(logRoot, { recursive: true });
    const stream = createWriteStream(logPath, { flags: "a" });
    const executable = executableFor(command[0]);
    const args = command.slice(1);
    child = spawn(executable, args, {
      cwd,
      env: { ...process.env },
      shell: os.platform() === "win32",
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    child.stdout?.pipe(stream);
    child.stderr?.pipe(stream);

    const exitPromise = new Promise<void>((resolve, reject) => {
      child.once("error", (error) => reject(error));
      child.once("exit", (code, signal) => {
        if (code === 0) {
          resolve();
          return;
        }
        reject(new Error(`Server ${contract.donorId} exited early with code ${code ?? "null"}${signal ? ` signal ${signal}` : ""}`));
      });
    });

    await Promise.race([waitForUrl(url), exitPromise]);
    return {
      donorId: contract.donorId,
      label: contract.label,
      url,
      cwd,
      command,
      logPath,
      pid: child.pid ?? null,
      reused: false,
      failed: null
    };
  } catch (error) {
    if (child?.pid) {
      await killServer({
        donorId: contract.donorId,
        label: contract.label,
        url,
        cwd,
        command,
        logPath,
        pid: child.pid,
        reused: false,
        failed: null
      });
    }
    return {
      donorId: contract.donorId,
      label: contract.label,
      url,
      cwd,
      command,
      logPath,
      pid: child?.pid ?? null,
      reused: false,
      failed: error instanceof Error ? error.message : String(error)
    };
  }
}

async function killServer(server: ManagedServer): Promise<void> {
  if (server.pid === null || server.reused || server.failed) {
    return;
  }
  if (os.platform() === "win32") {
    await new Promise<void>((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { windowsHide: true, shell: false });
      killer.once("exit", () => resolve());
      killer.once("error", () => resolve());
    });
    return;
  }
  try {
    process.kill(server.pid, "SIGTERM");
  } catch {
    return;
  }
}

export async function startE2EServers(): Promise<ManagedServer[]> {
  const logRoot = SERVER_LOG_ROOT;
  await fs.mkdir(logRoot, { recursive: true });
  const servers: ManagedServer[] = [];

  const worldModelServer = await startServer(
    {
      donorId: donorE2EContracts.worldModel.label,
      label: donorE2EContracts.worldModel.label,
      classification: "app donor",
      mode: "live-compare",
      liveUrl: donorE2EContracts.worldModel.url,
      server: {
        cwd: donorE2EContracts.worldModel.cwd,
        command: donorE2EContracts.worldModel.command,
        url: donorE2EContracts.worldModel.url
      },
      worldModelRoute: "/world",
      requiredLandmarks: [],
      requiredControls: [],
      worldModelSentinel: { testId: "unused", mountKind: "unused", disallowedEvidence: [] },
      primaryWorkflow: [],
      canonicalExpectation: "",
      rerunCommand: ""
    } as DonorE2EContract,
    donorE2EContracts.worldModel.command,
    resolveWorkspacePath(donorE2EContracts.worldModel.cwd),
    logRoot
  );
  servers.push(worldModelServer);

  const donorServers = await Promise.all(
    appDonors
      .filter((contract) => contract.server !== null)
      .map((contract) => startServer(contract, contract.server!.command, donorServerCwd(contract), logRoot))
  );
  servers.push(...donorServers);

  await fs.writeFile(
    donorServerStatePath,
    JSON.stringify(
      {
        startedAt: new Date().toISOString(),
        servers
      } satisfies { startedAt: string; servers: SerializableServerState[] },
      null,
      2
    ),
    "utf-8"
  );

  return servers;
}

export async function stopE2EServers(servers: ManagedServer[]): Promise<void> {
  for (const server of [...servers].reverse()) {
    await killServer(server);
  }
}

export async function loadE2EServerState(): Promise<{ startedAt: string; servers: SerializableServerState[] } | null> {
  try {
    const text = await fs.readFile(donorServerStatePath, "utf-8");
    return JSON.parse(text) as { startedAt: string; servers: SerializableServerState[] };
  } catch {
    return null;
  }
}

export async function clearE2EServerState(): Promise<void> {
  try {
    await fs.unlink(donorServerStatePath);
  } catch {
    return;
  }
}
