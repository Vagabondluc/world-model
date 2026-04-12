
import { BiomeEngine } from '../BiomeEngine';
import { BiomeType } from '../../../globe/rendering/BiomeColors';

describe('BiomeEngine Matrix', () => {

    describe('Altitude Zones', () => {
        it('should classify deep ocean', () => {
            expect(BiomeEngine.determineBiome(20, 0.5, -0.5)).toBe(BiomeType.DEEP_OCEAN);
        });
        it('should classify ocean/coastal', () => {
            // height <= 0.0 = ocean, height <= 0.08 = beach
            expect(BiomeEngine.determineBiome(20, 0.5, 0.0)).toBe(BiomeType.OCEAN);
            expect(BiomeEngine.determineBiome(20, 0.5, 0.05)).toBe(BiomeType.BEACH);
        });
        it('should classify high mountains', () => {
            // height >= 0.7 = snow (highest peaks)
            expect(BiomeEngine.determineBiome(-5, 0.5, 0.7)).toBe(BiomeType.SNOW);
        });
        it('should classify highlands', () => {
            // height >= 0.5 = mountain, height >= 0.3 = highland
            expect(BiomeEngine.determineBiome(15, 0.5, 0.5)).toBe(BiomeType.MOUNTAIN);
        });
    });

    describe('Land Biomes (Standard Height 0.2)', () => {
        // Cold < -10
        it('should classify Frozen Tundra (<-10C)', () => {
            expect(BiomeEngine.determineBiome(-15, 0.0, 0.2)).toBe(BiomeType.TUNDRA); // Dry
            expect(BiomeEngine.determineBiome(-15, 1.0, 0.2)).toBe(BiomeType.TUNDRA); // Wet
        });

        // Cold < 0
        it('should classify Taiga (-5C, Wet)', () => {
            expect(BiomeEngine.determineBiome(-5, 0.4, 0.2)).toBe(BiomeType.TAIGA);
        });
        it('should classify Cold Desert/Tundra (-5C, Dry)', () => {
            expect(BiomeEngine.determineBiome(-5, 0.2, 0.2)).toBe(BiomeType.TUNDRA);
        });

        // Temperate < 20C
        it('should classify Temperate Rainforest (15C, Very Wet)', () => {
            // Moisture > 0.8
            expect(BiomeEngine.determineBiome(15, 0.9, 0.2)).toBe(BiomeType.RAINFOREST);
        });
        it('should classify Temperate Forest (15C, Wet)', () => {
            // Moisture > 0.5
            expect(BiomeEngine.determineBiome(15, 0.6, 0.2)).toBe(BiomeType.FOREST);
        });
        it('should classify Grassland (15C, Moderate)', () => {
            // Moisture > 0.2
            expect(BiomeEngine.determineBiome(15, 0.3, 0.2)).toBe(BiomeType.GRASSLAND);
        });
        it('should classify Desert (15C, Dry)', () => {
            // Moisture <= 0.2
            expect(BiomeEngine.determineBiome(15, 0.1, 0.2)).toBe(BiomeType.DESERT);
        });

        // Hot >= 20C
        it('should classify Tropical Forest (25C, Wet)', () => {
            // Moisture > 0.8
            expect(BiomeEngine.determineBiome(25, 0.9, 0.2)).toBe(BiomeType.TROPICAL_FOREST);
        });
        it('should classify Savanna (25C, Moderate)', () => {
            // Moisture > 0.4
            expect(BiomeEngine.determineBiome(25, 0.5, 0.2)).toBe(BiomeType.SAVANNA);
        });
        it('should classify Arid Grassland (25C, Dry-ish)', () => {
            // Moisture > 0.15
            expect(BiomeEngine.determineBiome(25, 0.2, 0.2)).toBe(BiomeType.GRASSLAND);
        });
        it('should classify Hot Desert (25C, Very Dry)', () => {
            // Moisture <= 0.15
            expect(BiomeEngine.determineBiome(25, 0.1, 0.2)).toBe(BiomeType.DESERT);
        });
    });

    describe('Lapse Rate', () => {
        it('should reduce temperature with height', () => {
            const base = 20;
            const h1 = 0.5; // High
            const h2 = 1.0; // Peak

            // verify applyLapseRate logic
            const t1 = BiomeEngine.applyLapseRate(base, h1);
            const t2 = BiomeEngine.applyLapseRate(base, h2);

            expect(t1).toBeLessThan(base);
            expect(t2).toBeLessThan(t1);
        });

        it('should not cool underwater (height <= 0)', () => {
            expect(BiomeEngine.applyLapseRate(20, -0.5)).toBe(20);
        });
    });
});
