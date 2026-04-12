import path from "node:path";

export const donorHarnessRoot = path.resolve(process.cwd());
export const workspaceRoot = path.resolve(donorHarnessRoot, "../../..");
export const worldModelRoot = path.resolve(workspaceRoot, "world-model");
export const donorServerStatePath = path.resolve(donorHarnessRoot, ".donor-server-state.json");

export function resolveWorkspacePath(...segments: string[]): string {
  return path.resolve(workspaceRoot, ...segments);
}

export function resolveWorldModelPath(...segments: string[]): string {
  return path.resolve(worldModelRoot, ...segments);
}

export function toPosix(value: string): string {
  return value.replace(/\\/g, "/");
}
