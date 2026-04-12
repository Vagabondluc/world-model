import { HexCoordinate, BiomeType, Region, ManagedLocation, LocationType } from '@mi/types';
import { PerlinNoise } from './perlinNoise';
import { hexDistance } from './hexUtils';
import { BIOME_CONFIG } from '../../data/biomeData';
import { THEME_ADJECTIVES, generateLocationName } from './namingEngine';
import { getBiome, stringToSeed, getLocationTypeForBiome } from './biomeUtils';

export interface PerlinGenerationSettings {
    radius: number;
    scale: number;
    waterLevel: number;
    moistureOffset: number;
    seed: string;
    numRegions: number;
    theme: string;
    locationDensity?: number;
    settlementDensity?: number;
}

function createLocation(
    hex: HexCoordinate,
    type: LocationType,
    mapId: string,
    region: Region,
    hexBiomes: Record<string, BiomeType>,
    theme: string,
    hierarchy?: string
): ManagedLocation {
    const biome = hexBiomes[`${hex.q},${hex.r}`] || 'grassland';
    const name = generateLocationName(type, biome, theme);
    const tags = ["Procedural", theme];
    if (hierarchy) tags.push(hierarchy);

    return {
        id: crypto.randomUUID(), mapId, regionId: region.id, hexCoordinate: hex, biome, type, name,
        description: `A ${hierarchy || type.toLowerCase()} located in the ${region.name}.`,
        isKnownToPlayers: false, discoveryStatus: 'undiscovered', connectedLocations: [],
        loreReferences: [], customTags: tags, notes: "",
        createdAt: new Date(), lastModified: new Date()
    };
}

// --- Main Generator ---
export function generatePerlinMap(settings: PerlinGenerationSettings) {
    const seedVal = stringToSeed(settings.seed);
    const noiseGen = new PerlinNoise(seedVal);
    const moistureGen = new PerlinNoise(seedVal + 12345);
    const hexBiomes: Record<string, BiomeType> = {};
    const hexes: HexCoordinate[] = [];

    // Defaults if not provided (for compatibility)
    const locationDensity = settings.locationDensity ?? 0.5;
    const settlementDensity = settings.settlementDensity ?? 0.5;
    const mapId = crypto.randomUUID();

    const primaryScale = settings.scale * 1.5;
    const secondaryScale = settings.scale * 0.5;
    const moistScale = settings.scale * 1.2;

    for (let q = -settings.radius; q <= settings.radius; q++) {
        const r1 = Math.max(-settings.radius, -q - settings.radius);
        const r2 = Math.min(settings.radius, -q + settings.radius);
        for (let r = r1; r <= r2; r++) {
            const hex = { q, r, s: -q - r };
            const x = (q * 3 / 2);
            const y = (Math.sqrt(3) * (r + q / 2));
            const nx = x / primaryScale;
            const ny = y / primaryScale;
            const dx = x / secondaryScale;
            const dy = y / secondaryScale;

            const elevation = noiseGen.noise(nx, ny) * 0.8 + noiseGen.noise(dx + 100, dy + 100) * 0.2;
            const mx = x / moistScale;
            const my = y / moistScale;
            let moisture = moistureGen.noise(mx + 500, my + 500) + settings.moistureOffset;

            const biome = getBiome(elevation, moisture, settings.waterLevel, settings.theme);
            hexBiomes[`${q},${r}`] = biome;
            hexes.push(hex);
        }
    }

    // --- Region Generation ---
    interface RegionSeed {
        id: string;
        center: HexCoordinate;
        hexes: HexCoordinate[];
        biomeCounts: Record<string, number>;
    }

    const regionSeeds: RegionSeed[] = [];
    const numRegions = Math.max(1, settings.numRegions);
    for (let i = 0; i < numRegions; i++) {
        regionSeeds.push({ id: crypto.randomUUID(), center: hexes[Math.floor(Math.random() * hexes.length)], hexes: [], biomeCounts: {} });
    }

    hexes.forEach(hex => {
        let minDist = Infinity;
        let closestSeedIndex = 0;
        regionSeeds.forEach((seed, idx) => {
            const dist = hexDistance(hex, seed.center);
            if (dist < minDist) { minDist = dist; closestSeedIndex = idx; }
        });
        const seed = regionSeeds[closestSeedIndex];
        seed.hexes.push(hex);
        const biome = hexBiomes[`${hex.q},${hex.r}`];
        seed.biomeCounts[biome] = (seed.biomeCounts[biome] || 0) + 1;
    });

    const regions: Region[] = regionSeeds.map(seed => {
        let dominantBiome: BiomeType = 'grassland';
        let maxCount = 0;
        Object.entries(seed.biomeCounts).forEach(([b, count]) => { if (count > maxCount) { maxCount = count; dominantBiome = b as BiomeType; } });
        const themeAdj = THEME_ADJECTIVES[settings.theme] || THEME_ADJECTIVES.surface;
        return {
            id: seed.id, mapId, name: `The ${themeAdj[Math.floor(Math.random() * themeAdj.length)]} ${BIOME_CONFIG[dominantBiome]?.name || 'Lands'}`,
            description: `A region of ${dominantBiome} terrain.`, politicalControl: "Unclaimed",
            dangerLevel: "Moderate", dominantBiome, culturalNotes: "", keyFeatures: [],
            boundingBox: { minQ: Math.min(...seed.hexes.map(h => h.q)), maxQ: Math.max(...seed.hexes.map(h => h.q)), minR: Math.min(...seed.hexes.map(h => h.r)), maxR: Math.max(...seed.hexes.map(h => h.r)) },
            hexes: seed.hexes, color: BIOME_CONFIG[dominantBiome]?.color + '66'
        };
    });

    // --- Location Generation ---
    const locations: ManagedLocation[] = [];
    regions.forEach(region => {
        if (!region.hexes || region.hexes.length === 0) return;

        // 1. Hierarchical Settlements
        if (settlementDensity > 0) {
            const hierarchy = [
                { type: 'Settlement' as const, subtype: 'Capital', count: 1, prob: 0.8 * settlementDensity },
                { type: 'Settlement' as const, subtype: 'City', count: Math.floor(3 * settlementDensity), prob: 0.6 * settlementDensity },
                { type: 'Settlement' as const, subtype: 'Village', count: Math.floor(5 * settlementDensity), prob: 0.5 * settlementDensity },
            ];

            hierarchy.forEach(h => {
                for (let i = 0; i < h.count; i++) {
                    if (Math.random() < h.prob) {
                        const hex = region.hexes![Math.floor(Math.random() * region.hexes!.length)];
                        // Avoid overlap
                        if (!locations.some(l => l.hexCoordinate.q === hex.q && l.hexCoordinate.r === hex.r)) {
                            locations.push(createLocation(hex, h.type, mapId, region, hexBiomes, settings.theme, h.subtype));
                        }
                    }
                }
            });
        }

        // 2. Generic Locations (Dungeons, etc.)
        if (region.dominantBiome === 'ocean' && locationDensity < 1.5) return;
        const baseCount = locationDensity * 5; // Scaling factor
        let count = Math.floor(baseCount) + (Math.random() < (baseCount % 1) ? 1 : 0);

        for (let i = 0; i < count; i++) {
            const hex = region.hexes[Math.floor(Math.random() * region.hexes.length)];
            if (!locations.some(l => l.hexCoordinate.q === hex.q && l.hexCoordinate.r === hex.r)) {
                locations.push(createLocation(hex, getLocationTypeForBiome(hexBiomes[`${hex.q},${hex.r}`] || region.dominantBiome), mapId, region, hexBiomes, settings.theme));
            }
        }
    });

    return { hexBiomes, regions, locations };
}
