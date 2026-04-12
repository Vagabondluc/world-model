import Dexie, { type EntityTable } from 'dexie';
import { CampaignConfiguration } from '../types/campaign';
import { ManagedLocation, Region, BiomeData, BiomeType, MapLayer, WorldMap } from '../types/location';
import { SavedMonster } from '../types/npc';
import { LoreEntry, CompendiumEntry } from '../types/compendium';

// Extension of CampaignConfiguration to include a primary key for IndexedDB and biome data
export interface CampaignConfigEntity extends CampaignConfiguration {
    id: number; // We will typically use ID=1 for the singleton active configuration
    biomeData?: BiomeData;
}

// Separate entity for large map data blobs - DEPRECATED
export interface MapStateEntity {
    id: number;
}

// Database definition matching DEC-003 spec
export const db = new Dexie('DndGeneratorDB') as Dexie & {
    campaign: EntityTable<CampaignConfigEntity, 'id'>;
    locations: EntityTable<ManagedLocation, 'id'>;
    regions: EntityTable<Region, 'id'>;
    bestiary: EntityTable<SavedMonster, 'id'>;
    lore: EntityTable<LoreEntry, 'id'>;
    mapState: EntityTable<MapStateEntity, 'id'>;
    layers: EntityTable<MapLayer, 'id'>;
    maps: EntityTable<WorldMap, 'id'>;
    compendium: EntityTable<CompendiumEntry, 'id'>;
};

// V1 Schema Definition
// Note: Adding new tables to an existing version is okay in Dexie if they don't conflict with existing data.
// If you need a destructive change, bump version(1) to version(2).
db.version(1).stores({
    campaign: 'id', // Singleton config
    locations: 'id, regionId, type, discoveryStatus, worldName, mapId', // Indexes for filtering
    regions: 'id, mapId',
    bestiary: 'id, source', // Added source
    lore: 'id, type, *tags', // Multi-entry index on tags for efficient searching
    mapState: 'id', // Deprecated, kept for schema stability
    layers: 'id, mapId',
    maps: 'id',
    compendium: 'id, category, source, *tags', // Added source
});