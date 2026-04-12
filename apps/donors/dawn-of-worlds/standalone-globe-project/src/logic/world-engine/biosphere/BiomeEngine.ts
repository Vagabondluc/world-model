
import { BiomeType } from '../../globe/rendering/BiomeColors';

export class BiomeEngine {

    /**
     * Determine biome based on physical parameters using Whittaker-like classification
     * @param temperature Celsius (-30 to +40)
     * @param moisture 0.0 to 1.0
     * @param height -1.0 to 1.0 (0=Sea Level)
     */
    public static determineBiome(temperature: number, moisture: number, height: number): BiomeType {
        // 1. Altitude / Depth Checks
        if (height <= -0.3) return BiomeType.DEEP_OCEAN;
        if (height <= 0.0) return BiomeType.OCEAN; // Exact sea level
        if (height <= 0.08) return BiomeType.BEACH; // Low coastal lands
        if (height >= 0.7) return BiomeType.SNOW; // Highest peaks
        if (height >= 0.5) return BiomeType.MOUNTAIN; // High peaks
        if (height >= 0.3) return BiomeType.HIGHLAND; // Plateaus

        // 2. Land Biomes (Whittaker Classification)
        // Normalized Temperature handling

        // Cold Regions
        if (temperature < -10) return BiomeType.TUNDRA;
        if (temperature < 0) {
            if (moisture > 0.3) return BiomeType.TAIGA;
            return BiomeType.TUNDRA; // Cold desert
        }

        // Temperate Regions (0 to 20C)
        if (temperature < 20) {
            if (moisture > 0.8) return BiomeType.RAINFOREST; // Temperate Rainforest
            if (moisture > 0.5) return BiomeType.FOREST;     // Temperate Forest
            if (moisture > 0.2) return BiomeType.GRASSLAND;
            return BiomeType.DESERT;
        }

        // Hot Regions (> 20C)
        if (moisture > 0.8) return BiomeType.TROPICAL_FOREST;
        if (moisture > 0.4) return BiomeType.SAVANNA;
        if (moisture > 0.15) return BiomeType.GRASSLAND; // Arid grassland
        return BiomeType.DESERT;
    }

    /**
     * Calculate temperature adjustment based on altitude (Lapse Rate)
     * @param baseTemp Temperature at sea level
     * @param height Altitude (-1 to 1)
     */
    public static applyLapseRate(baseTemp: number, height: number): number {
        // Standard lapse rate: ~6.5C per 1km. 
        // Assuming height=1.0 is highest mountain (~8km? or scaled).
        // Let's assume height 0-1 maps to 0-5000m for game logic.
        // So height 1.0 = -30C shift approx.
        if (height <= 0) return baseTemp; // No cooling underwater (simplified)

        const lapseRate = 35; // degrees cooling at max height
        return baseTemp - (height * lapseRate);
    }
}
