import { describe, expect, it } from 'vitest';

import { createAdventureWorldModelHarnessSession, roundTripAdventureWorldModel } from '../world-model-harness';

describe('adventure world-model harness', () => {
  it('round-trips the workflow and spatial state through the Rust driver', () => {
    const session = createAdventureWorldModelHarnessSession();
    const { response, hydratedState } = roundTripAdventureWorldModel(session);

    expect(response.status).toBe('Applied');
    expect(response.bundle.world?.world_id).toBe('Adventure Harness World');
    expect(response.bundle.entities['loc-1']?.entity_type).toBe('location');
    expect(Object.keys(response.bundle.assets)).toContain('map-map-1');
    expect(hydratedState.locationState?.activeMapId).toBe('map-1');
    expect(hydratedState.locationState?.maps?.['map-1']?.name).toBe('Harness Map');
    expect(hydratedState.adventureState?.generationHistory?.length).toBeGreaterThanOrEqual(1);
    expect(hydratedState.adventureState?.generationHistory?.[0]?.type).toBe('hooks');
    expect(hydratedState.adventureState?.currentAdventureCompendiumIds).toEqual([]);
  });
});
