
import { describe, it, expect } from 'vitest';
import { decideNextMove } from '../brain';
import { GameState } from '../../../types';
import { DEFAULT_PERSONALITIES } from '../profiles';
import { AIManager } from '../manager';

describe('AI Phase 4: Integration', () => {

    // Mock State: AI has an Army, Enemy has a City. Distance = 2.
    // Pressure: (Triggered by Event) -> Logic -> Action

    it('Full Loop: Event -> Pressure -> Logic -> Action', () => {
        const aiId = 'ai_integration_1';
        const enemyId = 'player_human';

        // 1. Mock State with Event
        // Event: Enemy destroyed AI city -> Triggers GRUDGE
        const state: GameState = {
            events: [
                { id: 'e1', type: 'WORLD_DELETE', playerId: enemyId, payload: { kind: 'CITY', worldId: 'u_ai_lost' }, turn: 1 } as any
            ],
            // World Cache: AI Army at (0,0), Enemy City at (0,2). Power important for Readiness!
            worldCache: new Map([
                ['u1', { id: 'u1', kind: 'ARMY', createdBy: aiId, hexes: [{ q: 0, r: 0 }], attrs: { power: 10 } } as any],
                ['c1', { id: 'c1', kind: 'CITY', createdBy: enemyId, hexes: [{ q: 0, r: 2 }], attrs: { power: 5 } } as any]
            ]),
            playerCache: {},
            activePlayerId: aiId,
            revokedEventIds: new Set()
        } as any;

        // 2. Call Brain (First pass - Process Events & Think)
        // Personality: Aggressor (High Conflict, Low Threshold)
        const decision1 = decideNextMove(state, aiId, DEFAULT_PERSONALITIES.AGGRESSOR);

        if (decision1.shouldYield) {
            console.log("Yielded. Reason:", decision1.reason);
        } else {
            console.log("Action:", decision1.action?.type, decision1.action?.payload);
            expect(decision1.action).toBeDefined();
            // Should be MOVE_UNIT towards enemy city
            expect(['MOVE_UNIT', 'ATTACK_TILE']).toContain(decision1.action!.type);
        }
    });
});
