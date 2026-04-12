import { buildMythforgeCreateWorldRequest, buildMythforgeUpsertEntityRequest, hydrateMythforgeWorldState, runWorldModelDriver, type MythforgeWorldStateOverlay, type WorldCommandResponse } from './world-model';
import type { Entity } from '@/lib/types';

export interface MythforgeWorldModelHarnessResult {
  response: WorldCommandResponse;
  hydratedState: Partial<MythforgeWorldStateOverlay>;
}

export function createMythforgeWorldModelHarnessState(): MythforgeWorldStateOverlay {
  return {
    entities: [
      {
        id: 'entity-1',
        uuid_short: 'E-0001',
        title: 'First Gate',
        category: 'Dungeon',
        markdown_content: 'Harness entity one.',
        json_attributes: { rarity: 'common' },
        tags: ['harness'],
        isPinned: true,
        created_at: 1710000000000,
        updated_at: 1710000005000,
      },
      {
        id: 'entity-2',
        uuid_short: 'E-0002',
        title: 'Second Gate',
        category: 'Landmark',
        markdown_content: 'Harness entity two.',
        json_attributes: { marker: 'beta' },
        tags: ['harness'],
        isPinned: false,
        created_at: 1710000001000,
        updated_at: 1710000006000,
      },
    ],
    relationships: [
      {
        id: 'rel-1',
        parent_id: 'entity-1',
        child_id: 'entity-2',
        relationship_type: 'References',
      },
    ],
    customCategories: [],
    dmScreens: [],
    pinnedEntityIds: ['entity-1'],
    aiMode: 'lorekeeper',
    viewMode: 'graph',
  };
}

export function roundTripMythforgeWorldModel(
  state: MythforgeWorldStateOverlay = createMythforgeWorldModelHarnessState()
): MythforgeWorldModelHarnessResult {
  let response = runWorldModelDriver(buildMythforgeCreateWorldRequest(state));

  for (const entity of state.entities) {
    const request = buildMythforgeUpsertEntityRequest(entity as Entity, state);
    response = runWorldModelDriver({
      ...request,
      bundle: response.bundle,
    });
  }

  return {
    response,
    hydratedState: hydrateMythforgeWorldState(response, state),
  };
}
