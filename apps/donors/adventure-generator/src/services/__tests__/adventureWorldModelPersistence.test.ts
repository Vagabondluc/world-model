import { describe, expect, it, beforeEach } from 'vitest';

import { createAdventureWorldModelHarnessSession } from '../../lib/world-model-harness';
import { loadAdventureWorldModelSession, saveAdventureWorldModelBundle } from '../adventureWorldModelPersistence';
import type { SessionStateV2 } from '../../types/session';

describe('adventure world-model persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads the canonical world-model bundle', async () => {
    const snapshot = createAdventureWorldModelHarnessSession();
    const session: SessionStateV2 = {
      version: 2,
      campaignState: snapshot.campaignState,
      locationState: snapshot.locationState,
      compendiumState: snapshot.compendiumState,
      generatorState: snapshot.generatorState,
    };
    const rootPath = 'adventure-mvp-smoke';

    const saved = await saveAdventureWorldModelBundle(rootPath, session, snapshot.workflowState);
    expect(saved.status).toBe('Applied');

    const loaded = await loadAdventureWorldModelSession(rootPath, session);
    expect(loaded?.version).toBe(2);
    expect(loaded?.campaignState.config.worldName).toBe('Adventure Harness World');
    expect(loaded?.locationState.activeMapId).toBe('map-1');
    expect(loaded?.generatorState.generationHistory?.[0]?.type).toBe('hooks');
  });
});
