import type { AssetRecord, ExportPayload } from "./types";

export function assetRecordKey(input: {
  factionId: string;
  seed: string;
  variantIndex: number;
  compositionRevisionId: string;
}): string {
  return [
    input.factionId,
    input.seed,
    String(input.variantIndex),
    input.compositionRevisionId,
  ].join(":");
}

export function toAssetRecord(payload: ExportPayload): AssetRecord {
  const key = assetRecordKey({
    factionId: payload.faction.id,
    seed: payload.state.seed,
    variantIndex: payload.selection.variantIndex,
    compositionRevisionId: payload.composition?.revisionId || "none",
  });
  return {
    key,
    factionId: payload.faction.id,
    seed: payload.state.seed,
    seedRevision: payload.state.seedRevision,
    seedHistory: payload.state.seedHistory,
    variantIndex: payload.selection.variantIndex,
    compositionRevisionId: payload.composition?.revisionId || "none",
    payload,
  };
}

export function rehydrateDeterminismInputs(record: AssetRecord): {
  seed: string;
  seedRevision: number;
  compositionRevisionId: string;
  variantIndex: number;
} {
  return {
    seed: record.seed,
    seedRevision: record.seedRevision,
    compositionRevisionId: record.compositionRevisionId,
    variantIndex: record.variantIndex,
  };
}

