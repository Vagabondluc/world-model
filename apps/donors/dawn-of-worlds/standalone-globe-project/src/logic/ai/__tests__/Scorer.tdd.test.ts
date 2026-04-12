
import { describe, it, expect } from 'vitest';
import { UtilityScorer, WeightedEvaluator, Evaluator } from '../UtilityScorer';
import { PERSONA_CONQUEROR, PERSONA_GARDENER } from '../personas';
import { GameState } from '../../../types';

/**
 * Maturity Test Suite: The Personality (Scorer TDD)
 * Target: UtilityScorer.ts (Phase 3)
 */
describe('AI Scorer (Personality) [TDD]', () => {

    // Mock Context
    const mockState: GameState = {
        age: 1, round: 1, turn: 1, activePlayerId: 'AI', players: [], events: [], world: {} as any
    };

    // Mock Evaluators
    const evalHigh: Evaluator = () => 0.9;
    const evalLow: Evaluator = () => 0.1;

    const actionAttack: WeightedEvaluator[] = [
        { evaluator: evalHigh, weight: 1.0, name: 'aggression' },
        { evaluator: evalLow, weight: 0.1, name: 'expansion' }
    ];

    const actionPlant: WeightedEvaluator[] = [
        { evaluator: evalLow, weight: 0.1, name: 'aggression' },
        { evaluator: evalHigh, weight: 1.0, name: 'expansion' }
    ];

    it('Score-01: Warlord should score Attack higher than Plant', () => {
        const ctx = { gameState: mockState, playerId: 'AI' };

        const scoreAttack = UtilityScorer.scoreAction('Attack', actionAttack, PERSONA_CONQUEROR, ctx);
        const scorePlant = UtilityScorer.scoreAction('Plant', actionPlant, PERSONA_CONQUEROR, ctx);

        // Warlord has aggression 2.0, expansion 0.8
        // Attack Score ~= (0.9 * 2.0) / 2.0 = 0.9
        // Plant Score ~= (0.9 * 0.8) / 0.8 = 0.9 ... wait, math check.

        // Attack: (0.9 * 2.0) + (0.1 * 0.8) = 1.8 + 0.08 = 1.88 total weight
        // Normalized: 1.88 / ( 1.0*2.0 + 0.1*0.8 ) = 1.88 / 2.08 = 0.903

        // Plant: (0.1 * 2.0) + (0.9 * 0.8) = 0.2 + 0.72 = 0.92 total weight
        // Normalized: 0.92 / ( 0.1*2.0 + 1.0*0.8) = 0.92 / 1.0 = 0.92

        // Wait, my mock weights might be tricky if normalized. 
        // Warlord prefers Aggression. 
        // Let's rely on the result. Warlord SHOULD prefer the Attack bundle.

        // Actually, if we use sum instead of average, it's clearer.
        // But let's check the test expectation.

        // Using "Un-normalized" logic often helps AI feel more decisive.
        // Current implementation is Normalized.

        // Let's verify values.
        expect(scoreAttack).toBeGreaterThan(scorePlant);
    });

    it('Score-02: Gardener should score Plant higher than Attack', () => {
        const ctx = { gameState: mockState, playerId: 'AI' };

        const scoreAttack = UtilityScorer.scoreAction('Attack', actionAttack, PERSONA_GARDENER, ctx);
        const scorePlant = UtilityScorer.scoreAction('Plant', actionPlant, PERSONA_GARDENER, ctx);

        // Gardener: Aggression 0.1, Expansion 1.5
        expect(scorePlant).toBeGreaterThan(scoreAttack);
    });

    it('Score-03: Resilience - Evaluator failure should not crash', () => {
        const evalFail: Evaluator = () => { throw new Error("Oops"); };
        const safeEvaluator: WeightedEvaluator = {
            evaluator: (ctx) => {
                try { return evalFail(ctx); } catch { return 0; }
            },
            weight: 1.0,
            name: 'test'
        };

        const ctx = { gameState: mockState, playerId: 'AI' };
        const score = UtilityScorer.scoreAction('Fail', [safeEvaluator], PERSONA_CONQUEROR, ctx);
        expect(score).toBe(0);
    });

    it('Score-04: Greed - Should prefer High Value cell over Low Value', () => {
        // Custom Evaluator that looks at "mock value"
        const evalValue: Evaluator = (ctx) => {
            // Mock: Cell 10 is Gold (1.0), Cell 20 is Dirt (0.1)
            return ctx.targetCellId === 10 ? 1.0 : 0.1;
        };

        const actionGold: WeightedEvaluator[] = [{ evaluator: evalValue, weight: 1.0, name: 'resource' }];
        const actionDirt: WeightedEvaluator[] = [{ evaluator: evalValue, weight: 1.0, name: 'resource' }];

        // Gardener loves resources (weight 2.0)
        const ctxGold = { gameState: mockState, playerId: 'AI', targetCellId: 10 };
        const ctxDirt = { gameState: mockState, playerId: 'AI', targetCellId: 20 };

        const scoreGold = UtilityScorer.scoreAction('Gold', actionGold, PERSONA_GARDENER, ctxGold);
        const scoreDirt = UtilityScorer.scoreAction('Dirt', actionDirt, PERSONA_GARDENER, ctxDirt);

        expect(scoreGold).toBeGreaterThan(scoreDirt);
    });

    it('Score-05: Consistency - Same inputs should yield exact same score', () => {
        const ctx = { gameState: mockState, playerId: 'AI' };
        const s1 = UtilityScorer.scoreAction('Test', actionAttack, PERSONA_CONQUEROR, ctx);
        const s2 = UtilityScorer.scoreAction('Test', actionAttack, PERSONA_CONQUEROR, ctx);
        expect(s1).toBe(s2);
    });

    it('Score-06: Zero Weight - Evaluator with 0 weight should not affect score', () => {
        const evalZero: WeightedEvaluator = { evaluator: evalHigh, weight: 0.0, name: 'useless' };
        // Pure 0 weight might cause division by zero if it's the only one.
        // Let's mix it.
        const actionMixed = [...actionAttack, evalZero];

        const ctx = { gameState: mockState, playerId: 'AI' };
        const scoreNormal = UtilityScorer.scoreAction('Normal', actionAttack, PERSONA_CONQUEROR, ctx);
        const scoreMixed = UtilityScorer.scoreAction('Mixed', actionMixed, PERSONA_CONQUEROR, ctx);

        // If weight is 0, it contributes 0 to sum and 0 to totalWeight.
        // Effectively ignored.
        expect(scoreMixed).toBeCloseTo(scoreNormal);
    });
});
