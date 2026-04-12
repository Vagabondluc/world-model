// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLocationStore } from '../stores/locationStore';
import { defaultViewSettings } from '../stores/locationUiSlice';
import { HexCoordinate, MapLayer, Region, ManagedLocation, WorldMap, BiomeType } from '../types/location';

describe('GroundingStore Integration', () => {
    let store: ReturnType<typeof useLocationStore.getState>;

    const createRegion = (
        id: string,
        mapId: string,
        hexes: HexCoordinate[],
        dominantBiome: BiomeType,
        keyFeatures: string[] = []
    ): Region => {
        const qs = hexes.map(h => h.q);
        const rs = hexes.map(h => h.r);
        const minQ = qs.length ? Math.min(...qs) : 0;
        const maxQ = qs.length ? Math.max(...qs) : 0;
        const minR = rs.length ? Math.min(...rs) : 0;
        const maxR = rs.length ? Math.max(...rs) : 0;

        return {
            id,
            mapId,
            name: 'Test Region',
            description: 'A test region',
            politicalControl: 'None',
            dangerLevel: 1,
            dominantBiome,
            culturalNotes: 'None',
            keyFeatures,
            boundingBox: { minQ, maxQ, minR, maxR },
            hexes,
            color: '#ff0000'
        };
    };

    beforeEach(() => {
        // Reset store state before each test
        useLocationStore.setState({
            maps: {},
            activeMapId: null,
            locations: {},
            regions: {},
            layers: {},
            viewSettings: {},
            layerOrder: [],
            activeLayerId: null
        });
        store = useLocationStore.getState();
    });

    afterEach(() => {
        // Clean up after each test
        useLocationStore.setState({
            maps: {},
            activeMapId: null,
            locations: {},
            regions: {},
            layers: {},
            viewSettings: {},
            layerOrder: [],
            activeLayerId: null
        });
    });

    describe('getGroundingContext', () => {
        it('should return empty string when no active map or layer', () => {
            const context = store.getGroundingContext();
            expect(context).toBe('');
        });

        it('should correctly provide data to GroundingService for active hex', () => {
            // Setup: Create a map with layer, region, and location
            const mapId = 'test-map-1';
            const layerId = 'layer-1';
            const regionId = 'region-1';
            const locationId = 'loc-1';
            const hex: HexCoordinate = { q: 0, r: 0 };

            const testMap: WorldMap = {
                id: mapId,
                name: 'Test Map',
                description: 'A test map',
                createdAt: new Date(),
                lastModified: new Date(),
                layerOrder: [layerId]
            };

            const testLayer: MapLayer = {
                id: layerId,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: { '0,0': 'forest' },
                    revealedHexes: {},
                    regions: [regionId],
                    locations: [locationId]
                },
                theme: {
                    mode: 'surface',
                    biomePalette: 'standard',
                    backgroundColor: '#ffffff',
                    patternSet: 'default'
                }
            };

            const testRegion: Region = createRegion(regionId, mapId, [hex], 'forest', ['#cursed']);

            const testLocation: ManagedLocation = {
                id: locationId,
                name: 'Test Location',
                description: 'A test location',
                type: 'Settlement',
                mapId,
                hexCoordinate: hex,
                biome: 'forest',
                regionId,
                isKnownToPlayers: true,
                discoveryStatus: 'explored',
                connectedLocations: [],
                loreReferences: [],
                customTags: ['#haunted'],
                notes: '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            // Set up store state
            useLocationStore.setState({
                ...store,
                maps: { [mapId]: testMap },
                activeMapId: mapId,
                layers: { [layerId]: testLayer },
                activeLayerId: layerId,
                regions: { [regionId]: testRegion },
                locations: { [locationId]: testLocation },
                viewSettings: { [mapId]: { ...defaultViewSettings, centerCoordinate: hex } }
            });

            // Act: Get grounding context
            const context = store.getGroundingContext();

            // Assert: Context should contain expected elements
            expect(context).toContain('### WORLD CONTEXT:');
            expect(context).toContain('Current Biome:');
            expect(context).toContain('Dense canopy of ancient trees.'); // forest description
            expect(context).toContain('Local Features:');
            expect(context).toContain('The area is Cursed.'); // from region
            expect(context).toContain('Ghostly apparitions linger here.'); // from location
        });

        it('should respect hex override over region biome', () => {
            const mapId = 'test-map-2';
            const layerId = 'layer-2';
            const regionId = 'region-2';
            const hex: HexCoordinate = { q: 1, r: 1 };

            const testMap: WorldMap = {
                id: mapId,
                name: 'Test Map 2',
                description: 'A test map',
                createdAt: new Date(),
                lastModified: new Date(),
                layerOrder: [layerId]
            };

            const testLayer: MapLayer = {
                id: layerId,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: { '1,1': 'desert' }, // Override
                    revealedHexes: {},
                    regions: [regionId],
                    locations: []
                },
                theme: {
                    mode: 'surface',
                    biomePalette: 'standard',
                    backgroundColor: '#ffffff',
                    patternSet: 'default'
                }
            };

            const testRegion: Region = createRegion(regionId, mapId, [hex], 'forest');

            useLocationStore.setState({
                ...store,
                maps: { [mapId]: testMap },
                activeMapId: mapId,
                layers: { [layerId]: testLayer },
                activeLayerId: layerId,
                regions: { [regionId]: testRegion },
                viewSettings: { [mapId]: { ...defaultViewSettings, centerCoordinate: hex } }
            });

            const context = store.getGroundingContext();

            // Assert: Should use desert (override) not forest (region)
            expect(context).toContain('Endless shifting sands under a scorching sun.');
            expect(context).not.toContain('Dense canopy of ancient trees.');
        });

        it('should include nearby landmarks in context', () => {
            const mapId = 'test-map-3';
            const layerId = 'layer-3';
            const centerHex: HexCoordinate = { q: 0, r: 0 };

            const testMap: WorldMap = {
                id: mapId,
                name: 'Test Map 3',
                description: 'A test map',
                createdAt: new Date(),
                lastModified: new Date(),
                layerOrder: [layerId]
            };

            const testLayer: MapLayer = {
                id: layerId,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: { '0,0': 'grassland' },
                    revealedHexes: {},
                    regions: [],
                    locations: ['loc-1', 'loc-2', 'loc-3']
                },
                theme: {
                    mode: 'surface',
                    biomePalette: 'standard',
                    backgroundColor: '#ffffff',
                    patternSet: 'default'
                }
            };

            const testLocation1: ManagedLocation = {
                id: 'loc-1',
                name: 'Nearby Settlement',
                description: 'A nearby settlement',
                type: 'Settlement',
                mapId,
                hexCoordinate: { q: 1, r: -1 }, // Distance 1
                biome: 'grassland',
                regionId: '',
                isKnownToPlayers: true,
                discoveryStatus: 'explored',
                connectedLocations: [],
                loreReferences: [],
                customTags: [],
                notes: '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            const testLocation2: ManagedLocation = {
                id: 'loc-2',
                name: 'Nearby Dungeon',
                description: 'A nearby dungeon',
                type: 'Dungeon',
                mapId,
                hexCoordinate: { q: 0, r: 1 }, // Distance 1
                biome: 'grassland',
                regionId: '',
                isKnownToPlayers: true,
                discoveryStatus: 'explored',
                connectedLocations: [],
                loreReferences: [],
                customTags: [],
                notes: '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            const testLocation3: ManagedLocation = {
                id: 'loc-3',
                name: 'Far Location',
                description: 'A far location',
                type: 'Settlement',
                mapId,
                hexCoordinate: { q: 5, r: 5 }, // Distance 10 - beyond radius
                biome: 'grassland',
                regionId: '',
                isKnownToPlayers: true,
                discoveryStatus: 'explored',
                connectedLocations: [],
                loreReferences: [],
                customTags: [],
                notes: '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            useLocationStore.setState({
                ...store,
                maps: { [mapId]: testMap },
                activeMapId: mapId,
                layers: { [layerId]: testLayer },
                activeLayerId: layerId,
                locations: {
                    'loc-1': testLocation1,
                    'loc-2': testLocation2,
                    'loc-3': testLocation3
                },
                viewSettings: { [mapId]: { ...defaultViewSettings, centerCoordinate: centerHex } }
            });

            const context = store.getGroundingContext();

            // Assert: Should include nearby landmarks but not far ones
            expect(context).toContain('Nearby Landmarks:');
            expect(context).toContain('Nearby Settlement (Settlement)');
            expect(context).toContain('Nearby Dungeon (Dungeon)');
            expect(context).not.toContain('Far Location (Settlement)');
        });

        it('should react to biome changes in the map', () => {
            const mapId = 'test-map-4';
            const layerId = 'layer-4';
            const hex: HexCoordinate = { q: 0, r: 0 };

            const testMap: WorldMap = {
                id: mapId,
                name: 'Test Map 4',
                description: 'A test map',
                createdAt: new Date(),
                lastModified: new Date(),
                layerOrder: [layerId]
            };

            const testLayer: MapLayer = {
                id: layerId,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: { '0,0': 'forest' },
                    revealedHexes: {},
                    regions: [],
                    locations: []
                },
                theme: {
                    mode: 'surface',
                    biomePalette: 'standard',
                    backgroundColor: '#ffffff',
                    patternSet: 'default'
                }
            };

            useLocationStore.setState({
                ...store,
                maps: { [mapId]: testMap },
                activeMapId: mapId,
                layers: { [layerId]: testLayer },
                activeLayerId: layerId,
                viewSettings: { [mapId]: { ...defaultViewSettings, centerCoordinate: hex } }
            });

            // Get initial context - re-fetch state
            const initialContext = useLocationStore.getState().getGroundingContext();
            expect(initialContext).toContain('Dense canopy of ancient trees.');

            // Update biome
            const updatedLayer: MapLayer = {
                ...testLayer,
                data: {
                    ...testLayer.data,
                    hexBiomes: { '0,0': 'desert' }
                }
            };

            useLocationStore.setState({
                ...useLocationStore.getState(),
                layers: { [layerId]: updatedLayer }
            });

            // Get updated context - re-fetch state after update
            const updatedContext = useLocationStore.getState().getGroundingContext();

            // Assert: Context should reflect new biome
            expect(updatedContext).toContain('Endless shifting sands under a scorching sun.');
            expect(updatedContext).not.toContain('Dense canopy of ancient trees.');
        });

        it('should filter locations to active map only', () => {
            const mapId1 = 'test-map-5a';
            const mapId2 = 'test-map-5b';
            const layerId1 = 'layer-5a';
            const layerId2 = 'layer-5b';
            const hex: HexCoordinate = { q: 0, r: 0 };

            const testMap1: WorldMap = {
                id: mapId1,
                name: 'Test Map 5a',
                description: 'Active map',
                createdAt: new Date(),
                lastModified: new Date(),
                layerOrder: [layerId1]
            };

            const testMap2: WorldMap = {
                id: mapId2,
                name: 'Test Map 5b',
                description: 'Inactive map',
                createdAt: new Date(),
                lastModified: new Date(),
                layerOrder: [layerId2]
            };

            const testLayer1: MapLayer = {
                id: layerId1,
                mapId: mapId1,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: { '0,0': 'grassland' },
                    revealedHexes: {},
                    regions: [],
                    locations: ['loc-active']
                },
                theme: {
                    mode: 'surface',
                    biomePalette: 'standard',
                    backgroundColor: '#ffffff',
                    patternSet: 'default'
                }
            };

            const testLayer2: MapLayer = {
                id: layerId2,
                mapId: mapId2,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: { '0,0': 'grassland' },
                    revealedHexes: {},
                    regions: [],
                    locations: ['loc-inactive']
                },
                theme: {
                    mode: 'surface',
                    biomePalette: 'standard',
                    backgroundColor: '#ffffff',
                    patternSet: 'default'
                }
            };

            const activeLocation: ManagedLocation = {
                id: 'loc-active',
                name: 'Active Location',
                description: 'Location on active map',
                type: 'Settlement',
                mapId: mapId1,
                hexCoordinate: { q: 1, r: 0 },
                biome: 'grassland',
                regionId: '',
                isKnownToPlayers: true,
                discoveryStatus: 'explored',
                connectedLocations: [],
                loreReferences: [],
                customTags: [],
                notes: '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            const inactiveLocation: ManagedLocation = {
                id: 'loc-inactive',
                name: 'Inactive Location',
                description: 'Location on inactive map',
                type: 'Settlement',
                mapId: mapId2,
                hexCoordinate: { q: 1, r: 0 },
                biome: 'grassland',
                regionId: '',
                isKnownToPlayers: true,
                discoveryStatus: 'explored',
                connectedLocations: [],
                loreReferences: [],
                customTags: [],
                notes: '',
                createdAt: new Date(),
                lastModified: new Date()
            };

            useLocationStore.setState({
                ...store,
                maps: {
                    [mapId1]: testMap1,
                    [mapId2]: testMap2
                },
                activeMapId: mapId1,
                layers: {
                    [layerId1]: testLayer1,
                    [layerId2]: testLayer2
                },
                activeLayerId: layerId1,
                locations: {
                    'loc-active': activeLocation,
                    'loc-inactive': inactiveLocation
                },
                viewSettings: { [mapId1]: { ...defaultViewSettings, centerCoordinate: hex } }
            });

            const context = store.getGroundingContext();

            // Assert: Should only include location from active map
            expect(context).toContain('Nearby Landmarks:');
            expect(context).toContain('Active Location (Settlement)');
            expect(context).not.toContain('Inactive Location (Settlement)');
        });
    });
});
