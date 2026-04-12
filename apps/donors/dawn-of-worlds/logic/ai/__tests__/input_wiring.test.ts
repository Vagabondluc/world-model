
import { describe, it, expect } from 'vitest';
import { AIAgent } from '../agent';
import { GameEvent, GameState } from '../../../types';
import { TagFactory } from '../catalogs/tag_factory';

describe('AI Phase 1: Input Wiring', () => {

    // Helper to make a minimal Agent
    const makeAgent = (id: string) => new AIAgent({
        id,
        culture: {
            id: 'TEST_CULTURE', name: 'Test',
            storePreferences: {}, familyWeights: { GRUDGE: 1, FEAR: 1, AMBITION: 1, SHAME: 1 },
            lossTolerance: 1, symbolismPreference: 1, impulsiveness: 0.5, paranoia: 0.5
        },
        availableStores: [],
        foresightConfig: { baseThreshold: 0.5, weights: { capability: 1, opportunity: 1, confidence: 1, timing: 1 } }
    });

    // Minimal Dummy State
    const mockState = {} as GameState;

    it('Should ignore own events', () => {
        const agent = makeAgent('ai_1');
        const event: GameEvent = {
            id: 'e1', type: 'WORLD_CREATE', playerId: 'ai_1', ts: 100, age: 1, round: 1, turn: 1, payload: {}
        };

        agent.onGameEvent(event, mockState);
        expect(agent.getStatus()).toContain('Focus: None'); // No tags added
    });

    it('Should generate AMBITION tag on opponent creation', () => {
        const agent = makeAgent('ai_1');
        const event: GameEvent = {
            id: 'e2', type: 'WORLD_CREATE', playerId: 'player_human', ts: 100, age: 1, round: 1, turn: 1, payload: {}
        };

        agent.onGameEvent(event, mockState);

        // Status string format: "Agent ... Focus: AMBITION | Plans: ..."
        expect(agent.getStatus()).toContain('Focus: AMBITION');
    });

    it('Should generate GRUDGE tag on destruction', () => {
        const agent = makeAgent('ai_1');
        const event: GameEvent = {
            id: 'e3', type: 'WORLD_DELETE', playerId: 'player_human', ts: 100, age: 1, round: 1, turn: 1, payload: {}
        };

        agent.onGameEvent(event, mockState);
        expect(agent.getStatus()).toContain('Focus: GRUDGE');
    });
});
