
import { BiomeMapper } from '../../generation/biomeMapper';
import { BiomeType, HexCell } from '../../overlay/hexGrid';
import { getBiomeColor, normalizeBiomeId, DEFAULT_CELL_COLOR } from '../BiomeColors';
import { BiomeEngine } from '../../../world-engine/biosphere/BiomeEngine';

describe('Grey Hex Investigation', () => {

    test('BiomeMapper produces valid colors for all generated biomes', () => {
        const mapper = new BiomeMapper(12345);
        const cell: HexCell = {
            id: 'test',
            center: { x: 0, y: 0, z: 0 },
            vertices: [],
            neighbors: [],
            isPentagon: false,
            biome: BiomeType.OCEAN
        };

        // Monte Carlo simulation with random inputs to cover edge cases
        for (let i = 0; i < 10000; i++) {
            // Mock random inputs if needed, but BiomeMapper uses noise based on position.
            // We'll vary position.
            cell.center = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2
            };

            // Generate biome
            mapper.generateBiome(cell);

            // Check color
            const normalized = normalizeBiomeId(cell.biome);
            const color = getBiomeColor(normalized);

            if (color === DEFAULT_CELL_COLOR) {
                console.error(`Found GREY hex! Position: ${JSON.stringify(cell.center)}`);
                console.error(`Biome: '${cell.biome}', Normalized: '${normalized}'`);
            }

            expect(color).not.toBe(DEFAULT_CELL_COLOR);
            expect(cell.biome).toBeDefined();
        }
    });

    test('BiomeEngine produces valid colors for all input ranges', () => {
        // exhaustive step test
        const steps = 20;

        for (let h = -1.0; h <= 1.0; h += 2 / steps) {
            for (let t = -50; t <= 50; t += 100 / steps) {
                for (let m = 0; m <= 1.0; m += 1 / steps) {
                    const biome = BiomeEngine.determineBiome(t, m, h);
                    const normalized = normalizeBiomeId(biome);
                    const color = getBiomeColor(normalized);

                    if (color === DEFAULT_CELL_COLOR) {
                        console.error(`Found GREY hex in BiomeEngine! H:${h}, T:${t}, M:${m}`);
                        console.error(`Biome: '${biome}', Normalized: '${normalized}'`);
                    }

                    expect(color).not.toBe(DEFAULT_CELL_COLOR);
                }
            }
        }
    });

    test('All Legacy Biomes map to valid colors', () => {
        const legacy = ['JUNGLE', 'jungle', 'ARCTIC', 'arctic', 'tundra', 'TUNDRA']; // Add known variations
        legacy.forEach(l => {
            const normalized = normalizeBiomeId(l);
            const color = getBiomeColor(normalized);
            if (color === DEFAULT_CELL_COLOR) {
                console.error(`Legacy '${l}' maps to GREY via '${normalized}'`);
            }
            expect(color).not.toBe(DEFAULT_CELL_COLOR);
        });
    });

    // Check for "unknown" string
    test('Unknown string maps to default color', () => {
        expect(getBiomeColor('unknown_biome_string')).toBe(DEFAULT_CELL_COLOR);
    });
});
