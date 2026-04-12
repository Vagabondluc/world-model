import { describe, it, expect, afterEach } from 'vitest';
import { performance } from 'node:perf_hooks';
import { tokenizeText } from '../utils/textLinker';
import { processOutlineData } from '../utils/outlineHelpers';

const runBenchmark = <T>(label: string, fn: () => T): { result: T; durationMs: number } => {
    const start = performance.now();
    const result = fn();
    const durationMs = performance.now() - start;
    console.info(`[perf] ${label}: ${durationMs.toFixed(2)}ms`);
    return { result, durationMs };
};

describe('performance benchmarks', () => {
    // Use smaller test data sizes to reduce memory pressure during mutation testing
    // Mutation testing runs these tests hundreds of times, so even moderate data can accumulate
    afterEach(() => {
        // Force garbage collection hint by clearing large objects
        if (global.gc) {
            global.gc();
        }
    });

    it('tokenizeText scales with large entity lists', () => {
        // Reduced from 750 and 200 to 150 and 50 to reduce memory footprint during mutation testing
        const entities = Array.from({ length: 150 }, (_, i) => ({
            id: `id-${i}`,
            title: `Entity ${i}`,
        }));
        const text = Array.from({ length: 50 }, (_, i) => `This mentions Entity ${i} in a sentence.`).join(' ');

        const { result, durationMs } = runBenchmark('tokenizeText (150 entities, 50 mentions)', () =>
            tokenizeText(text, entities)
        );

        expect(result.length).toBeGreaterThan(0);
        expect(durationMs).toBeLessThan(2000);
    });

    it('processOutlineData handles large outlines within budget', () => {
        // Reduced sizes: 80→16, 40→8, 120→24, 160→32 to reduce memory footprint during mutation testing 
        const outlineData = {
            locations: Array.from({ length: 16 }, (_, i) => ({
                name: `Location ${i}`,
                description: 'Test location',
                type: 'Settlement',
            })),
            factions: Array.from({ length: 8 }, (_, i) => ({
                name: `Faction ${i}`,
                goal: 'Test goal',
                category: 'Government & Authority',
            })),
            npcs: Array.from({ length: 24 }, (_, i) => ({
                name: `NPC ${i}`,
                description: 'Test NPC',
                type: 'Minor',
                faction: `Faction ${i % 8}`,
            })),
            scenes: Array.from({ length: 32 }, (_, i) => ({
                title: `Scene ${i}`,
                type: 'Exploration',
                challenge: 'Test challenge',
                locationName: `Location ${i % 16}`,
            })),
        };

        const { result, durationMs } = runBenchmark('processOutlineData (32 scenes)', () =>
            processOutlineData(outlineData)
        );

        expect(result.newLocations.length).toBe(16);
        expect(result.newFactions.length).toBe(8);
        expect(result.newNpcs.length).toBe(24);
        expect(result.newScenes.length).toBe(32);
        expect(durationMs).toBeLessThan(2000);
    });
});
