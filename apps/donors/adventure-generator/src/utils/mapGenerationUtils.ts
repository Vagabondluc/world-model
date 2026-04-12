import { BiomeType, HexCoordinate, Region, ManagedLocation, LocationType } from '../types/location';
import { PerlinNoise } from './perlinNoise';
import { generateId } from './helpers';
import { hexDistance } from './hexUtils';
import { BIOME_CONFIG } from '../data/constants';
import { getBiome } from './map/biomeMapper';
import { THEME_ADJECTIVES, generateLocationName } from './map/namingEngine';

export type GenerationTheme = 'surface' | 'feywild' | 'shadowfell' | 'underdark' | 'elemental_fire' | 'elemental_water';

export interface GenerationSettings {
    radius: number;
    scale: number;
    waterLevel: number;
    moistureOffset: number;
    seed: string;
    numRegions: number;
    theme: GenerationTheme;
    locationDensity: number;
    settlementDensity: number; // 0.0 (Wilderness) to 2.0 (Empire)
}

interface RegionSeed {
    id: string;
    center: HexCoordinate;
    hexes: HexCoordinate[];
    biomeCounts: Record<string, number>;
}

function getLocationTypeForBiome(biome: BiomeType): LocationType {
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

function createLocation(
    hex: HexCoordinate,
    type: LocationType,
    mapId: string,
    region: Region,
    hexBiomes: Record<string, BiomeType>,
    theme: GenerationTheme,
    hierarchy?: 'Capital' | 'City' | 'Village'
): ManagedLocation {
    const biome = hexBiomes[`${hex.q},${hex.r}`] || 'grassland';
    const name = generateLocationName(type, biome, theme);
    const tags = ["Procedural", theme];
    if (hierarchy) tags.push(hierarchy);

    return {
        id: generateId(), mapId, regionId: region.id, hexCoordinate: hex, biome, type, name,
        description: `A ${hierarchy || type.toLowerCase()} located in the ${region.name}.`,
        isKnownToPlayers: false, discoveryStatus: 'undiscovered', connectedLocations: [],
        loreReferences: [], customTags: tags, notes: "",
        createdAt: new Date(), lastModified: new Date()
    };
}

export const generateProceduralMapData = (
    settings: GenerationSettings, mapId: string
): { hexBiomes: Record<string, BiomeType>; regions: Region[]; locations: ManagedLocation[] } => {
    const seedVal = stringToSeed(settings.seed);
    const noiseGen = new PerlinNoise(seedVal);
    const moistureGen = new PerlinNoise(seedVal + 12345);
    const hexBiomes: Record<string, BiomeType> = {};
    const hexes: HexCoordinate[] = [];

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

    const regionSeeds: RegionSeed[] = [];
    const numRegions = Math.max(1, settings.numRegions);
    for (let i = 0; i < numRegions; i++) {
        regionSeeds.push({ id: generateId(), center: hexes[Math.floor(Math.random() * hexes.length)], hexes: [], biomeCounts: {} });
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
        const dangerLevel = (Math.floor(Math.random() * 4) + 1) as Region['dangerLevel'];
        return {
            id: seed.id, mapId, name: `The ${themeAdj[Math.floor(Math.random() * themeAdj.length)]} ${BIOME_CONFIG[dominantBiome]?.name || 'Lands'}`,
            description: `A region of ${dominantBiome} terrain.`, politicalControl: "Unclaimed",
            dangerLevel, dominantBiome, culturalNotes: "", keyFeatures: [],
            boundingBox: { minQ: Math.min(...seed.hexes.map(h => h.q)), maxQ: Math.max(...seed.hexes.map(h => h.q)), minR: Math.min(...seed.hexes.map(h => h.r)), maxR: Math.max(...seed.hexes.map(h => h.r)) },
            hexes: seed.hexes, color: BIOME_CONFIG[dominantBiome]?.color + '66'
        };
    });

    const locations: ManagedLocation[] = [];
    regions.forEach(region => {
        if (!region.hexes) return;

        // 1. Hierarchical Settlements
        if (settings.settlementDensity > 0) {
            const hierarchy = [
                { type: 'Capital' as const, count: 1, prob: 0.8 * settings.settlementDensity },
                { type: 'City' as const, count: 3, prob: 0.6 * settings.settlementDensity },
                { type: 'Village' as const, count: 5, prob: 0.5 * settings.settlementDensity },
            ];

            hierarchy.forEach(h => {
                for (let i = 0; i < h.count; i++) {
                    if (Math.random() < h.prob) {
                        const hex = region.hexes![Math.floor(Math.random() * region.hexes!.length)];
                        if (!locations.some(l => l.hexCoordinate.q === hex.q && l.hexCoordinate.r === hex.r)) {
                            locations.push(createLocation(hex, 'Settlement', mapId, region, hexBiomes, settings.theme, h.type));
                        }
                    }
                }
            });
        }

        // 2. Generic Locations (Dungeons, etc.)
        if (region.dominantBiome === 'ocean' && settings.locationDensity < 1.5) return;
        const baseCount = settings.locationDensity;
        let count = Math.floor(baseCount) + (Math.random() < (baseCount % 1) ? 1 : 0);

        for (let i = 0; i < count; i++) {
            const hex = region.hexes[Math.floor(Math.random() * region.hexes.length)];
            if (!locations.some(l => l.hexCoordinate.q === hex.q && l.hexCoordinate.r === hex.r)) {
                locations.push(createLocation(hex, getLocationTypeForBiome(hexBiomes[`${hex.q},${hex.r}`] || region.dominantBiome), mapId, region, hexBiomes, settings.theme));
            }
        }
    });

    return { hexBiomes, regions, locations };
};

function stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return hash;
}
