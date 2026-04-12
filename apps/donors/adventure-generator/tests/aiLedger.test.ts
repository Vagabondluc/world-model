import { describe, it, expect, beforeEach } from 'vitest';
import { useAiLedgerStore } from '../src/stores/aiLedgerStore';
import { calculateCostFromConfig } from '../src/stores/aiLedgerStore';

describe('AI Ledger Store', () => {
    beforeEach(() => {
        useAiLedgerStore.getState().clearLedger();
    });

    it('should calculate cost correctly', () => {
        const inputChars = 4000; // ~1000 tokens
        const outputChars = 4000; // ~1000 tokens

        const cost = calculateCostFromConfig(inputChars, outputChars, { aiCostPer1kInput: 0.001, aiCostPer1kOutput: 0.002 });

        // Input: 4k chars * $0.001/1k = $0.004
        // Output: 4k chars * $0.002/1k = $0.008
        // Total: $0.012
        expect(cost).toBeCloseTo(0.012, 5);
    });

    it('should add entries and accumulate total cost', () => {
        const store = useAiLedgerStore.getState();

        const entry1 = {
            id: '1',
            timestamp: new Date(),
            input: 'test',
            output: 'test',
            model: 'gpt-4',
            provider: 'dummy' as const,
            estimatedInputTokens: 10,
            estimatedOutputTokens: 10,
            cost: 0.05
        };

        store.addEntry(entry1);
        expect(useAiLedgerStore.getState().entries).toHaveLength(1);
        expect(useAiLedgerStore.getState().totalCost).toBe(0.05);

        const entry2 = { ...entry1, id: '2', cost: 0.10 };
        store.addEntry(entry2);

        expect(useAiLedgerStore.getState().entries).toHaveLength(2);
        expect(useAiLedgerStore.getState().totalCost).toBeCloseTo(0.15);
    });
});

describe('calculateCostFromConfig (pure function)', () => {
    it('should calculate cost correctly with standard rates', () => {
        // $0.001 per 1k input chars, $0.002 per 1k output chars
        const cost = calculateCostFromConfig(1000, 1000, { aiCostPer1kInput: 0.001, aiCostPer1kOutput: 0.002 });
        expect(cost).toBe(0.003);
    });

    it('should return 0 for zero characters', () => {
        const cost = calculateCostFromConfig(0, 0, { aiCostPer1kInput: 0.001, aiCostPer1kOutput: 0.002 });
        expect(cost).toBe(0);
    });

    it('should return 0 for zero rates', () => {
        const cost = calculateCostFromConfig(1000, 1000, { aiCostPer1kInput: 0, aiCostPer1kOutput: 0 });
        expect(cost).toBe(0);
    });

    it('should handle fractional character counts', () => {
        // 500 chars at $0.002/1k = $0.001
        const cost = calculateCostFromConfig(500, 0, { aiCostPer1kInput: 0.002, aiCostPer1kOutput: 0 });
        expect(cost).toBe(0.001);
    });

    it('should avoid floating-point precision issues', () => {
        // This would fail with naive FP arithmetic: 0.1 + 0.2 !== 0.3
        const cost = calculateCostFromConfig(100, 100, { aiCostPer1kInput: 0.001, aiCostPer1kOutput: 0.002 });
        expect(cost).toBeCloseTo(0.0003, 10);
    });
});
