import { generatePerlinMap } from './perlinGenerator';
import { getBiome } from './biomeUtils';
import { generateImperialMap } from './imperialGenerator';
import { HexCoordinate } from '@/types';

describe('Map Generation', () => {
    describe('getBiome', () => {
        const theme = 'starter';
        const waterLevel = 0.2;

        it('returns ocean for low elevation', () => {
            expect(getBiome(0.1, 0.5, waterLevel, theme)).toBe('ocean');
        });

        it('returns mountain for high elevation', () => {
            expect(getBiome(0.8, 0.5, waterLevel, theme)).toBe('mountain');
        });

        it('returns desert for high elevation/low moisture', () => {
            expect(getBiome(0.4, -0.5, waterLevel, theme)).toBe('desert');
        });

        it('returns forest for high elevation/mid moisture', () => {
            expect(getBiome(0.3, 0.2, waterLevel, theme)).toBe('forest');
        });
    });

    describe('generatePerlinMap', () => {
        const settings = {
            radius: 5,
            scale: 2,
            waterLevel: 0.2,
            moistureOffset: 0,
            seed: 'test-seed',
            numRegions: 3,
            theme: 'starter'
        };

        it('generates a map with hexes', () => {
            const map = generatePerlinMap(settings);
            expect(Object.keys(map.hexBiomes).length).toBeGreaterThan(0);
        });

        it('is deterministic with same seed', () => {
            const map1 = generatePerlinMap(settings);
            const map2 = generatePerlinMap(settings);
            expect(map1.hexBiomes).toEqual(map2.hexBiomes);
        });

        it('produces different maps with different seeds', () => {
            const map1 = generatePerlinMap(settings);
            const map2 = generatePerlinMap({ ...settings, seed: 'other-seed' });
            expect(map1.hexBiomes).not.toEqual(map2.hexBiomes);
        });

        it('assigns regions', () => {
            const map = generatePerlinMap(settings);
            expect(map.regions.length).toBeGreaterThan(0);
        });
    });

    describe('generateImperialMap', () => {
        const settings4P = {
            playerCount: 4,
            tier: 'standard' as const,
            seed: 'empire'
        };

        const settings6P = {
            playerCount: 6,
            tier: 'standard' as const,
            seed: 'empire'
        };

        it('generates 4 regions for 4 players', () => {
            const map = generateImperialMap(settings4P);
            // 4 players -> 4 regions
            expect(map.regions.length).toBe(4);
        });

        it('generates 6 regions for 6 players', () => {
            const map = generateImperialMap(settings6P);
            expect(map.regions.length).toBe(6);
        });

        it('generates grass biomes by default', () => {
            const map = generateImperialMap(settings4P);
            const biomes = Object.values(map.hexBiomes);
            // Check if mostly grassland (Imperial map default)
            expect(biomes[0]).toBe('grassland');
        });
    });

    describe('Performance', () => {
        const settings = {
            radius: 20, // Large map
            scale: 2,
            waterLevel: 0.2,
            moistureOffset: 0,
            seed: 'perf-seed',
            numRegions: 5,
            theme: 'starter'
        };

        it('generates large map in acceptable time', () => {
            const start = performance.now();
            generatePerlinMap(settings);
            const end = performance.now();
            // Should be well under 1s
            expect(end - start).toBeLessThan(1000);
        });
    });
});
