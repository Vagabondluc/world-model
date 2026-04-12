export interface HexCoordinate {
    q: number;
    r: number;
    s: number;
}

export type BiomeType =
    | 'grassland' | 'hill' | 'coastal' | 'urban'
    | 'forest' | 'jungle' | 'swamp'
    | 'mountain' | 'underdark' | 'volcanic' | 'arctic'
    | 'desert' | 'wasteland' | 'planar'
    | 'ocean' | 'lake' | 'underwater';

export type MapGenerationAlgorithm = 'imperial' | 'wilderness';
export type MapRenderMode = 'svg' | 'tile';
export type TileTheme = 'classic' | 'vibrant' | 'pastel' | 'sketchy';

export interface WorldSettings {
    algorithm: MapGenerationAlgorithm;
    seed: string;
    params: Record<string, any>;
}

export interface OutlineStyle {
    id: string;
    name: string;
    description: string;
    assetPath: string;
    thickness: number;
    color: string;
}

export interface MapRenderPreferences {
    mode: MapRenderMode;
    theme: TileTheme;
    outline?: OutlineStyle;
}

// Types for Era I: Age of Creation Gameplay State
export type GeographyType = 'Savanna' | 'Wetlands' | 'Hills' | 'Lake' | 'River' | 'Forest' | 'Mountains' | 'Desert' | 'Jungle' | 'Canyon' | 'Volcano';

export interface GeographyFeature {
    id: number;
    type: GeographyType | '';
    landmassIndex: number | '';
}

export interface EraCreationState {
    landmassType: string;
    featureCount: number;
    features: GeographyFeature[];
    advice: string;
    isLoading: boolean;
    error: string;
    userInputAdvice?: string;
}

export type LocationType = 'Settlement' | 'Dungeon' | 'Battlemap' | 'Special Location';

export interface Region {
    id: string;
    mapId: string;
    name: string;
    description: string;
    politicalControl: string;
    dangerLevel: 'Safe' | 'Low' | 'Moderate' | 'High' | 'Deadly';
    dominantBiome: BiomeType;
    culturalNotes: string;
    keyFeatures: string[];
    boundingBox: { minQ: number; maxQ: number; minR: number; maxR: number };
    hexes: HexCoordinate[];
    color: string;
}

export interface ManagedLocation {
    id: string;
    mapId: string;
    regionId: string;
    hexCoordinate: HexCoordinate;
    biome: BiomeType;
    type: LocationType;
    name: string;
    description: string;
    isKnownToPlayers: boolean;
    discoveryStatus: 'undiscovered' | 'discovered' | 'cleared';
    connectedLocations: string[];
    loreReferences: string[];
    customTags: string[];
    notes: string;
    createdAt: Date;
    lastModified: Date;
}
