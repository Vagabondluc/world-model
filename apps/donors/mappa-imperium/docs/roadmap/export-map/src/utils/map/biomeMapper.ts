import { BiomeType } from '../../types/location';
import { GenerationTheme } from '../mapGenerationUtils';

/**
 * Determines the biome for a given elevation and moisture coordinate.
 */
export function getBiome(elevation: number, moisture: number, waterLevel: number, theme: GenerationTheme): BiomeType {
    // 1. Underdark Logic (Caves)
    if (theme === 'underdark') {
        if (elevation > 0.55) return 'mountain'; // Solid Rock/Pillars
        if (elevation < waterLevel) return 'underwater'; // Sunless Sea
        if (moisture > 0.3) return 'swamp'; // Fungal Forest
        if (moisture < -0.3) return 'volcanic'; // Magma vents
        return 'underdark'; // Standard cavern floor
    }

    // 2. Shadowfell Logic (Desolation)
    if (theme === 'shadowfell') {
        if (elevation < waterLevel) return 'ocean';
        if (elevation > 0.6) return 'mountain';
        if (moisture > 0.4) return 'swamp';
        return 'wasteland';
    }

    // 3. Feywild Logic (Vibrant/Extreme)
    if (theme === 'feywild') {
        if (elevation < waterLevel) return 'ocean';
        if (elevation > 0.6) return 'mountain';
        if (moisture > 0.1) return 'jungle';
        if (moisture > -0.2) return 'forest';
        return 'planar';
    }

    // 4. Elemental Fire Logic
    if (theme === 'elemental_fire') {
        if (elevation > 0.5) return 'volcanic';
        if (elevation < -0.2) return 'volcanic';
        if (moisture > 0) return 'desert';
        return 'wasteland';
    }

    // 5. Standard Surface Logic
    if (elevation < waterLevel) return 'ocean';

    // Reduced coastal band
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
