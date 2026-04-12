
import { z } from "zod";
import {
    HexCoordinateSchema,
    LocationTypeEnum,
    DungeonRoomSchema,
    DungeonDetailsSchema,
    BattlefieldSchema,
    BattlemapDetailsSchema,
    SettlementDetailsSchema,
    SpecialLocationDetailsSchema,
    LocationDetailsSchema,
    LocationSchema,
    ManagedLocationSchema,
    RegionSchema,
    WorldMapSchema
} from '../schemas/location'; // Direct import
import { BiomeTypeEnum } from '../schemas/common'; // Direct import

// --- Domain Models (Inferred from Schemas) ---

export type HexCoordinate = z.infer<typeof HexCoordinateSchema>;
export type BiomeType = z.infer<typeof BiomeTypeEnum>;
export type LocationType = z.infer<typeof LocationTypeEnum>;

export type DungeonRoom = z.infer<typeof DungeonRoomSchema>;
export type DungeonDetails = z.infer<typeof DungeonDetailsSchema>;
export type Battlefield = z.infer<typeof BattlefieldSchema>;
export type BattlemapDetails = z.infer<typeof BattlemapDetailsSchema>;
export type SettlementDetails = z.infer<typeof SettlementDetailsSchema>;
export type SpecialLocationDetails = z.infer<typeof SpecialLocationDetailsSchema>;
export type LocationDetails = z.infer<typeof LocationDetailsSchema>;

export type Location = z.infer<typeof LocationSchema>;
export type ManagedLocation = z.infer<typeof ManagedLocationSchema>;
export type Region = z.infer<typeof RegionSchema>;
export type WorldMap = z.infer<typeof WorldMapSchema>;

// --- UI & Application State Types (No Schema Required) ---

export interface BiomeInfo {
    name: string;
    color: string; // Hex color for map display
    description: string;
    commonFeatures: string[];
    movementCost: number; // Multiplier for travel difficulty
}

export interface BiomeEncounterData {
    creatureIds: string[];
}

export type BiomeData = Record<string, BiomeEncounterData>;

export type LayerType = 'surface' | 'underdark' | 'feywild' | 'shadowfell' | 'elemental' | 'custom';

export interface LayerTheme {
    mode: LayerType;
    biomePalette: 'standard' | 'subterranean' | 'psychedelic' | 'necrotic';
    backgroundColor: string;
    patternSet: string; // ID of the pattern generator set
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

// Interaction Modes for Location Manager
export type InteractionMode =
    | 'inspect'        // Default: Select/View hexes and entities
    | 'biome_paint'    // Click to apply selected biome
    | 'region_draft'   // Click to toggle hex selection for new region
    | 'location_place' // Next click opens LocationForm at hex
    | 'fog_paint';     // Reveal/Hide hexes

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

export interface LocationStateExport {
    maps: Record<string, WorldMap>;
    activeMapId: string | null;
    locations: Record<string, ManagedLocation>;
    regions: Record<string, Region>;
    layers: Record<string, MapLayer>;
    viewSettings: Record<string, ViewSettings>;
}
