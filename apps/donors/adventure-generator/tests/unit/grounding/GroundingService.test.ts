
import { describe, it, expect, beforeEach } from 'vitest';
import { GroundingService } from '../../../src/services/GroundingService';
import { HexCoordinate, MapLayer, Region, BiomeType } from '../../../src/types/location';

// --- Mocks & Helpers ---
const mockHex = (q: number, r: number): HexCoordinate => ({ q, r, s: -q - r });
const hexKey = (hex: HexCoordinate) => `${hex.q},${hex.r}`;

const createMockLayer = (overrides: Partial<MapLayer> = {}): MapLayer => {
    const defaultData = {
        hexBiomes: {},
        revealedHexes: {},
        regions: [],
        locations: []
    };

    const { data: overrideData, ...rest } = overrides;
    const mergedData = overrideData ? { ...defaultData, ...overrideData } : defaultData;

    return {
        id: 'layer-1',
        mapId: 'map-1',
        name: 'Surface',
        type: 'surface',
        visible: true,
        opacity: 1,
        theme: {
            mode: 'surface',
            biomePalette: 'standard',
            backgroundColor: '#000',
            patternSet: 'default'
        },
        ...rest,
        data: mergedData
    };
};

const createMockRegion = (id: string, hexes: HexCoordinate[], biome?: BiomeType): Region => ({
    id,
    mapId: 'map-1',
    name: 'Region ' + id,
    description: 'A test region',
    politicalControl: 'Neutral',
    dangerLevel: 1,
    dominantBiome: biome || 'grassland',
    culturalNotes: '',
    keyFeatures: ['Ancient Ruin', 'Dense Fog'],
    boundingBox: { minQ: 0, maxQ: 0, minR: 0, maxR: 0 },
    hexes,
    color: '#ff0000'
});

const createMockLocation = (id: string, hex: HexCoordinate, tags: string[] = []): any => ({
    id,
    name: id, // Changed from 'Loc-' + id for easier testing of names
    hexCoordinate: hex,
    customTags: tags,
    type: 'Settlement',
    discoveryStatus: 'explored'
});

describe('GroundingService', () => {
    let service: GroundingService;

    beforeEach(() => {
        service = new GroundingService();
    });

    describe('getEffectiveBiome', () => {
        it('should return null if no biome is defined', () => {
            const hex = mockHex(0, 0);
            const layer = createMockLayer();
            const regions: Record<string, Region> = {};

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBeNull();
        });

        it('should return the direct hex biome override', () => {
            const hex = mockHex(1, 1);
            const layer = createMockLayer({
                data: {
                    hexBiomes: { [hexKey(hex)]: 'forest' as BiomeType },
                    revealedHexes: {},
                    regions: [],
                    locations: []
                }
            });
            const regions: Record<string, Region> = {};

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBe('forest');
        });

        it('should return the region dominant biome if no hex override', () => {
            const hex = mockHex(2, 2);
            const region = createMockRegion('region-1', [hex], 'desert');
            const layer = createMockLayer({
                data: {
                    hexBiomes: {},
                    revealedHexes: {},
                    regions: ['region-1'],
                    locations: []
                }
            });
            const regions = { 'region-1': region };

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBe('desert');
        });

        it('should prioritize hex override over region biome', () => {
            const hex = mockHex(3, 3);
            const region = createMockRegion('region-2', [hex], 'swamp');
            const layer = createMockLayer({
                data: {
                    hexBiomes: { [hexKey(hex)]: 'volcanic' as BiomeType }, // Override swamp
                    revealedHexes: {},
                    regions: ['region-2'],
                    locations: []
                }
            });
            const regions = { 'region-2': region };

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBe('volcanic');
        });

        it('should return null if hex is not in the region list even if regions are present', () => {
            const hex = mockHex(4, 4);
            const otherHex = mockHex(5, 5);
            const region = createMockRegion('region-3', [otherHex], 'tundra' as BiomeType);
            const layer = createMockLayer({
                data: {
                    hexBiomes: {},
                    revealedHexes: {},
                    regions: ['region-3'],
                    locations: []
                }
            });
            const regions = { 'region-3': region };

            const result = service.getEffectiveBiome(hex, layer, regions);
            expect(result).toBeNull();
        });
    });

    describe('getTags', () => {
        it('should return empty array if no tags found', () => {
            const hex = mockHex(0, 0);
            const layer = createMockLayer();
            const locations = {};
            const regions = {};

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toEqual([]);
        });

        it('should combine tags from multiple locations at the same hex', () => {
            const hex = mockHex(1, 1);
            const loc1 = createMockLocation('loc-1', hex, ['#haunted', '#ruins']);
            const loc2 = createMockLocation('loc-2', hex, ['#hidden']);

            const layer = createMockLayer({ data: { locations: ['loc-1', 'loc-2'] } as any });
            const locations = ruleCurator('loc-1', loc1, 'loc-2', loc2);
            const regions = {};

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toEqual(expect.arrayContaining(['#haunted', '#ruins', '#hidden']));
        });

        it('should include key features from regions', () => {
            const hex = mockHex(2, 2);
            const region = createMockRegion('reg-1', [hex]);
            region.keyFeatures = ['Dense Fog', 'Muddy'];

            const layer = createMockLayer({ data: { regions: ['reg-1'] } as any });
            const locations = {};
            const regions = { 'reg-1': region };

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toEqual(expect.arrayContaining(['Dense Fog', 'Muddy']));
        });

        it('should deduplicate tags', () => {
            const hex = mockHex(3, 3);
            const loc = createMockLocation('loc-3', hex, ['#magic']);
            const region = createMockRegion('reg-2', [hex]);
            region.keyFeatures = ['#magic', 'Spooky'];

            const layer = createMockLayer({ data: { locations: ['loc-3'], regions: ['reg-2'] } as any });
            const locations = { 'loc-3': loc };
            const regions = { 'reg-2': region };

            const result = service.getTags(hex, layer, locations, regions);
            expect(result).toHaveLength(2);
            expect(result).toEqual(expect.arrayContaining(['#magic', 'Spooky']));
        });
    });

    describe('landmarks', () => {
        it('should identify nearby significant locations', () => {
            const center = mockHex(0, 0);
            const nearSettlement = createMockLocation('town-1', mockHex(1, 0), []);
            nearSettlement.type = 'Settlement';

            const nearSpecial = createMockLocation('shrine-1', mockHex(0, 1), []);
            nearSpecial.type = 'Special Location';
            nearSpecial.discoveryStatus = 'mapped';

            const farDungeon = createMockLocation('dungeon-1', mockHex(5, 5), []);
            farDungeon.type = 'Dungeon';

            const locations = {
                'town-1': nearSettlement,
                'shrine-1': nearSpecial,
                'dungeon-1': farDungeon
            };

            const result = service.getNearbyLandmarks(center, locations, 1);
            expect(result).toHaveLength(2);
            expect(result.map(l => l.name)).toContain('town-1');
            expect(result.map(l => l.name)).toContain('shrine-1');
            expect(result.map(l => l.name)).not.toContain('dungeon-1');
        });
    });

    describe('serialization', () => {
        it('should serialize biomes to descriptions', () => {
            expect(service.serializeBiome('forest')).toBe('Dense canopy of ancient trees.');
            expect(service.serializeBiome('desert')).toBe('Endless shifting sands under a scorching sun.');
            expect(service.serializeBiome('unknown' as BiomeType)).toBe('unknown'); // Fallback
        });

        it('should serialize known tags to descriptions', () => {
            const tags = ['#cursed', 'Dense Fog'];
            const result = service.serializeTags(tags);
            expect(result).toContain('The area is Cursed.');
            expect(result).toContain('Dense Fog');
        });
    });

    describe('Prompt Integration', () => {
        it('should construct a grounding block from context', () => {
            const context = {
                biome: 'forest' as BiomeType,
                tags: ['#cursed', 'Dense Fog'],
                landmarks: [
                    { name: 'Old Bridge', type: 'Special Location' } as any
                ]
            };
            const result = service.formatGroundingContext(context);
            expect(result).toContain('WORLD CONTEXT:');
            expect(result).toContain('Dense canopy of ancient trees.');
            expect(result).toContain('The area is Cursed.');
            expect(result).toContain('Dense Fog');
            expect(result).toContain('Nearby Landmarks:');
            expect(result).toContain('- Old Bridge (Special Location)');
        });

        it('should prepend grounding context to system prompt', () => {
            const basePrompt = "You are a helpful DM.";
            const grounding = "You are in a forest.";
            const result = service.constructSystemPrompt(basePrompt, grounding);

            expect(result).toBe("### WORLD CONTEXT:\nYou are in a forest.\n\n### INSTRUCTIONS:\nYou are a helpful DM.");
        });

        it('should truncate context to stay within budget', () => {
            const longContext = "word ".repeat(500);
            const budget = 100;
            const result = service.truncateContext(longContext, budget);

            expect(result.length).toBeLessThan(longContext.length);
            expect(result).toMatch(/\[Context Truncated\]/);
        });
    });
});

const ruleCurator = (...args: any[]) => {
    const dict: any = {};
    for (let i = 0; i < args.length; i += 2) {
        dict[args[i]] = args[i + 1];
    }
    return dict;
};
