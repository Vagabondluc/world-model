import { sunRaysPath } from "./geometry";
import { getSymmetryDefinition } from "./symmetryDefinitions";
import type { Layer, SymmetryConfig, SymmetryId, SymmetrySelectedBy } from "./types";

function hashString(value: string): string {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `sha256:${(h >>> 0).toString(16)}`;
}

export function computeSymmetryRevisionId(input: {
  symmetryId: SymmetryId;
  seed: string;
  domain?: string;
  generatorVersion: string;
}): string {
  return hashString(`${input.symmetryId}|${input.seed}|${input.domain || "none"}|${input.generatorVersion}`);
}

export function buildSymmetryConfig(input: {
  symmetryId: SymmetryId;
  seed: string;
  domain?: string;
  generatorVersion: string;
  selectedBy?: SymmetrySelectedBy;
  selectedAt?: string;
  regenerateReason?: "manual_symmetry_change" | "domain_change" | null;
}): SymmetryConfig {
  const definition = getSymmetryDefinition(input.symmetryId);
  return {
    symmetryId: definition.symmetryId,
    displayName: definition.displayName,
    category: definition.category,
    foldCount: definition.foldCount,
    mirrorCount: definition.mirrorCount,
    selectedAt: input.selectedAt || new Date().toISOString(),
    selectedBy: input.selectedBy || "user",
    revisionId: computeSymmetryRevisionId({
      symmetryId: input.symmetryId,
      seed: input.seed,
      domain: input.domain,
      generatorVersion: input.generatorVersion,
    }),
    symmetryVersion: "1.0.0",
    regenerateReason: input.regenerateReason ?? null,
  };
}

function composeTransform(operation: string, current?: string): string {
  return current ? `${operation} ${current}` : operation;
}

function withTransform(layer: Layer, nextId: () => string, operation: string): Layer {
  return {
    ...layer,
    id: nextId(),
    transform: composeTransform(operation, layer.transform),
  };
}

export function applySymmetryToLayers(input: {
  layers: Layer[];
  symmetryId: SymmetryId;
  centerX: number;
  centerY: number;
  size: number;
  coreLayerIds: Set<string>;
  nextId: () => string;
  accentColor: string;
  strokeWidth: number;
}): Layer[] {
  const {
    layers,
    symmetryId,
    centerX,
    centerY,
    size,
    coreLayerIds,
    nextId,
    accentColor,
    strokeWidth,
  } = input;

  if (symmetryId === "none") return layers;
  const definition = getSymmetryDefinition(symmetryId);
  const out: Layer[] = [];
  let radialRaysAdded = false;

  for (const layer of layers) {
    if (!coreLayerIds.has(layer.id)) {
      out.push(layer);
      continue;
    }

    if (symmetryId === "mirror-v") {
      out.push(layer);
      out.push(withTransform(layer, nextId, `translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`));
      continue;
    }

    if (symmetryId === "mirror-h") {
      out.push(layer);
      out.push(withTransform(layer, nextId, `translate(0,${centerY}) scale(1,-1) translate(0,${-centerY})`));
      continue;
    }

    if (symmetryId === "mirror-vh") {
      out.push(layer);
      out.push(withTransform(layer, nextId, `translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`));
      out.push(withTransform(layer, nextId, `translate(0,${centerY}) scale(1,-1) translate(0,${-centerY})`));
      out.push(withTransform(layer, nextId, `translate(${centerX},${centerY}) scale(-1,-1) translate(${-centerX},${-centerY})`));
      continue;
    }

    if (definition.category === "rotational") {
      const foldCount = definition.foldCount;
      const angleIncrement = 360 / foldCount;
      out.push(layer);
      for (let i = 1; i < foldCount; i++) {
        out.push(withTransform(
          layer,
          nextId,
          `translate(${centerX} ${centerY}) rotate(${i * angleIncrement}) translate(${-centerX} ${-centerY})`,
        ));
      }
      continue;
    }

    if (definition.category === "radial") {
      if (!radialRaysAdded) {
        const rayInnerMul = definition.foldCount >= 12 ? 0.14 : 0.18;
        const rayOuterMul = definition.foldCount >= 12 ? 0.46 : 0.44;
        out.push({
          id: nextId(),
          type: "rays",
          d: sunRaysPath(centerX, centerY, size * rayInnerMul, size * rayOuterMul, definition.foldCount),
          fill: "none",
          stroke: accentColor,
          strokeWidth: Math.max(0.75, strokeWidth * 0.6),
          opacity: 0.35,
        });
        radialRaysAdded = true;
      }
      const foldCount = definition.foldCount;
      const angleIncrement = 360 / foldCount;
      const radialOffset = size * (foldCount >= 12 ? 0.16 : 0.12);
      for (let i = 0; i < foldCount; i++) {
        out.push(withTransform(
          layer,
          nextId,
          `translate(${centerX} ${centerY}) rotate(${i * angleIncrement}) translate(0 ${-radialOffset}) translate(${-centerX} ${-centerY})`,
        ));
      }
      continue;
    }

    if (definition.category === "hybrid") {
      if (symmetryId === "hybrid-quad") {
        out.push(layer);
        out.push(withTransform(layer, nextId, `translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`));
        out.push(withTransform(layer, nextId, `translate(0,${centerY}) scale(1,-1) translate(0,${-centerY})`));
        out.push(withTransform(layer, nextId, `translate(${centerX} ${centerY}) rotate(180) translate(${-centerX} ${-centerY})`));
        continue;
      }

      const foldCount = symmetryId === "hybrid-oct" ? 4 : 3;
      const angleIncrement = 360 / foldCount;
      for (let i = 0; i < foldCount; i++) {
        const angle = i * angleIncrement;
        const rotated = withTransform(
          layer,
          nextId,
          `translate(${centerX} ${centerY}) rotate(${angle}) translate(${-centerX} ${-centerY})`,
        );
        out.push(rotated);
        const mirrored = {
          ...rotated,
          id: nextId(),
          transform: composeTransform(`translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`, rotated.transform),
        };
        out.push(mirrored);
      }
      continue;
    }

    out.push(layer);
  }
  return out;
}
