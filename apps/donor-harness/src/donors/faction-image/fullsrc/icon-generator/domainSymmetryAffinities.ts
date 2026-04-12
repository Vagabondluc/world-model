import type { FactionDomain } from "./domainPalettes";
import type { SymmetryId } from "./types";

type DomainAffinity = {
  primary: SymmetryId;
  secondary: SymmetryId[];
};

export const DOMAIN_SYMMETRY_AFFINITIES: Record<FactionDomain, DomainAffinity> = {
  divine: { primary: "radial-6", secondary: ["radial-8", "hybrid-hex", "hybrid-oct"] },
  order: { primary: "hybrid-quad", secondary: ["rot-4", "radial-4", "rot-8"] },
  chaos: { primary: "none", secondary: ["rot-2", "rot-3", "rot-6"] },
  nature: { primary: "radial-6", secondary: ["rot-6", "rot-3", "mirror-h"] },
  shadow: { primary: "mirror-v", secondary: ["rot-2", "none", "mirror-h"] },
  arcane: { primary: "rot-8", secondary: ["radial-8", "hybrid-oct", "rot-6"] },
  primal: { primary: "rot-6", secondary: ["rot-3", "mirror-v", "none"] },
  death: { primary: "rot-2", secondary: ["mirror-v", "none", "radial-4"] },
  life: { primary: "radial-6", secondary: ["radial-8", "mirror-h", "rot-6"] },
  forge: { primary: "rot-4", secondary: ["hybrid-quad", "mirror-vh", "radial-4"] },
  storm: { primary: "rot-8", secondary: ["radial-8", "radial-12", "hybrid-oct"] },
  trickery: { primary: "hybrid-tri", secondary: ["rot-3", "mirror-v", "none"] },
};

export function getDomainSymmetrySuggestions(domain?: FactionDomain): { primary: SymmetryId | null; secondary: SymmetryId[] } {
  if (!domain) return { primary: null, secondary: [] };
  const affinity = DOMAIN_SYMMETRY_AFFINITIES[domain];
  if (!affinity) return { primary: null, secondary: [] };
  return { primary: affinity.primary, secondary: affinity.secondary };
}
