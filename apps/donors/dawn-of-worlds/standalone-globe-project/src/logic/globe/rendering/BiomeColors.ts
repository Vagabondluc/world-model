/**
 * Unified Biome System - Whittaker-style classifications
 * Consolidates BiomeType enum with color definitions and metadata
 */

/**
 * Unified Biome Type Enum
 * All biome identifiers in lowercase for consistent lookup
 */
export enum BiomeType {
    // Water
    DEEP_OCEAN = 'deep_ocean',
    OCEAN = 'ocean',
    LAKE = 'lake',

    // Coastal
    BEACH = 'beach',
    COASTAL = 'coastal',

    // Whittaker Biomes - Cold
    TUNDRA = 'tundra',
    SNOW = 'snow',
    TAIGA = 'taiga',

    // Whittaker Biomes - Temperate
    GRASSLAND = 'grassland',
    FOREST = 'forest',
    RAINFOREST = 'rainforest', // Temperate rainforest
    DESERT = 'desert',

    // Whittaker Biomes - Tropical
    SAVANNA = 'savanna',
    TROPICAL_FOREST = 'tropical_forest', // Tropical rainforest (also known as jungle)

    // Elevation
    MOUNTAIN = 'mountain',
    HIGHLAND = 'highland',

    // Special
    SWAMP = 'swamp',
    HILLS = 'hills',
    VOLCANIC = 'volcanic',
    URBAN = 'urban',

    // Legacy alias for backward compatibility
    JUNGLE = 'tropical_forest', // Jungle is an alias for tropical_forest
    ARCTIC = 'tundra', // Arctic is an alias for tundra
}

/**
 * Biome metadata interface
 */
export interface BiomeMetadata {
    id: BiomeType;
    name: string;
    color: number;
    category: 'water' | 'coastal' | 'cold' | 'temperate' | 'tropical' | 'elevation' | 'special';
    description: string;
}

/**
 * Complete biome registry with metadata
 */
export const BIOME_REGISTRY: Record<BiomeType, BiomeMetadata> = {
    // Water
    [BiomeType.DEEP_OCEAN]: {
        id: BiomeType.DEEP_OCEAN,
        name: 'Deep Ocean',
        color: 0x1a237e, // Dark Blue
        category: 'water',
        description: 'Deep ocean waters below continental shelf'
    },
    [BiomeType.OCEAN]: {
        id: BiomeType.OCEAN,
        name: 'Ocean',
        color: 0x0277bd, // Blue
        category: 'water',
        description: 'Open ocean waters'
    },
    [BiomeType.LAKE]: {
        id: BiomeType.LAKE,
        name: 'Lake',
        color: 0x0288d1, // Lighter blue
        category: 'water',
        description: 'Inland body of water'
    },

    // Coastal
    [BiomeType.BEACH]: {
        id: BiomeType.BEACH,
        name: 'Beach',
        color: 0xffd54f, // Sand
        category: 'coastal',
        description: 'Sandy shoreline'
    },
    [BiomeType.COASTAL]: {
        id: BiomeType.COASTAL,
        name: 'Coastal',
        color: 0xc5e1a5, // Light greenish-yellow
        category: 'coastal',
        description: 'Transition zone between land and sea'
    },

    // Whittaker Biomes - Cold
    [BiomeType.TUNDRA]: {
        id: BiomeType.TUNDRA,
        name: 'Tundra',
        color: 0xe0f7fa, // Icy Blue
        category: 'cold',
        description: 'Treeless plains with permafrost'
    },
    [BiomeType.SNOW]: {
        id: BiomeType.SNOW,
        name: 'Snow',
        color: 0xffffff, // White
        category: 'cold',
        description: 'Permanent snow and ice (mountain peaks)'
    },
    [BiomeType.TAIGA]: {
        id: BiomeType.TAIGA,
        name: 'Taiga',
        color: 0x1b5e20, // Dark green
        category: 'cold',
        description: 'Boreal coniferous forest'
    },

    // Whittaker Biomes - Temperate
    [BiomeType.GRASSLAND]: {
        id: BiomeType.GRASSLAND,
        name: 'Grassland',
        color: 0x81c784, // Light Green
        category: 'temperate',
        description: 'Open grassy plains'
    },
    [BiomeType.FOREST]: {
        id: BiomeType.FOREST,
        name: 'Forest',
        color: 0x2e7d32, // Green
        category: 'temperate',
        description: 'Temperate deciduous forest'
    },
    [BiomeType.RAINFOREST]: {
        id: BiomeType.RAINFOREST,
        name: 'Rainforest',
        color: 0x004d40, // Deep Green
        category: 'temperate',
        description: 'Temperate rainforest'
    },
    [BiomeType.DESERT]: {
        id: BiomeType.DESERT,
        name: 'Desert',
        color: 0xffe082, // Sand/Yellow
        category: 'temperate',
        description: 'Arid sandy or rocky terrain'
    },

    // Whittaker Biomes - Tropical
    [BiomeType.SAVANNA]: {
        id: BiomeType.SAVANNA,
        name: 'Savanna',
        color: 0xcddc39, // Yellow-Green
        category: 'tropical',
        description: 'Tropical grassland with scattered trees'
    },
    [BiomeType.TROPICAL_FOREST]: {
        id: BiomeType.TROPICAL_FOREST,
        name: 'Tropical Forest',
        color: 0x00695c, // Teal Green
        category: 'tropical',
        description: 'Tropical rainforest (also known as jungle)'
    },

    // Elevation
    [BiomeType.MOUNTAIN]: {
        id: BiomeType.MOUNTAIN,
        name: 'Mountain',
        color: 0x4e342e, // Dark Brown (Rock)
        category: 'elevation',
        description: 'High mountain peaks'
    },
    [BiomeType.HIGHLAND]: {
        id: BiomeType.HIGHLAND,
        name: 'Highland',
        color: 0x795548, // Brown
        category: 'elevation',
        description: 'Elevated plateau'
    },

    // Special
    [BiomeType.SWAMP]: {
        id: BiomeType.SWAMP,
        name: 'Swamp',
        color: 0x4a6fa5, // Muted blue-green
        category: 'special',
        description: 'Wetland with standing water'
    },
    [BiomeType.HILLS]: {
        id: BiomeType.HILLS,
        name: 'Hills',
        color: 0x8d6e63, // Light brown
        category: 'special',
        description: 'Rolling hills'
    },
    [BiomeType.VOLCANIC]: {
        id: BiomeType.VOLCANIC,
        name: 'Volcanic',
        color: 0x212121, // Dark gray/black
        category: 'special',
        description: 'Active volcanic terrain'
    },
    [BiomeType.URBAN]: {
        id: BiomeType.URBAN,
        name: 'Urban',
        color: 0x616161, // Gray
        category: 'special',
        description: 'Developed settlement area'
    },
};

/**
 * Legacy color map for backward compatibility
 * Maps biome string IDs to hex colors
 */
export const BIOME_COLORS: Record<string, number> = Object.fromEntries(
    Object.entries(BIOME_REGISTRY).map(([key, value]) => [key, value.color])
);

/**
 * Default color for unrecognized biomes
 */
export const DEFAULT_CELL_COLOR = 0xcccccc;


/**
 * Get biome metadata by ID
 */
export function getBiomeMetadata(biomeId: string): BiomeMetadata | undefined {
    return BIOME_REGISTRY[biomeId as BiomeType];
}

/**
 * Get biome color by ID
 */
export function getBiomeColor(biomeId: string): number {
    return BIOME_REGISTRY[biomeId as BiomeType]?.color ?? DEFAULT_CELL_COLOR;
}

/**
 * Get all biomes by category
 */
export function getBiomesByCategory(category: BiomeMetadata['category']): BiomeMetadata[] {
    return Object.values(BIOME_REGISTRY).filter(b => b.category === category);
}

/**
 * Legacy alias mapping
 * Maps old biome names to new unified names
 */
export const LEGACY_BIOME_ALIASES: Record<string, BiomeType> = {
    'JUNGLE': BiomeType.TROPICAL_FOREST,
    'jungle': BiomeType.TROPICAL_FOREST,
    'ARCTIC': BiomeType.TUNDRA,
    'arctic': BiomeType.TUNDRA,
};

/**
 * Normalize legacy biome ID to unified biome type
 */
export function normalizeBiomeId(biomeId: string): BiomeType {
    // 1. Check direct match or legacy aliases
    if (LEGACY_BIOME_ALIASES[biomeId]) {
        return LEGACY_BIOME_ALIASES[biomeId];
    }

    // 2. Check if it's already a valid BiomeType value (exact match)
    // Note: iterating Object.values on enum can be expensive in hot loops, 
    // but lookup in registry is faster validation?
    // Actually, simply checking if it exists in BIOME_REGISTRY is the ultimate test.
    if (BIOME_REGISTRY[biomeId as BiomeType]) {
        return biomeId as BiomeType;
    }

    // 3. Try lowercase (handle "TUNDRA" -> "tundra")
    const lower = biomeId?.toLowerCase();
    if (lower && BIOME_REGISTRY[lower as BiomeType]) {
        return lower as BiomeType;
    }

    // 4. Default to OCEAN if completely unrecognized (avoids grey hexes)
    // Console warn to help debugging (maybe throttle this in future if noisy)
    if (biomeId && biomeId !== 'undefined' && biomeId !== 'null') {
        console.warn(`[BiomeColors] Unknown biome ID: '${biomeId}'. Defaulting to OCEAN.`);
    }
    return BiomeType.OCEAN;
}
