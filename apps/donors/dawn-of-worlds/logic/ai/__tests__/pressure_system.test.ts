
import { describe, it, expect } from 'vitest';
import { TagFactory } from '../catalogs/tag_factory';
import { PressureEngine } from '../pressure';
import { GameEvent, GameState } from '../../../types';
import { SemanticTag, TagFamily } from '../types';
import { DEFAULT_PERSONALITIES } from '../profiles';
import { STORE_CATALOG } from '../catalogs/stores';

const MOCK_STATE: GameState = {
    turn: 10,
    activePlayerId: 'player_1',
    events: [],
    worldCache: new Map(),
    playerCache: {},
    revokedEventIds: new Set()
};

describe('AI Pressure System Test Suite', () => {

    // --- 1. TagFactory (Input Layer) ---
    describe('TagFactory: Event Perception', () => {
        const events: Array<{ event: Partial<GameEvent>, expectedTags: number, desc: string }> = [
            // Ignored Events
            { event: { type: 'WORLD_MODIFY', playerId: 'player_1' }, expectedTags: 0, desc: 'Ignores generic modifications' },
            { event: { type: 'COMBAT_RESOLVE', playerId: 'player_1' }, expectedTags: 0, desc: 'Ignores combat resolve (handled elsewhere)' },
            { event: { type: 'WORLD_CREATE', playerId: 'ai_agent' }, expectedTags: 0, desc: 'Ignores own creations' },

            // Significant Events
            { event: { type: 'WORLD_DELETE', playerId: 'enemy_1', payload: { kind: 'CITY' } }, expectedTags: 1, desc: 'Perceives CITY destruction as Grudge' },
            { event: { type: 'WORLD_CREATE', playerId: 'enemy_1', payload: { kind: 'MONUMENT' } }, expectedTags: 1, desc: 'Perceives MONUMENT creation as Ambition' },
            { event: { type: 'WORLD_CREATE', playerId: 'enemy_1', payload: { kind: 'CITY' } }, expectedTags: 1, desc: 'Perceives CITY creation as Ambition' }, // Assuming handleCreation handles all creates
        ];

        // Parameterized Test: Event Generation
        it.each(events)('Event Analysis: $desc', ({ event, expectedTags }) => {
            const ge = { ...event, id: 'test_evt', turn: 10 } as GameEvent;
            const tags = TagFactory.createTagsFromEvent(ge, 'ai_agent', MOCK_STATE);
            expect(tags.length).toBe(expectedTags);
            if (expectedTags > 0) {
                expect(tags[0].createdAtTurn).toBe(10);
                expect(tags[0].source).toBe(event.playerId);
            }
        });

        // Specific Value Checks
        it('Correctly calculates Grudge intensity for Destruction', () => {
            const event: GameEvent = { id: 'e1', type: 'WORLD_DELETE', playerId: 'bad_guy', turn: 5, payload: {} } as any;
            const tags = TagFactory.createTagsFromEvent(event, 'me', MOCK_STATE);
            expect(tags[0].family).toBe('GRUDGE');
            expect(tags[0].intensity).toBeGreaterThan(0);
        });
    });

    // --- 2. PressureEngine (Decay & Priority) ---
    describe('PressureEngine: Internal Logic', () => {
        const engine = new PressureEngine();

        // 2a. Decay Logic
        // Formula: New = Old * (0.9 + 0.1 * Urgency)
        const decayScenarios = [
            { urgency: 1.0, start: 1.0, expected: 1.0, desc: 'Urgency 1.0 causes no decay' },
            { urgency: 0.0, start: 1.0, expected: 0.9, desc: 'Urgency 0.0 causes 10% decay' },
            { urgency: 0.5, start: 1.0, expected: 0.95, desc: 'Urgency 0.5 causes 5% decay' },
            { urgency: 0.0, start: 0.0, expected: 0.0, desc: 'Zero intensity stays zero' },
        ];

        it.each(decayScenarios)('Decay: $desc', ({ urgency, start, expected }) => {
            const tag: SemanticTag = { intensity: start, urgency } as any;
            const result = engine.processTagDecay(tag);
            expect(result.intensity).toBeCloseTo(expected, 4);
        });

        // 2b. Prioritization Logic
        // Score = Intensity * Urgency * FamilyBias
        const priorityScenarios = [
            {
                profile: 'AGGRESSOR',
                tags: [
                    { id: 't1', family: 'GRUDGE', intensity: 1, urgency: 1 }, // Score: 1 * 1 * 1 (Bias for Grudge=1?)
                    { id: 't2', family: 'AMBITION', intensity: 1, urgency: 1 }
                ],
                winner: 't1', // Assuming Grudge has higher/equal bias, checking stability
                desc: 'Aggressor Prioritizes Grudge vs Ambition (If equal, stable sort)'
            }
            // Add more specific bias checks if we know exact weights
        ];

        // Manual Priority Check
        it('Prioritizes based on Cultural Bias (Warrior)', () => {
            const bias = DEFAULT_PERSONALITIES.AGGRESSOR.culture; // Warrior: Grudge=1, Fear=1... wait, need to check createBias values
            // Step 548: createBias('Warrior Culture'...) default weights all 1??
            // createBias line 60: familyWeights: { GRUDGE: 1, FEAR: 1, AMBITION: 1, SHAME: 1 }
            // So they are equal.
            // Let's modify a mock bias to test sorting.
            const mockBias = { ...bias, familyWeights: { GRUDGE: 2, AMBITION: 0.5 } };

            const tags: SemanticTag[] = [
                { id: 'weak_grudge', family: 'GRUDGE', intensity: 0.5, urgency: 1 } as any, // Score: 0.5*1*2 = 1.0
                { id: 'strong_ambition', family: 'AMBITION', intensity: 1, urgency: 1 } as any // Score: 1*1*0.5 = 0.5
            ];

            const sorted = engine.prioritizeTags(tags, mockBias as any);
            expect(sorted[0].id).toBe('weak_grudge');
        });

        // 2c. Store Selection (Risk Gating)
        const storeScenarios = [
            { urgency: 0.2, risk: 0.6, expectedScore: 0, desc: 'Rejects High Risk (0.6) when Low Urgency (0.2)' },
            { urgency: 0.8, risk: 0.6, shouldReject: false, desc: 'Accepts High Risk (0.6) when High Urgency (0.8)' },
            { urgency: 0.2, risk: 0.4, shouldReject: false, desc: 'Accepts Low Risk (0.4) when Low Urgency (0.2)' },
        ];

        it.each(storeScenarios)('Store Selection: $desc', ({ urgency, risk, expectedScore, shouldReject }) => {
            const tag: SemanticTag = { urgency } as any;
            const store = { risk, id: 'test_store' } as any;
            const bias = { storePreferences: {} } as any;

            const score = engine.scoreStore(store, tag, bias, MOCK_STATE);

            if (expectedScore !== undefined) {
                expect(score).toBe(expectedScore);
            } else {
                expect(score).toBeGreaterThan(0);
            }
        });
    });
});
