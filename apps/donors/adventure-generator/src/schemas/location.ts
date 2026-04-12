import { z } from "zod";
import { BiomeTypeEnum, DateSchema, DiscoveryStatusEnum, IdSchema, LocationTypeEnum } from "./common";

export { LocationTypeEnum };
export const LayerTypeEnum = z.enum(['surface', 'underdark', 'feywild', 'shadowfell', 'elemental', 'custom']);
export type LayerType = z.infer<typeof LayerTypeEnum>;

// --- Hex Coordinates ---
export const HexCoordinateSchema = z.object({
    q: z.number().int(),
    r: z.number().int(),
    s: z.number().int().optional(),
});

export type HexCoordinate = z.infer<typeof HexCoordinateSchema>;

// --- Location Details Sub-schemas ---
export const DungeonRoomSchema = z.object({
    title: z.string(),
    description: z.string(),
});

export const DungeonDetailsSchema = z.object({
    rooms: z.array(DungeonRoomSchema),
    imageUrl: z.string().optional(),
});

export const BattlefieldSchema = z.object({
    title: z.string(),
    description: z.string(),
});

export const BattlemapDetailsSchema = z.object({
    battlefields: z.array(BattlefieldSchema),
    imageUrl: z.string().optional(),
});

export const SettlementDetailsSchema = z.object({
    overview: z.string(),
    geography: z.string(),
    society: z.string(),
    economy: z.string(),
    governance: z.string(),
    culture: z.string(),
    individuals: z.string(),
    challenges: z.string(),
    adventureHooks: z.string(),
    imageUrl: z.string().optional(),
});

export const SpecialLocationDetailsSchema = z.object({
    details: z.string(),
    imageUrl: z.string().optional(),
});

// Union of all possible location details
export const LocationDetailsSchema = z.union([
    DungeonDetailsSchema,
    BattlemapDetailsSchema,
    SettlementDetailsSchema,
    SpecialLocationDetailsSchema
]);

export type LocationDetails = z.infer<typeof LocationDetailsSchema>;

// --- Base Location (AI Generated) ---
export const LocationSchema = z.object({
    id: IdSchema,
    name: z.string(),
    description: z.string(),
    type: LocationTypeEnum,
    details: LocationDetailsSchema.optional(),
});

export type Location = z.infer<typeof LocationSchema>;

// --- Managed Location (App State) ---
export const ManagedLocationSchema = LocationSchema.extend({
    mapId: z.string(),
    hexCoordinate: HexCoordinateSchema,
    biome: BiomeTypeEnum,
    regionId: z.string(),
    isKnownToPlayers: z.boolean(),
    discoveryStatus: DiscoveryStatusEnum,
    connectedLocations: z.array(z.string()),
    loreReferences: z.array(z.string()),
    customTags: z.array(z.string()),
    notes: z.string(),
    createdAt: DateSchema,
    lastModified: DateSchema,
    worldName: z.string().optional(),
    associatedMapId: z.string().optional(), // Link to a sub-map (e.g., city map, dungeon level)
});

export type ManagedLocation = z.infer<typeof ManagedLocationSchema>;

// --- Regions ---
export const BoundingBoxSchema = z.object({
    minQ: z.number().int(),
    maxQ: z.number().int(),
    minR: z.number().int(),
    maxR: z.number().int(),
});

export const RegionSchema = z.object({
    id: IdSchema,
    mapId: z.string(),
    name: z.string(),
    description: z.string(),
    politicalControl: z.string(),
    dangerLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    dominantBiome: BiomeTypeEnum,
    culturalNotes: z.string(),
    keyFeatures: z.array(z.string()),
    boundingBox: BoundingBoxSchema,
    hexes: z.array(HexCoordinateSchema).optional(), // New: Support for arbitrary shapes
    color: z.string(),
});

export type Region = z.infer<typeof RegionSchema>;

// --- World Map ---
export const WorldMapSchema = z.object({
    id: IdSchema,
    name: z.string().min(1, "Map name cannot be empty"),
    description: z.string(),
    imageUrl: z.string().optional(),
    createdAt: DateSchema,
    lastModified: DateSchema,
    layerOrder: z.array(z.string()).optional(),
    radius: z.number().int().default(15), // New: Track extent for caching
});

export type WorldMap = z.infer<typeof WorldMapSchema>;

export const LayerThemeSchema = z.object({
    mode: LayerTypeEnum,
    biomePalette: z.enum(['standard', 'subterranean', 'psychedelic', 'necrotic']),
    backgroundColor: z.string(),
    patternSet: z.string(),
});

export const MapLayerSchema = z.object({
    id: IdSchema,
    mapId: z.string(),
    name: z.string(),
    type: LayerTypeEnum,
    visible: z.boolean(),
    opacity: z.number(),
    data: z.object({
        hexBiomes: z.record(BiomeTypeEnum),
        revealedHexes: z.record(z.boolean()),
        regions: z.array(z.string()),
        locations: z.array(z.string()),
    }),
    theme: LayerThemeSchema,
});

export const ViewSettingsSchema = z.object({
    showHexGrid: z.boolean(),
    showBiomeColors: z.boolean(),
    showRegionBorders: z.boolean(),
    showOnlyDiscovered: z.boolean(),
    enableFog: z.boolean(),
    fogOpacity: z.number(),
    zoomLevel: z.number(),
    centerCoordinate: HexCoordinateSchema,
    backgroundImage: z.object({
        url: z.string(),
        scale: z.enum(['fit', 'cover', 'stretch', 'none']),
        opacity: z.number(),
    }).optional(),
    ghostModeEnabled: z.boolean().optional(),
});

export const LocationStateExportSchema = z.object({
    maps: z.record(WorldMapSchema),
    activeMapId: z.string().nullable(),
    locations: z.record(ManagedLocationSchema),
    regions: z.record(RegionSchema),
    layers: z.record(MapLayerSchema),
    viewSettings: z.record(ViewSettingsSchema).optional().default({}),
});

export const BiomeEncounterDataSchema = z.object({
    creatureIds: z.array(z.string()),
});

export const BiomeDataSchema = z.record(BiomeEncounterDataSchema);
