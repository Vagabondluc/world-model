/**
 * Biome Mapper
 * Derives biomes from Elevation, Temperature, and Moisture data.
 * Uses Whittaker-style biome classification.
 */

import { BiomeType, HexCell } from '../overlay/hexGrid';
import { SphereNoiseGenerator } from './noiseGenerator';

interface GenerationConfig {
    seed: number;
    seaLevel: number; // 0.35
    mountainLevel: number; // 0.85
}

export class BiomeMapper {
    private heightGen: SphereNoiseGenerator;
    private tempGen: SphereNoiseGenerator;
    private moistureGen: SphereNoiseGenerator;
    private config: GenerationConfig;

    constructor(seed: number = Date.now(), config: Partial<GenerationConfig> = {}) {
        this.heightGen = new SphereNoiseGenerator(seed);
        this.tempGen = new SphereNoiseGenerator(seed + 100);
        this.moistureGen = new SphereNoiseGenerator(seed + 200);

        this.config = {
            seed,
            seaLevel: 0.35, // Slightly higher sea level for islands
            mountainLevel: 0.85,
            ...config
        };
    }

    /**
     * generating procedural biome data for a cell
     */
    generateBiome(cell: HexCell): void {
        const height = this.heightGen.getNoise(cell.center, { seed: this.config.seed, scale: 1.5, octaves: 4, persistence: 0.5, lacunarity: 2.0 });
        const tempNoise = this.tempGen.getNoise(cell.center, { seed: this.config.seed + 100, scale: 1.0, octaves: 2, persistence: 0.5, lacunarity: 2.0 });
        const moisture = this.moistureGen.getNoise(cell.center, { seed: this.config.seed + 200, scale: 1.2, octaves: 2, persistence: 0.5, lacunarity: 2.0 });

        // Adjust temperature based on latitude (y) and height
        const latitude = Math.abs(cell.center.y);
        let temperature = tempNoise * 0.3 + (1.0 - latitude) * 0.7; // Equator is hotter
        temperature -= height * 0.2; // Higher is colder

        // Store data
        cell.biomeData = { height, temperature, moisture };

        // Determine Biome
        cell.biome = this.determineBiome(height, temperature, moisture, latitude);
    }

    private determineBiome(h: number, t: number, m: number, lat: number): BiomeType {
        // === Water Biomes ===
        if (h < this.config.seaLevel - 0.1) {
            return BiomeType.DEEP_OCEAN;
        }

        if (h < this.config.seaLevel) {
            return BiomeType.OCEAN;
        }

        // === Coastal Zone ===
        // Beach: very close to sea level
        if (h < this.config.seaLevel + 0.02) {
            return BiomeType.BEACH;
        }

        // Coastal: transition zone
        if (h < this.config.seaLevel + 0.05) {
            return BiomeType.COASTAL;
        }

        // === High Altitude Biomes ===
        if (h > this.config.mountainLevel) {
            // Rare volcanic peaks
            if (h > 0.95 && Math.random() > 0.8) {
                return BiomeType.VOLCANIC;
            }
            // Snow caps on highest peaks
            if (h > 0.92 || t < 0.1) {
                return BiomeType.SNOW;
            }
            return BiomeType.MOUNTAIN;
        }

        // Highland: elevated plateaus
        if (h > 0.6) {
            // High enough to be cold
            if (t < 0.3) {
                return BiomeType.TUNDRA;
            }
            return BiomeType.HIGHLAND;
        }

        // === Whittaker Classification for Land Biomes ===

        // === Cold Biomes (t < 0.3) ===
        if (t < 0.2) {
            return BiomeType.TUNDRA;
        }

        if (t < 0.3) {
            // Cold zone: moisture determines taiga vs tundra
            if (m < 0.2) return BiomeType.TUNDRA; // Cold desert
            return BiomeType.TAIGA; // Boreal forest
        }

        // === Temperate Biomes (0.3 <= t < 0.7) ===
        if (t < 0.7) {
            if (m < 0.2) return BiomeType.DESERT; // Temperate desert
            if (m < 0.4) return BiomeType.GRASSLAND;
            if (m < 0.7) return BiomeType.FOREST;
            if (m < 0.85) return BiomeType.RAINFOREST; // Temperate rainforest
            return BiomeType.SWAMP; // Very wet
        }

        // === Tropical Biomes (t >= 0.7) ===
        if (m < 0.2) return BiomeType.DESERT; // Hot desert
        if (m < 0.5) return BiomeType.SAVANNA;
        return BiomeType.TROPICAL_FOREST; // Tropical rainforest (jungle)
    }
}
