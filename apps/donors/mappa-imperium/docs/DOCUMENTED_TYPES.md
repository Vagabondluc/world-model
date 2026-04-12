# Inferred Type Documentation

This document consolidates the TypeScript types and Zod schemas inferred from the documentation roadmap, specifically from `docs/roadmap/export-map/src`.

## Enums and Constants

### Biome Types
```typescript
export type BiomeType = 
    | 'arctic' | 'coastal' | 'desert' | 'forest' | 'grassland'
    | 'hill' | 'jungle' | 'mountain' | 'swamp' | 'underdark'
    | 'underwater' | 'urban' | 'planar' | 'wasteland' | 'volcanic'
    | 'ocean' | 'lake';
```

### Location Types
```typescript
export type LocationType = 'Battlemap' | 'Dungeon' | 'Settlement' | 'Special Location';
```

### Discovery Status
```typescript
export type DiscoveryStatus = 'undiscovered' | 'rumored' | 'explored' | 'mapped';
```

### NPC Types
```typescript
export type NpcType = 'Minor' | 'Major' | 'Antagonist' | 'Creature';
```

### Faction Categories
```typescript
export type FactionCategory = 
    | "Government & Authority" | "Religious Organizations" | "Criminal Enterprises"
    | "Economic & Trade" | "Arcane & Scholarly" | "Adventuring & Mercenary"
    | "Racial & Cultural" | "Ideological & Revolutionary" | "Secret & Shadow"
    | "Planar & Extraplanar" | "Environmental & Territorial";
```

### Scene Types
```typescript
export type SceneType = 'Exploration' | 'Combat' | 'NPC Interaction' | 'Dungeon';
```

## Core Domain Models

### Hex Coordinate
```typescript
export interface HexCoordinate {
    q: number;
    r: number;
    s?: number;
}
```

### Location Details
#### Dungeon
```typescript
export interface DungeonRoom {
    title: string;
    description: string;
}

export interface DungeonDetails {
    rooms: DungeonRoom[];
    imageUrl?: string;
}
```

#### Battlefield
```typescript
export interface Battlefield {
    title: string;
    description: string;
}

export interface BattlemapDetails {
    battlefields: Battlefield[];
    imageUrl?: string;
}
```

#### Settlement
```typescript
export interface SettlementDetails {
    overview: string;
    geography: string;
    society: string;
    economy: string;
    governance: string;
    culture: string;
    individuals: string;
    challenges: string;
    adventureHooks: string;
    imageUrl?: string;
}
```

#### Special Location
```typescript
export interface SpecialLocationDetails {
    details: string;
    imageUrl?: string;
}
```

#### Union Type
```typescript
export type LocationDetails = DungeonDetails | BattlemapDetails | SettlementDetails | SpecialLocationDetails;
```

### Base Location (AI Generated)
```typescript
export interface Location {
    id: string;
    name: string;
    description: string;
    type: LocationType;
    details?: LocationDetails;
}
```

### Managed Location (App State)
```typescript
export interface ManagedLocation extends Location {
    mapId: string;
    hexCoordinate: HexCoordinate;
    biome: BiomeType;
    regionId: string;
    isKnownToPlayers: boolean;
    discoveryStatus: DiscoveryStatus;
    connectedLocations: string[];
    loreReferences: string[];
    customTags: string[];
    notes: string;
    createdAt: Date;
    lastModified: Date;
    worldName?: string;
    associatedMapId?: string;
}
```

### Region
```typescript
export interface BoundingBox {
    minQ: number;
    maxQ: number;
    minR: number;
    maxR: number;
}

export interface Region {
    id: string;
    mapId: string;
    name: string;
    description: string;
    politicalControl: string;
    dangerLevel: 1 | 2 | 3 | 4 | 5;
    dominantBiome: BiomeType;
    culturalNotes: string;
    keyFeatures: string[];
    boundingBox: BoundingBox;
    hexes?: HexCoordinate[];
    color: string;
}
```

### World Map
```typescript
export interface WorldMap {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: Date;
    lastModified: Date;
    layerOrder?: string[];
    radius: number;
}
```

### Origin Context
```typescript
export interface OriginContext {
    type: 'generator' | 'manual' | 'import';
    sourceId?: string;
    generatorStep?: string;
    historyStateId?: string;
}
```

## UI & Application State

### Biome Info
```typescript
export interface BiomeInfo {
    name: string;
    color: string;
    description: string;
    commonFeatures: string[];
    movementCost: number;
}
```

### Biome Encounter Data
```typescript
export interface BiomeEncounterData {
    creatureIds: string[];
}

export type BiomeData = Record<string, BiomeEncounterData>;
```

### Map Layers
```typescript
export type LayerType = 'surface' | 'underdark' | 'feywild' | 'shadowfell' | 'elemental' | 'custom';

export interface LayerTheme {
    mode: LayerType;
    biomePalette: 'standard' | 'subterranean' | 'psychedelic' | 'necrotic';
    backgroundColor: string;
    patternSet: string;
}

export interface MapLayer {
    id: string;
    mapId: string;
    name: string;
    type: LayerType;
    visible: boolean;
    opacity: number;
    data: {
        hexBiomes: Record<string, BiomeType>;
        revealedHexes: Record<string, boolean>;
        regions: string[];
        locations: string[];
    };
    theme: LayerTheme;
}
```

### View Settings & Interaction
```typescript
export type InteractionMode =
    | 'inspect'
    | 'biome_paint'
    | 'region_draft'
    | 'location_place'
    | 'fog_paint';

export interface ViewSettings {
    showHexGrid: boolean;
    showBiomeColors: boolean;
    showRegionBorders: boolean;
    showOnlyDiscovered: boolean;
    enableFog: boolean;
    fogOpacity: number;
    zoomLevel: number;
    centerCoordinate: HexCoordinate;
    backgroundImage?: { url: string; scale: 'fit' | 'cover' | 'stretch' | 'none'; opacity: number; };
    ghostModeEnabled?: boolean;
}
```

### State Export
```typescript
export interface LocationStateExport {
    maps: Record<string, WorldMap>;
    activeMapId: string | null;
    locations: Record<string, ManagedLocation>;
    regions: Record<string, Region>;
    layers: Record<string, MapLayer>;
    viewSettings: Record<string, ViewSettings>;
}
```

### Player Progress (Inferred)
```typescript
export interface PlayerProgress {
    playerNumber: number;
    name: string;
    eras: Record<number, {
        completed: number;
        total: number;
        progress: number;
    }>;
    totalGamePercentage: number;
}
```
