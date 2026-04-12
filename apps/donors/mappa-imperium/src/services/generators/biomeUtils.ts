import { BiomeType, LocationType } from '@/types';

// --- Biome Logic ---
export function getBiome(elevation: number, moisture: number, waterLevel: number, theme: string): BiomeType {
    if (theme === 'underdark') {
        if (elevation > 0.55) return 'mountain';
        if (elevation < waterLevel) return 'underwater';
        if (moisture > 0.3) return 'swamp';
        if (moisture < -0.3) return 'volcanic';
        return 'underdark';
    }

    if (elevation < waterLevel) return 'ocean';
    if (elevation < waterLevel + 0.05) return 'coastal';
    if (elevation > 0.65) return 'mountain';
    if (elevation > 0.45) return 'hill';

    if (moisture > 0.5) {
        return elevation > 0.2 ? 'jungle' : 'swamp';
    }
    if (moisture > 0.1) return 'forest';
    if (moisture > -0.4) return 'grassland';
    return 'desert';
}

export function stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return hash;
}

export function getLocationTypeForBiome(biome: BiomeType): LocationType {
    const rand = Math.random();
    switch (biome) {
        case 'grassland': case 'hill': case 'coastal': case 'urban':
            if (rand < 0.6) return 'Settlement';
            if (rand < 0.8) return 'Battlemap';
            return 'Special Location';
        case 'forest': case 'jungle': case 'swamp':
            if (rand < 0.4) return 'Special Location';
            if (rand < 0.7) return 'Dungeon';
            if (rand < 0.85) return 'Settlement';
            return 'Battlemap';
        case 'mountain': case 'underdark': case 'volcanic': case 'arctic':
            if (rand < 0.5) return 'Dungeon';
            if (rand < 0.7) return 'Battlemap';
            if (rand < 0.9) return 'Special Location';
            return 'Settlement';
        case 'desert': case 'wasteland': case 'planar':
            if (rand < 0.5) return 'Special Location';
            if (rand < 0.8) return 'Dungeon';
            return 'Battlemap';
        case 'ocean': case 'lake': case 'underwater':
            if (rand < 0.6) return 'Dungeon';
            return 'Special Location';
        default:
            return 'Special Location';
    }
}
