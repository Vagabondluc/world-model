import type { LayerType, SymmetryId } from "./types";

export type CompatibilityLevel = "good" | "warn";

const MATRIX: Record<SymmetryId, Partial<Record<LayerType, CompatibilityLevel>>> = {
  none: {},
  "mirror-v": {},
  "mirror-h": {},
  "mirror-vh": {
    triangle: "warn",
  },
  "rot-2": {
    triangle: "warn",
    pentagon: "warn",
  },
  "rot-3": {
    square: "warn",
    star: "warn",
    pentagon: "warn",
  },
  "rot-4": {
    triangle: "warn",
    pentagon: "warn",
  },
  "rot-6": {
    square: "warn",
    triangle: "warn",
  },
  "rot-8": {
    triangle: "warn",
    pentagon: "warn",
  },
  "radial-4": {
    triangle: "warn",
    pentagon: "warn",
  },
  "radial-6": {
    square: "warn",
    triangle: "warn",
  },
  "radial-8": {
    triangle: "warn",
    pentagon: "warn",
  },
  "radial-12": {
    triangle: "warn",
    square: "warn",
  },
  "radial-16": {
    triangle: "warn",
    pentagon: "warn",
  },
  "hybrid-quad": {
    triangle: "warn",
  },
  "hybrid-hex": {
    square: "warn",
  },
  "hybrid-tri": {
    square: "warn",
    pentagon: "warn",
  },
  "hybrid-oct": {
    triangle: "warn",
  },
};

function normalizeShape(baseShape?: LayerType): LayerType | null {
  if (!baseShape) return null;
  if (baseShape === "diamond") return "square";
  if (baseShape === "eye" || baseShape === "sun" || baseShape === "moon" || baseShape === "ring" || baseShape === "circle") {
    return "circle";
  }
  return baseShape;
}

export function getSymmetryCompatibility(symmetryId: SymmetryId, baseShape?: LayerType): CompatibilityLevel {
  const shape = normalizeShape(baseShape);
  if (!shape) return "good";
  return MATRIX[symmetryId][shape] || "good";
}
