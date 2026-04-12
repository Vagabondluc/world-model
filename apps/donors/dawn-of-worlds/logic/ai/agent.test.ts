
import { describe, it, expect, beforeEach } from 'vitest';
import { AIAgent } from './agent';
import { GameState, GameEvent } from '../../types';
import { DEFAULT_PERSONALITIES } from './profiles';
import { TagFactory } from './catalogs/tag_factory';

describe('AIAgent', () => {
    let agent: AIAgent;
    let mockState: GameState;

    beforeEach(() => {
        const config = {
            id: 'P1',
            culture: DEFAULT_PERSONALITIES.EXPANSIONIST.culture,
            availableStores: DEFAULT_PERSONALITIES.EXPANSIONIST.stores,
            foresightConfig: DEFAULT_PERSONALITIES.EXPANSIONIST.foresight
        };
        agent = new AIAgent(config);

        mockState = {
            age: 1,
            round: 1,
            turn: 1,
            activePlayerId: 'P1',
            players: ['P1', 'P2'],
            events: [],
            revokedEventIds: new Set(),
            draftRollbackUsedByAge: {},
            activeSelection: { kind: 'NONE' },
            previewEvent: null,
            chronicle: {},
            worldCache: new Map([
                ['city_p1', { id: 'city_p1', kind: 'CITY', createdBy: 'P1', hexes: [{ q: 0, r: 0 }], attrs: { power: 10 } } as any],
                ['army_p1', { id: 'army_p1', kind: 'ARMY', createdBy: 'P1', hexes: [{ q: 0, r: 1 }], attrs: { power: 5 } } as any],
                ['city_p2', { id: 'city_p2', kind: 'CITY', createdBy: 'P2', hexes: [{ q: 5, r: 5 }], attrs: { power: 10 } } as any] // Target
            ]),
            playerCache: {
                'P1': { currentPower: 30, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: true }, // High power
                'P2': { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false }
            },
            onboardingStep: 'DONE',
            isHandoverActive: false,
            combatSession: null,
            settings: {} as any
        };
    });

    it('should generate plans when receiving OPPORTUNITY pressure', () => {
        // 1. Simulate Power Roll Event
        const event: GameEvent = {
            id: 'evt_power',
            type: 'POWER_ROLL',
            playerId: 'P1',
            ts: Date.now(),
            age: 1, round: 1, turn: 1,
            payload: { result: 20 } // Big roll
        };

        // 2. Ingest Event
        agent.onGameEvent(event, mockState);

        // 3. Think
        const actions = agent.think(mockState);

        // 4. Verify Status 
        const status = agent.getStatus();
        console.log('Agent Status:', status);

        if (!status.includes('Focus: OPPORTUNITY')) {
            throw new Error(`Expected Focus: OPPORTUNITY, but got: ${status}`);
        }
        expect(status).toContain('Focus: OPPORTUNITY');

        // Should be in EXECUTE phase because we gave it high power and resources
        expect(status).toMatch(/Plans:.*\[EXECUTE .*\%\]/);

        // 5. Verify Actions Generated
        console.log(`Actions generated: ${actions.length}`);
        expect(actions.length).toBeGreaterThan(0);
        expect(actions[0].type).toMatch(/ATTACK_TILE|MOVE_UNIT|WORLD_CREATE/);
    });
});
