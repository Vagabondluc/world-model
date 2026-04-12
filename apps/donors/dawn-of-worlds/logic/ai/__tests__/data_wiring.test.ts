
import { describe, it, expect, vi } from 'vitest';
import { IntelSystem } from '../analysis/intel';
import { ForesightEngine } from '../foresight';
import { GameState, WorldObject } from '../../../types';
import { AgentID, CulturalBias, AIOption } from '../types';

describe('AI Phase 2: Data Wiring', () => {

    // Helper to mock state
    const mockState = (cache: Record<string, any>): GameState => ({
        worldCache: new Map(Object.entries(cache)),
        // ... include other minimal state if needed by IntelSystem
    } as any);

    it('IntelSystem: Counts units accurately', () => {
        const state = mockState({
            'u1': { id: 'u1', kind: 'ARMY', createdBy: 'player_1', attrs: { power: 10 } },
            'u2': { id: 'u2', kind: 'ARMY', createdBy: 'player_1', attrs: { power: 5 } },
            'u3': { id: 'u3', kind: 'CITY', createdBy: 'player_1', attrs: {} }, // Not an army
            'u4': { id: 'u4', kind: 'ARMY', createdBy: 'player_2', attrs: { power: 100 } }
        });

        const report = IntelSystem.generateReport('ai_1', 'player_1', state);

        expect(report.visibleUnits).toBe(2); // Army only
        expect(report.estimatedStrength).toBe(15); // 10 + 5
    });

    it('Foresight: Calculates Capability Ratio', () => {
        // Setup Engine
        const engine = new ForesightEngine({
            baseThreshold: 0.5,
            weights: { capability: 1, opportunity: 0, confidence: 0, timing: 0 } // Isolate Capability
        });

        // Mock State: ME = 10 power, TARGET = 10 power. Ratio should be 0.5
        const state = mockState({
            'my_u1': { id: 'my_u1', kind: 'ARMY', createdBy: 'me', attrs: { power: 10 } },
            'their_u1': { id: 'their_u1', kind: 'ARMY', createdBy: 'them', attrs: { power: 10 } }
        });

        const option: AIOption = {
            id: 'opt1', storeId: 'RAID', targetId: 'them', associatedTagId: 'tag1',
            phase: 'CONSIDER', readiness: { total: 0, capability: 0, opportunity: 0, confidence: 0, timing: 0 },
            activeScheme: null, missingFactors: [], turnsInPrep: 0
        };

        const bias: CulturalBias = {
            id: 'test', name: 'test', storePreferences: {}, familyWeights: {} as any,
            lossTolerance: 1, symbolismPreference: 1, impulsiveness: 0, paranoia: 0
        };

        const result = engine.evaluateOption(option, bias, state, 'me');

        // Capability = 10 / (10 + 10) = 0.5
        expect(result.readiness.capability).toBeCloseTo(0.5);
    });

    it('Foresight: Calculates Dominance', () => {
        const engine = new ForesightEngine({
            baseThreshold: 0.5,
            weights: { capability: 1, opportunity: 0, confidence: 0, timing: 0 }
        });

        // Mock State: ME = 30 power, TARGET = 10 power. Ratio = 30/40 = 0.75
        const state = mockState({
            'my_u1': { id: 'my_u1', kind: 'ARMY', createdBy: 'me', attrs: { power: 30 } },
            'their_u1': { id: 'their_u1', kind: 'ARMY', createdBy: 'them', attrs: { power: 10 } }
        });

        const option: AIOption = {
            id: 'opt1', storeId: 'RAID', targetId: 'them', associatedTagId: 'tag1',
            phase: 'CONSIDER', readiness: { total: 0, capability: 0, opportunity: 0, confidence: 0, timing: 0 },
            activeScheme: null, missingFactors: [], turnsInPrep: 0
        };
        const bias: CulturalBias = { id: 'test', name: 'test', storePreferences: {}, familyWeights: {} as any, lossTolerance: 1, symbolismPreference: 1, impulsiveness: 0, paranoia: 0 };

        const result = engine.evaluateOption(option, bias, state, 'me');
        expect(result.readiness.capability).toBeCloseTo(0.75);
    });
});
