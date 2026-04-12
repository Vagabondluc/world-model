
import { BiomeEngine } from '../BiomeEngine';
import { BiomeType } from '../../../globe/rendering/BiomeColors';

describe('BiomeEngine', () => {
    describe('determineBiome', () => {
        // Elevation Checks
        it('should return ocean biomes for low height', () => {
            expect(BiomeEngine.determineBiome(20, 0.5, -0.5)).toBe(BiomeType.DEEP_OCEAN);
            expect(BiomeEngine.determineBiome(20, 0.5, -0.1)).toBe(BiomeType.OCEAN);
        });

        it('should return beach for coastal height', () => {
            expect(BiomeEngine.determineBiome(20, 0.5, 0.05)).toBe(BiomeType.BEACH);
        });

        it('should return mountain/highland for high height', () => {
            expect(BiomeEngine.determineBiome(10, 0.5, 0.8)).toBe(BiomeType.SNOW);
            expect(BiomeEngine.determineBiome(10, 0.5, 0.6)).toBe(BiomeType.MOUNTAIN);
            expect(BiomeEngine.determineBiome(10, 0.5, 0.35)).toBe(BiomeType.HIGHLAND);
        });

        // Cold Region
        it('should return tundra for very cold temps', () => {
            expect(BiomeEngine.determineBiome(-15, 0.5, 0.1)).toBe(BiomeType.TUNDRA);
        });

        it('should differentiate taiga and tundra in cold', () => {
            expect(BiomeEngine.determineBiome(-5, 0.8, 0.1)).toBe(BiomeType.TAIGA);
            expect(BiomeEngine.determineBiome(-5, 0.1, 0.1)).toBe(BiomeType.TUNDRA);
        });

        // Temperate Region
        it('should return temperate biomes', () => {
            expect(BiomeEngine.determineBiome(15, 0.9, 0.1)).toBe(BiomeType.RAINFOREST);
            expect(BiomeEngine.determineBiome(15, 0.6, 0.1)).toBe(BiomeType.FOREST);
            expect(BiomeEngine.determineBiome(15, 0.3, 0.1)).toBe(BiomeType.GRASSLAND);
            expect(BiomeEngine.determineBiome(15, 0.1, 0.1)).toBe(BiomeType.DESERT);
        });

        // Hot Region
        it('should return tropical biomes', () => {
            expect(BiomeEngine.determineBiome(30, 0.9, 0.1)).toBe(BiomeType.TROPICAL_FOREST);
            expect(BiomeEngine.determineBiome(30, 0.5, 0.1)).toBe(BiomeType.SAVANNA);
            expect(BiomeEngine.determineBiome(30, 0.2, 0.1)).toBe(BiomeType.GRASSLAND);
            expect(BiomeEngine.determineBiome(30, 0.0, 0.1)).toBe(BiomeType.DESERT);
        });
    });

    describe('applyLapseRate', () => {
        it('should cool temperature based on height', () => {
            const base = 20;
            const h1 = 0.5; // ~Halfway uptime
            const val = BiomeEngine.applyLapseRate(base, h1);
            expect(val).toBeLessThan(base);
        });

        it('should not cool deep underwater (simplified)', () => {
            expect(BiomeEngine.applyLapseRate(20, -0.5)).toBe(20);
        });
    });
});
