import { Hex } from '../types';

export type BiomeType = 'WATER' | 'GRASSLAND' | 'FOREST' | 'DESERT' | 'MOUNTAIN' | 'TUNDRA' | 'SAVANNA' | 'TAIGA';

export interface HexData {
    q: number;
    r: number;
    biome: BiomeType;
    height: number;
}

export interface WorldMetadata {
    seed: number;
    generatedAt: number;
    generatorId: string;
    generatorVersion: string;
    width: number;
    height: number;
}

export interface GeneratedWorldData {
    hexes: Map<string, HexData>;
    biomeMap: Map<string, BiomeType>;
    heightMap: Map<string, number>;
    metadata: WorldMetadata;
}

export interface GenerationConfig {
    seed: number;
    width: number;
    height: number;
    // Optional advanced params for globe mode
    subdivisions?: number;
    noiseOctaves?: number;
    noisePersistence?: number;
    lacunarity?: number;
}

export interface WorldGenerator {
    id: string;
    name: string;
    description: string;
    icon: string;
    experimental?: boolean;
    generate: (config: GenerationConfig) => Promise<GeneratedWorldData>;
}

export const GENERATORS: Record<string, WorldGenerator> = {};

export const registerGenerator = (generator: WorldGenerator) => {
    GENERATORS[generator.id] = generator;
};

export const getGenerator = (id: string): WorldGenerator | undefined => {
    return GENERATORS[id];
};

export const getAvailableGenerators = (): WorldGenerator[] => {
    return Object.values(GENERATORS);
};
