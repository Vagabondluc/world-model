import { describe, expect, it } from 'vitest';

import { createMythforgeWorldModelHarnessState, roundTripMythforgeWorldModel } from '../world-model-harness';

describe('mythforge world-model harness', () => {
  it('round-trips the canonical bundle through the Rust driver', () => {
    const state = createMythforgeWorldModelHarnessState();
    const { response, hydratedState } = roundTripMythforgeWorldModel(state);

    expect(response.status).toBe('Applied');
    expect(response.bundle.world?.world_id).toBe('mythforge-world');
    expect(Object.keys(response.bundle.entities)).toHaveLength(2);
    expect(response.bundle.relations).toHaveLength(1);
    expect(Object.keys(response.bundle.assets)).toHaveLength(0);
    expect(hydratedState.entities).toHaveLength(2);
    expect(hydratedState.relationships).toHaveLength(1);
    expect(hydratedState.pinnedEntityIds).toEqual(['entity-1']);
  });
});
