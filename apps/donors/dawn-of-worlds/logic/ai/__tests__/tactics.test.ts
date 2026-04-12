
import { describe, it, expect, vi } from 'vitest';
import { TacticalMapper } from '../execution/tactics';
import { GameState, WorldObject } from '../../../types';
import { AIOption } from '../types';

describe('AI Phase 3: Tactical Mapper', () => {

    const mockUnit = (id: string, hex: any, owner: string): WorldObject => ({
        id, kind: 'ARMY', createdBy: owner, hexes: [hex], attrs: {}, isNamed: false
    });

    const mockCity = (id: string, hex: any, owner: string): WorldObject => ({
        id, kind: 'CITY', createdBy: owner, hexes: [hex], attrs: {}, isNamed: false
    });

    it('Generates MOVE action towards target', () => {
        const myUnit = mockUnit('u1', { q: 0, r: 0 }, 'ai_1');
        const targetCity = mockCity('c1', { q: 0, r: 5 }, 'player_1'); // Far away

        const state: GameState = {
            worldCache: new Map([['u1', myUnit], ['c1', targetCity]])
        } as any;

        const option: AIOption = {
            id: 'opt1', storeId: 'MILITARY_RAID', targetId: 'c1', associatedTagId: 'tag1',
            phase: 'EXECUTE', readiness: {} as any, activeScheme: null, missingFactors: [], turnsInPrep: 0
        };

        const moves = TacticalMapper.generateMoves(option, 'ai_1', state);

        expect(moves.length).toBeGreaterThan(0);
        expect(moves[0].type).toBe('MOVE_UNIT');
        expect(moves[0].payload.unitId).toBe('u1');
        // Ensure it moved closer? (0,0) -> (0,5). Next step is likely (0,1).
        expect(moves[0].payload.to).toEqual({ q: 0, r: 1 });
    });

    it('Generates ATTACK action when adjacent', () => {
        const myUnit = mockUnit('u1', { q: 0, r: 0 }, 'ai_1');
        const targetCity = mockCity('c1', { q: 0, r: 1 }, 'player_1'); // Adjacent

        const state: GameState = {
            worldCache: new Map([['u1', myUnit], ['c1', targetCity]])
        } as any;

        const option: AIOption = {
            id: 'opt1', storeId: 'MILITARY_RAID', targetId: 'c1', associatedTagId: 'tag1',
            phase: 'EXECUTE', readiness: {} as any, activeScheme: null, missingFactors: [], turnsInPrep: 0
        };

        const moves = TacticalMapper.generateMoves(option, 'ai_1', state);

        expect(moves.length).toBeGreaterThan(0);
        expect(moves[0].type).toBe('ATTACK_TILE');
        expect(moves[0].payload.attackerId).toBe('u1');
    });
});
