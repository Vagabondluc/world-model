import type { CompositionConfig, CompositionMode } from "./types";

function hashString(value: string): string {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `sha256:${(h >>> 0).toString(16)}`;
}

export function compositionRevisionId(input: unknown): string {
  return hashString(JSON.stringify(input));
}

export function buildCompositionConfig(input: {
  id?: string;
  mode?: CompositionMode;
  compositionVersion?: number;
  appliedToVariants?: string[] | "all";
  updatedAt?: string;
  normalizedInput: unknown;
}): CompositionConfig {
  return {
    id: input.id || "composition-main",
    compositionVersion: input.compositionVersion ?? 1,
    mode: input.mode || "overlay-center",
    revisionId: compositionRevisionId(input.normalizedInput),
    appliedToVariants: input.appliedToVariants || "all",
    updatedAt: input.updatedAt || new Date().toISOString(),
  };
}

