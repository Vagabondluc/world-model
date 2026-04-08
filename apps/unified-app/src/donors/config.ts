export type DonorId = "mythforge" | "orbis" | "adventure-generator";

export type DonorClassification = "app donor" | "fragment donor" | "semantic-only donor";

export interface DonorDefinition {
  id: DonorId;
  label: string;
  classification: DonorClassification;
  route: string;
  compareHint: string;
  summary: string;
  sourceStatus: string;
}

export const DONOR_DEFINITIONS: Record<DonorId, DonorDefinition> = {
  mythforge: {
    id: "mythforge",
    label: "Mythforge",
    classification: "app donor",
    route: "/donor/mythforge",
    compareHint: "Runnable donor UI with real tests and recoverable panel structure.",
    summary: "World authoring donor with explorer, workspace, dialogs, and canonical save/open affordances.",
    sourceStatus: "Full donor app exists in the workspace."
  },
  orbis: {
    id: "orbis",
    label: "Orbis",
    classification: "semantic-only donor",
    route: "/donor/orbis",
    compareHint: "No runnable donor UI in the workspace; surface is derived from adapter semantics.",
    summary: "Simulation donor defining domain toggles, fidelity, snapshots, and event-stream review.",
    sourceStatus: "Adapter docs and snapshots exist, but no runnable UI root was found."
  },
  "adventure-generator": {
    id: "adventure-generator",
    label: "Adventure Generator",
    classification: "fragment donor",
    route: "/donor/adventure-generator",
    compareHint: "Guided workflow donor reconstructed from surviving app residue and adapter contracts.",
    summary: "Workflow donor defining guided steps, checkpoints, progress, and generated-output review.",
    sourceStatus: "Compiled app residue exists, but complete source and package metadata are missing."
  }
};

export const DONOR_ORDER: DonorId[] = ["mythforge", "orbis", "adventure-generator"];

export function isDonorId(value: string): value is DonorId {
  return value === "mythforge" || value === "orbis" || value === "adventure-generator";
}

export function donorLabel(donor: DonorId): string {
  return DONOR_DEFINITIONS[donor].label;
}
