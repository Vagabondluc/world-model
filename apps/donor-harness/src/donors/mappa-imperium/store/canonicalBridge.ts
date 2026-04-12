/**
 * Canonical Bridge — Mappa Imperium ↔ World-Model canonical store
 *
 * The canonical store (useCanonicalStore) is the single source of truth for
 * world data.  This module provides:
 *   - Helpers to read/write MI world data from/to world.payload
 *   - A sync subscription so canonical changes propagate into the gameStore
 */

import type { WorldRecord } from '@/store/canonicalStore'
import { useCanonicalStore } from '@/store/canonicalStore'

// ---- Types ----------------------------------------------------------------

export interface MIMapData {
  hexBiomes: Record<string, string>
  regions: unknown[]
  locations: unknown[]
}

export interface MICanonicalPayload {
  mapData: MIMapData | null
  elements: unknown[]
}

// ---- Read helpers ---------------------------------------------------------

function coercePayload(world: WorldRecord | null): MICanonicalPayload {
  if (!world || typeof world.payload !== 'object' || world.payload === null) {
    return { mapData: null, elements: [] }
  }
  const p = world.payload as Record<string, unknown>
  return {
    mapData: (p['mapData'] ?? null) as MIMapData | null,
    elements: Array.isArray(p['elements']) ? p['elements'] : [],
  }
}

export function getMIMapDataFromCanonical(): MIMapData | null {
  return coercePayload(useCanonicalStore.getState().world).mapData
}

export function getMIElementsFromCanonical(): unknown[] {
  return coercePayload(useCanonicalStore.getState().world).elements
}

// ---- Write helpers --------------------------------------------------------

const DEFAULT_WORLD_ID = 'mappa-imperium-world'

function ensureWorld(world: WorldRecord | null): WorldRecord {
  if (world) return world
  return {
    world_id: DEFAULT_WORLD_ID,
    metadata: { label: 'Mappa Imperium World', summary: null, tags: ['mappa-imperium'] },
    payload: {},
    root_event_ledger: { event_ids: [] },
    root_schema_binding: null,
    workflow_registry_references: [],
    simulation_attachment: null,
    asset_attachments: [],
    top_level_entity_index: [],
  }
}

export function writeMapDataToCanonical(mapData: MIMapData | null): void {
  const { world, setWorld } = useCanonicalStore.getState()
  const base = ensureWorld(world)
  const currentPayload =
    typeof base.payload === 'object' && base.payload !== null
      ? (base.payload as Record<string, unknown>)
      : {}
  setWorld({ ...base, payload: { ...currentPayload, mapData } as unknown as import('@/store/canonicalStore').JsonValue })
}

export function writeElementsToCanonical(elements: unknown[]): void {
  const { world, setWorld } = useCanonicalStore.getState()
  const base = ensureWorld(world)
  const currentPayload =
    typeof base.payload === 'object' && base.payload !== null
      ? (base.payload as Record<string, unknown>)
      : {}
  setWorld({ ...base, payload: { ...currentPayload, elements } as unknown as import('@/store/canonicalStore').JsonValue })
}

// ---- Canonical → gameStore sync subscription ----------------------------

/**
 * Call once at app startup.  Returns an unsubscribe function.
 * When the canonical world record changes its mapData or elements,
 * those changes are pushed into the gameStore.
 */
export function subscribeCanonicalToGameStore(
  setMapData: (d: MIMapData) => void,
  setElements: (e: unknown[]) => void,
): () => void {
  let prevMapDataJson = ''
  let prevElementsJson = ''

  return useCanonicalStore.subscribe((state) => {
    const { mapData, elements } = coercePayload(state.world)
    const newMapJson = JSON.stringify(mapData)
    const newElemJson = JSON.stringify(elements)

    if (mapData && newMapJson !== prevMapDataJson) {
      prevMapDataJson = newMapJson
      setMapData(mapData)
    }
    if (newElemJson !== prevElementsJson) {
      prevElementsJson = newElemJson
      setElements(elements)
    }
  })
}
