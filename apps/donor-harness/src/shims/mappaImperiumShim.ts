import { useCanonicalStore, WorldRecord } from '../store/canonicalStore'

function emptyWorld(label: string, firstId: string): WorldRecord {
  return {
    world_id: 'world-1',
    metadata: { label, summary: null, tags: [] },
    payload: {},
    root_event_ledger: { event_ids: [] },
    root_schema_binding: null,
    workflow_registry_references: [],
    simulation_attachment: null,
    asset_attachments: [],
    top_level_entity_index: [firstId],
  }
}

export const useMappaImperiumShim = () => {
  const world = useCanonicalStore((s) => s.world)
  const setWorld = useCanonicalStore((s) => s.setWorld)

  const createEmpire = (payload: { name: string }) => {
    const id = `mappa-${Date.now()}`
    if (world) {
      setWorld({ ...world, top_level_entity_index: [...world.top_level_entity_index, id] })
    } else {
      setWorld(emptyWorld(payload.name, id))
    }
  }

  const listEmpires = (): string[] =>
    world?.top_level_entity_index.filter((id) => id.startsWith('mappa-')) ?? []

  return { createEmpire, listEmpires }
}
