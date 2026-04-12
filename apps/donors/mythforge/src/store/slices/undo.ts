// =============================================================================
// MythosForge - Undo/Redo Slice
// =============================================================================

import type { Entity, Relationship } from '@/lib/types';

export const MAX_HISTORY = 50;
export const MAX_SNAPSHOT_BYTES = 5 * 1024 * 1024; // 5MB budget per snapshot

export interface DataSnapshot {
  entities: Entity[];
  relationships: Relationship[];
  pinnedEntityIds: string[];
  nodePositions: Record<string, { x: number; y: number }>;
}

function isDataSnapshot(value: DataSnapshot | null | undefined): value is DataSnapshot {
  return Boolean(value);
}

interface SnapshotSource {
  entities: Entity[];
  relationships: Relationship[];
  pinnedEntityIds: string[];
  nodePositions: Record<string, { x: number; y: number }>;
  _historyPast: DataSnapshot[];
}

/**
 * Estimate the approximate byte size of a snapshot (rough heuristic).
 */
function estimateSnapshotBytes(state: SnapshotSource): number {
  const entitiesStr = JSON.stringify(state.entities);
  const relsStr = JSON.stringify(state.relationships);
  const posStr = JSON.stringify(state.nodePositions);
  return entitiesStr.length + relsStr.length + posStr.length + state.pinnedEntityIds.join(',').length;
}

/**
 * Create a deep-cloned snapshot of the current state's mutable data.
 * Skips if estimated size exceeds MAX_SNAPSHOT_BYTES.
 */
export function snapshotData(state: SnapshotSource): DataSnapshot | null {
  if (estimateSnapshotBytes(state) > MAX_SNAPSHOT_BYTES) return null;
  return {
    entities: structuredClone(state.entities),
    relationships: structuredClone(state.relationships),
    pinnedEntityIds: [...state.pinnedEntityIds],
    nodePositions: structuredClone(state.nodePositions),
  };
}

/**
 * Build the history push payload: trims past to MAX_HISTORY-1, appends current snapshot,
 * and clears future.
 */
export function pushHistory(
  state: SnapshotSource,
): { _historyPast: DataSnapshot[]; _historyFuture: DataSnapshot[] } {
  const historyPast = [...state._historyPast.slice(-(MAX_HISTORY - 1)), snapshotData(state)].filter(isDataSnapshot);
  return {
    _historyPast: historyPast,
    _historyFuture: [],
  };
}

interface UndoRedoState extends SnapshotSource {
  _historyFuture: DataSnapshot[];
  activeEntityId: string | null;
}

/**
 * Undo: pop the last snapshot from _historyPast, push current state to _historyFuture,
 * and restore the popped snapshot.
 */
export function undoAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (_fnOrState: any) => void,
  get: () => UndoRedoState,
) {
  const state = get();
  if (state._historyPast.length === 0) return;
  const past = state._historyPast;
  const previous = past[past.length - 1];
  const currentSnapshot = snapshotData(state);
    set({
    ...previous,
    _historyPast: past.slice(0, -1),
    _historyFuture: [currentSnapshot, ...state._historyFuture].slice(0, MAX_HISTORY).filter(isDataSnapshot),
  });
}

/**
 * Redo: pop the first snapshot from _historyFuture, push current state to _historyPast,
 * and restore the popped snapshot.
 */
export function redoAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (_fnOrState: any) => void,
  get: () => UndoRedoState,
) {
  const state = get();
  if (state._historyFuture.length === 0) return;
  const future = state._historyFuture;
  const next = future[0];
  const currentSnapshot = snapshotData(state);
  set({
    ...next,
    _historyPast: [...state._historyPast, currentSnapshot].filter(isDataSnapshot).slice(-MAX_HISTORY),
    _historyFuture: future.slice(1),
  });
}
