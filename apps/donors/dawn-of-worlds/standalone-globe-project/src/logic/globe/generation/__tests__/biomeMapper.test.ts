import { BiomeMapper } from '../biomeMapper';
import { BiomeType } from '../../rendering/BiomeColors';

describe('BiomeMapper', () => {
    let mapper: BiomeMapper;

    beforeEach(() => {
        mapper = new BiomeMapper(12345);
    });

    describe('Initialization', () => {
        it('should create BiomeMapper instance', () => {
            expect(mapper).toBeInstanceOf(BiomeMapper);
        });

        it('should accept custom config', () => {
            const customMapper = new BiomeMapper(12345, { seaLevel: 0.3, mountainLevel: 0.9 });
            expect(customMapper).toBeInstanceOf(BiomeMapper);
        });
    });

    describe('Biome Generation', () => {
        it('should generate biome for a cell', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: 1 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            mapper.generateBiome(cell);
            expect(cell.biome).toBeDefined();
            expect(Object.values(BiomeType)).toContain(cell.biome);
        });

        it('should assign valid biome type', () => {
            const cell = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: 1 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            mapper.generateBiome(cell);
            expect(Object.values(BiomeType)).toContain(cell.biome);
        });
    });

    describe('Seed Consistency', () => {
        it('should produce identical biomes with same seed', () => {
            const mapper1 = new BiomeMapper(12345);
            const mapper2 = new BiomeMapper(12345);

            const cell1 = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: 1 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            const cell2 = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: 1 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            mapper1.generateBiome(cell1);
            mapper2.generateBiome(cell2);

            expect(cell1.biome).toBe(cell2.biome);
        });

        it('should produce different biomes with different seeds', () => {
            const mapper1 = new BiomeMapper(12345);
            const mapper2 = new BiomeMapper(54321);

            const cell1 = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: 1 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            const cell2 = {
                id: 'test-cell',
                center: { x: 0, y: 0, z: 1 },
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN
            };

            mapper1.generateBiome(cell1);
            mapper2.generateBiome(cell2);

            // Biomes may or may not be different, but at least one property should differ
            const hasDifference = cell1.biome !== cell2.biome;
            expect(hasDifference).toBe(true);
        });
    });
});
