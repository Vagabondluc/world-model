import contractData from "../contracts/donor-e2e-contracts.json";
import { resolveWorkspacePath, toPosix } from "./paths";

export interface ControlRequirement {
  role: "button" | "textbox" | "link" | "dialog" | "combobox";
  anyOf?: string[];
}

export interface WorldModelSentinel {
  testId: string;
  mountKind: string;
  disallowedEvidence: string[];
}

export interface DonorE2EContract {
  donorId: string;
  label: string;
  classification: string;
  mode: "live-compare" | "clean-room-compare" | "reference-baseline" | "representative-scaffold";
  liveUrl: string | null;
  server:
    | {
        cwd: string;
        command: string[];
        url: string;
      }
    | null;
  worldModelRoute: string;
  requiredLandmarks: string[];
  requiredControls: ControlRequirement[];
  worldModelSentinel: WorldModelSentinel;
  primaryWorkflow: string[];
  canonicalExpectation: string;
  rerunCommand: string;
  referenceEvidence?: string;
  cloneRoots?: string[];
}

export interface DonorE2EContractsFile {
  reportPath: string;
  workspaceRoot: string;
  worldModel: {
    label: string;
    cwd: string;
    command: string[];
    url: string;
  };
  donors: DonorE2EContract[];
}

export const donorE2EContracts = contractData as DonorE2EContractsFile;

export const donorById = new Map<string, DonorE2EContract>(donorE2EContracts.donors.map((contract) => [contract.donorId, contract]));
export const appDonors = donorE2EContracts.donors.filter((contract) =>
  contract.mode === "live-compare" || contract.mode === "clean-room-compare"
);
export const referenceDonors = donorE2EContracts.donors.filter(
  (contract) => contract.mode !== "live-compare" && contract.mode !== "clean-room-compare"
);

export function donorWorldModelUrl(contract: DonorE2EContract): string {
  return new URL(contract.worldModelRoute, donorE2EContracts.worldModel.url).toString();
}

export function donorLiveUrl(contract: DonorE2EContract): string | null {
  return contract.liveUrl;
}

export function donorServerCwd(contract: DonorE2EContract): string {
  if (!contract.server) {
    return resolveWorkspacePath("world-model");
  }
  return resolveWorkspacePath(contract.server.cwd);
}

export function donorCloneRoots(contract: DonorE2EContract): string[] {
  return (contract.cloneRoots ?? []).map((root) => toPosix(resolveWorkspacePath(root)));
}
