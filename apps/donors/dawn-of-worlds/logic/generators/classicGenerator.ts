import { WorldGenerator, GeneratedWorldData, GenerationConfig, HexData, registerGenerator } from '../worldGenerators';
import { hexToKey } from '../geometry';

/**
 * Classic flat hex grid generator
 * Fast, simple Perlin noise-based generation
 */
const classicGenerator: WorldGenerator = {
    id: 'classic',
    name: 'Classic Grid',
    description: 'Fast hex-based world generation with simple noise patterns. Perfect for quick games.',
    icon: 'grid_on',

    generate: async (config: GenerationConfig): Promise<GeneratedWorldData> => {
        const { seed, width, height } = config;
        const hexes = new Map<string, HexData>();
        const biomeMap = new Map<string, number>();
        const heightMap = new Map<string, number>();

        // Simple deterministic noise (placeholder - replace with existing perlin logic)
        const noise = (q: number, r: number, seed: number): number => {
            const x = q * 0.1;
            const y = r * 0.1;
            const s = seed * 0.001;
            return (Math.sin(x + s) * Math.cos(y + s) + 1) / 2;
        };

        // Generate hex grid
        for (let r = 0; r < height; r++) {
            for (let q = 0; q < width; q++) {
                const heightValue = noise(q, r, seed);
                const key = hexToKey({ q, r });

                // Simple biome assignment based on height
                let biome: HexData['biome'];
                if (heightValue < 0.3) biome = 'WATER';
                else if (heightValue < 0.4) biome = 'GRASSLAND';
                else if (heightValue < 0.6) biome = 'FOREST';
                else if (heightValue < 0.75) biome = 'MOUNTAIN';
                else biome = 'TUNDRA';

                const hexData: HexData = {
                    q,
                    r,
                    biome,
                    height: heightValue
                };

                hexes.set(key, hexData);
                biomeMap.set(key, biome);
                heightMap.set(key, heightValue);
            }
        }

        return {
            hexes,
            biomeMap,
            heightMap,
            metadata: {
                seed,
                generatedAt: Date.now(),
                generatorId: 'classic',
                generatorVersion: '1.0.0',
                width,
                height
            }
        };
    }
};

// Auto-register
registerGenerator(classicGenerator);

export default classicGenerator;
