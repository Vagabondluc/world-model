import { describe, it, expect } from 'vitest';
import { GroundingService } from '../services/GroundingService';
import { HexCoordinate, MapLayer, Region, ManagedLocation, BiomeType } from '../types/location';

describe('GroundingService', () => {
    const service = new GroundingService();

    // Test Data Helpers
    const createHex = (q: number, r: number): HexCoordinate => ({ q, r });
    const createLayer = (hexBiomes: Record<string, BiomeType> = {}, locations: string[] = [], regions: string[] = []): MapLayer => ({
        id: 'layer-1',
        mapId: 'map-1',
        name: 'Surface',
        type: 'surface',
        visible: true,
        opacity: 1,
        data: {
            hexBiomes,
            revealedHexes: {},
            regions,
            locations
        },
        theme: {
            mode: 'surface',
            biomePalette: 'standard',
            backgroundColor: '#ffffff',
            patternSet: 'default'
        }
    });

    const createRegion = (id: string, hexes: HexCoordinate[], dominantBiome: BiomeType = 'forest', keyFeatures: string[] = []): Region => {
        const qs = hexes.map(h => h.q);
        const rs = hexes.map(h => h.r);
        const minQ = qs.length ? Math.min(...qs) : 0;
        const maxQ = qs.length ? Math.max(...qs) : 0;
        const minR = rs.length ? Math.min(...rs) : 0;
        const maxR = rs.length ? Math.max(...rs) : 0;

        return ({
            id,
            mapId: 'map-1',
            name: `Region ${id}`,
            description: 'Test region',
            politicalControl: 'None',
            dangerLevel: 1,
            dominantBiome,
            culturalNotes: 'None',
            keyFeatures,
            boundingBox: { minQ, maxQ, minR, maxR },
            hexes,
            color: '#ff0000'
        });
    };

    const createLocation = (id: string, hex: HexCoordinate, type: string, customTags: string[] = [], discoveryStatus: string = 'explored'): ManagedLocation => ({
        id,
        name: `Location ${id}`,
        description: 'Test location',
        type: type as any,
        mapId: 'map-1',
        hexCoordinate: hex,
        biome: 'forest' as any,
        regionId: 'region-1',
        isKnownToPlayers: true,
        discoveryStatus: discoveryStatus as any,
        connectedLocations: [],
        loreReferences: [],
        customTags,
        notes: '',
        createdAt: new Date(),
        lastModified: new Date()
    });

    describe('getEffectiveBiome', () => {
        it('should return null for empty hex with no overrides or regions', () => {
            const hex = createHex(0, 0);
            const layer = createLayer();
            const regions: Record<string, Region> = {};

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBeNull();
        });

        it('should return direct hex override when present', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({ '0,0': 'desert' });
            const regions: Record<string, Region> = {};

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBe('desert');
        });

        it('should return region dominant biome when hex is in region', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({}, [], ['region-1']);
            const regions: Record<string, Region> = {
                'region-1': createRegion('region-1', [hex], 'mountain')
            };

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBe('mountain');
        });

        it('should prioritize hex override over region biome', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({ '0,0': 'swamp' }, [], ['region-1']);
            const regions: Record<string, Region> = {
                'region-1': createRegion('region-1', [hex], 'forest')
            };

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBe('swamp');
        });

        it('should return null when hex is not in any region', () => {
            const hex = createHex(5, 5);
            const layer = createLayer({}, [], ['region-1']);
            const regions: Record<string, Region> = {
                'region-1': createRegion('region-1', [createHex(0, 0)], 'forest')
            };

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBeNull();
        });
    });

    describe('getTags', () => {
        it('should return empty array for hex with no tags', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({}, [], []);
            const locations: Record<string, any> = {};
            const regions: Record<string, Region> = {};

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toEqual([]);
        });

        it('should return custom tags from locations at hex', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({}, ['loc-1'], []);
            const locations: Record<string, any> = {
                'loc-1': createLocation('loc-1', hex, 'Settlement', ['#cursed', '#haunted'])
            };
            const regions: Record<string, Region> = {};

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toContain('#cursed');
            expect(result).toContain('#haunted');
        });

        it('should return key features from regions containing hex', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({}, [], ['region-1']);
            const locations: Record<string, any> = {};
            const regions: Record<string, Region> = {
                'region-1': createRegion('region-1', [hex], undefined, ['#sacred', '#ruins'])
            };

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toContain('#sacred');
            expect(result).toContain('#ruins');
        });

        it('should combine location and region tags', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({}, ['loc-1'], ['region-1']);
            const locations: Record<string, any> = {
                'loc-1': createLocation('loc-1', hex, 'Settlement', ['#magic'])
            };
            const regions: Record<string, Region> = {
                'region-1': createRegion('region-1', [hex], undefined, ['#hidden'])
            };

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toContain('#magic');
            expect(result).toContain('#hidden');
            expect(result.length).toBe(2);
        });

        it('should not include tags from locations at different hexes', () => {
            const hex = createHex(0, 0);
            const layer = createLayer({}, ['loc-1'], []);
            const locations: Record<string, any> = {
                'loc-1': createLocation('loc-1', createHex(1, 1), 'Settlement', ['#cursed'])
            };
            const regions: Record<string, Region> = {};

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toEqual([]);
        });
    });

    describe('serializeBiome', () => {
        it('should return natural language description for known biomes', () => {
            expect(service.serializeBiome('forest')).toBe('Dense canopy of ancient trees.');
            expect(service.serializeBiome('desert')).toBe('Endless shifting sands under a scorching sun.');
            expect(service.serializeBiome('grassland')).toBe('Rolling green plains stretching to the horizon.');
            expect(service.serializeBiome('mountain')).toBe('Jagged, snow-capped peaks reaching toward the sky.');
            expect(service.serializeBiome('swamp')).toBe('Festering, mist-shrouded wetlands with treacherous footing.');
            expect(service.serializeBiome('underdark')).toBe('Subterranean caverns of eternal night.');
            expect(service.serializeBiome('jungle')).toBe('Dense, humid wilderness with towering trees and exotic wildlife.');
            expect(service.serializeBiome('urban')).toBe('Bustling city streets and crowded markets.');
            expect(service.serializeBiome('arctic')).toBe('Frozen wastelands of eternal ice and snow.');
            expect(service.serializeBiome('volcanic')).toBe('Ash-covered lands with rivers of molten lava.');
        });

        it('should return biome name as fallback for unknown biomes', () => {
            expect(service.serializeBiome('unknown' as BiomeType)).toBe('unknown');
        });
    });

    describe('serializeTags', () => {
        it('should return natural language descriptions for known tags', () => {
            const tags = ['#cursed', '#haunted', '#sacred', '#hidden', '#ruins', '#magic'];
            const result = service.serializeTags(tags);

            expect(result).toContain('The area is Cursed.');
            expect(result).toContain('Ghostly apparitions linger here.');
            expect(result).toContain('The ground is consecrated.');
            expect(result).toContain('This place is magically concealed.');
            expect(result).toContain('Crumbling remnants of an old civilization.');
            expect(result).toContain('The air hums with raw arcane energy.');
        });

        it('should return tag as fallback for unknown tags', () => {
            const tags = ['#unknown', '#custom'];
            const result = service.serializeTags(tags);

            expect(result).toContain('#unknown');
            expect(result).toContain('#custom');
        });

        it('should handle empty array', () => {
            const result = service.serializeTags([]);
            expect(result).toEqual([]);
        });
    });

    describe('formatGroundingContext', () => {
        it('should format biome and tags into context block', () => {
            const context = {
                biome: 'forest' as any,
                tags: ['#cursed', '#haunted']
            };

            const result = service.formatGroundingContext(context);

            expect(result).toContain('### WORLD CONTEXT:');
            expect(result).toContain('Current Biome:');
            expect(result).toContain('Dense canopy of ancient trees.');
            expect(result).toContain('Local Features:');
        });

        it('should include nearby landmarks when provided', () => {
            const context = {
                biome: null,
                tags: [],
                landmarks: [
                    createLocation('loc-1', createHex(1, 1), 'Settlement'),
                    createLocation('loc-2', createHex(2, 2), 'Dungeon')
                ]
            };

            const result = service.formatGroundingContext(context);

            expect(result).toContain('Nearby Landmarks:');
            expect(result).toContain('Location loc-1 (Settlement)');
            expect(result).toContain('Location loc-2 (Dungeon)');
        });

        it('should handle null biome', () => {
            const context = {
                biome: null,
                tags: ['#sacred']
            };

            const result = service.formatGroundingContext(context);

            expect(result).toContain('### WORLD CONTEXT:');
            expect(result).toContain('Local Features:');
            expect(result).toContain('The ground is consecrated.');
        });

        it('should handle empty context', () => {
            const context = {
                biome: null,
                tags: [],
                landmarks: []
            };

            const result = service.formatGroundingContext(context);

            expect(result).toContain('### WORLD CONTEXT:');
        });
    });

    describe('getNearbyLandmarks', () => {
        const hex = createHex(0, 0);

        it('should return empty array when no locations', () => {
            const locations: Record<string, ManagedLocation> = {};
            const result = service.getNearbyLandmarks(hex, locations, 1);
            expect(result).toEqual([]);
        });

        it('should filter out locations at distance 0 (same hex)', () => {
            const locations: Record<string, ManagedLocation> = {
                'loc-1': createLocation('loc-1', hex, 'Settlement')
            };
            const result = service.getNearbyLandmarks(hex, locations, 1);
            expect(result).toEqual([]);
        });

        it('should filter out locations beyond radius', () => {
            const locations: Record<string, ManagedLocation> = {
                'loc-1': createLocation('loc-1', createHex(5, 5), 'Settlement')
            };
            const result = service.getNearbyLandmarks(hex, locations, 1);
            expect(result).toEqual([]);
        });

        it('should include major location types within radius', () => {
            const locations: Record<string, ManagedLocation> = {
                'loc-1': createLocation('loc-1', createHex(1, 0), 'Settlement'),
                'loc-2': createLocation('loc-2', createHex(0, 1), 'Dungeon'),
                'loc-3': createLocation('loc-3', createHex(1, -1), 'Battlemap')
            };
            const result = service.getNearbyLandmarks(hex, locations, 1);

            expect(result.length).toBe(3);
            expect(result.some(l => l.id === 'loc-1')).toBe(true);
            expect(result.some(l => l.id === 'loc-2')).toBe(true);
            expect(result.some(l => l.id === 'loc-3')).toBe(true);
        });

        it('should include explored special locations', () => {
            const locations: Record<string, ManagedLocation> = {
                'loc-1': createLocation('loc-1', createHex(1, 0), 'Special Location', [], 'mapped'),
                'loc-2': createLocation('loc-2', createHex(0, 1), 'Special Location', [], 'explored'),
                'loc-3': createLocation('loc-3', createHex(1, -1), 'Special Location', [], 'undiscovered')
            };
            const result = service.getNearbyLandmarks(hex, locations, 1);

            expect(result.length).toBe(2);
            expect(result.some(l => l.id === 'loc-1')).toBe(true);
            expect(result.some(l => l.id === 'loc-2')).toBe(true);
            expect(result.some(l => l.id === 'loc-3')).toBe(false);
        });

        it('should respect custom radius', () => {
            const locations: Record<string, ManagedLocation> = {
                'loc-1': createLocation('loc-1', createHex(2, 0), 'Settlement'),
                'loc-2': createLocation('loc-2', createHex(1, 0), 'Dungeon')
            };
            const result = service.getNearbyLandmarks(hex, locations, 1);

            expect(result.length).toBe(1);
            expect(result[0].id).toBe('loc-2');
        });
    });

    describe('constructSystemPrompt', () => {
        it('should prepend grounding context to base prompt', () => {
            const basePrompt = 'Generate an encounter.';
            const groundingContext = 'Current Biome: Forest\nLocal Features:\n- The area is Cursed.';

            const result = service.constructSystemPrompt(basePrompt, groundingContext);

            expect(result).toContain('### WORLD CONTEXT:');
            expect(result).toContain(groundingContext);
            expect(result).toContain('### INSTRUCTIONS:');
            expect(result).toContain(basePrompt);
        });

        it('should maintain correct ordering', () => {
            const basePrompt = 'Generate content.';
            const groundingContext = 'Context here.';

            const result = service.constructSystemPrompt(basePrompt, groundingContext);

            const worldContextIndex = result.indexOf('### WORLD CONTEXT:');
            const instructionsIndex = result.indexOf('### INSTRUCTIONS:');

            expect(worldContextIndex).toBeLessThan(instructionsIndex);
        });
    });

    describe('truncateContext', () => {
        it('should return text unchanged when within budget', () => {
            const text = 'Short text';
            const result = service.truncateContext(text, 100);
            expect(result).toBe(text);
        });

        it('should truncate text when exceeding budget', () => {
            const text = 'This is a very long text that should be truncated';
            const budget = 20;
            const result = service.truncateContext(text, budget);

            const truncationSuffix = '\n... [Context Truncated]';
            expect(result.length).toBeLessThanOrEqual(budget + truncationSuffix.length);
            expect(result).toContain('... [Context Truncated]');
            expect(result.startsWith('This is a very long ')).toBe(true);
        });

        it('should handle exact budget match', () => {
            const text = 'Exactly 20 chars!!';
            const budget = 20;
            const result = service.truncateContext(text, budget);
            expect(result).toBe(text);
        });

        it('should handle empty string', () => {
            const result = service.truncateContext('', 100);
            expect(result).toBe('');
        });
    });
});
