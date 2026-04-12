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

export const useFactionImageShim = () => {
  const world = useCanonicalStore((s) => s.world)
  const setWorld = useCanonicalStore((s) => s.setWorld)

  const createImage = (payload: { filename: string }) => {
    const id = `faction-${Date.now()}`
    if (world) {
      setWorld({ ...world, top_level_entity_index: [...world.top_level_entity_index, id] })
    } else {
      setWorld(emptyWorld(payload.filename, id))
    }
  }

  const listImages = (): string[] =>
    world?.top_level_entity_index.filter((id) => id.startsWith('faction-')) ?? []

  return { createImage, listImages }
}
