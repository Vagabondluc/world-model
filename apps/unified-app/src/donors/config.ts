import exactnessManifest from "./exactness-manifest.json";

export type DonorId =
  | "mythforge"
  | "orbis"
  | "adventure-generator"
  | "mappa-imperium"
  | "dawn-of-worlds"
  | "faction-image"
  | "watabou-city"
  | "encounter-balancer";

export type DonorClassification = "app donor" | "clean-room app donor" | "scaffold-copy donor";
export type DonorMountKind =
  | "vendored-subapp"
  | "rehost-mounted"
  | "scaffold-mounted"
  | "representative-scaffold";
export type DonorImplementationStatus =
  | "exact-vendored"
  | "rehost-mounted"
  | "scaffold-mounted"
  | "representative-scaffold-placeholder";

export interface DonorCanonicalBridgeDefinition {
  projector: string;
  actionTranslator: string;
  tests: string[];
}

export interface DonorDefinition {
  id: DonorId;
  label: string;
  classification: DonorClassification;
  route: string;
  vendoredRoot: string;
  mountKind: DonorMountKind;
  implementationStatus: DonorImplementationStatus;
  canonicalBridge: DonorCanonicalBridgeDefinition;
  characterizationBaseline: string;
  conformanceSuite: string;
  compareHint: string;
  summary: string;
  sourceStatus: string;
  sourceRoot: string;
  sourceUiUrl?: string;
}

type ExactnessManifest = {
  donorOrder: DonorId[];
  donors: Record<DonorId, DonorDefinition>;
};

const EXACTNESS_MANIFEST = exactnessManifest as ExactnessManifest;

export const DONOR_DEFINITIONS: Record<DonorId, DonorDefinition> = EXACTNESS_MANIFEST.donors;

export const DONOR_ORDER: DonorId[] = EXACTNESS_MANIFEST.donorOrder;

export function isDonorId(value: string): value is DonorId {
  return DONOR_ORDER.includes(value as DonorId);
}

export function donorLabel(donor: DonorId): string {
  return DONOR_DEFINITIONS[donor].label;
}

export const DONOR_ROUTE_LABELS = [
  "Mythforge",
  "Orbis",
  "Adventure Generator",
  "Mappa Imperium",
  "Dawn of Worlds",
  "Sacred Sigil Generator",
  "Watabou City",
  "Encounter Balancer Scaffold",
] as const;

export const DONOR_ROUTE_LABEL_HINTS = [
  { label: "Mythforge", route: "/donor/mythforge" },
  { label: "Orbis", route: "/donor/orbis" },
  { label: "Adventure Generator", route: "/donor/adventure-generator" },
  { label: "Mappa Imperium", route: "/donor/mappa-imperium" },
  { label: "Dawn of Worlds", route: "/donor/dawn-of-worlds" },
  { label: "Sacred Sigil Generator", route: "/donor/faction-image" },
  { label: "Watabou City", route: "/donor/watabou-city" },
  { label: "Encounter Balancer Scaffold", route: "/donor/encounter-balancer" },
] as const;
