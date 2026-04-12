import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { useLocationStore } from '../../stores/locationStore';
import { ManagedLocation, MapLayer } from '../../types/location';
import { LayerIndicator } from '../../components/location/LayerIndicator';

describe('Layer Association & Echo Functionality', () => {
    let store: ReturnType<typeof useLocationStore.getState>;

    beforeEach(() => {
        // Reset store state before each test
        useLocationStore.setState({
            maps: {},
            activeMapId: null,
            locations: {},
            regions: {},
            layers: {},
            activeLayerId: null,
            viewSettings: {},
            layerOrder: [],
            generateProceduralLayer: null
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
            activeLayerId: null,
            viewSettings: {},
            layerOrder: [],
            generateProceduralLayer: null
        });
    });

    describe('getFilteredLocationList', () => {
        it('should return empty array when no active map or layer', () => {
            const result = store.getFilteredLocationList();
            expect(result).toEqual([]);
        });

        it('should return all locations when no active layer', () => {
            const mapId = 'test-map-1';
            const layerId = 'layer-1';
            const activeLayer: MapLayer = {
                id: layerId,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: {},
                    revealedHexes: {},
                    regions: [],
                    locations: ['loc-1', 'loc-2']
                },
                theme: {
                    mode: 'surface',
                    biomePalette: 'standard',
                    backgroundColor: '#ffffff',
                    patternSet: 'default'
                }
            };

            const locations: ManagedLocation[] = [
                {
                    id: 'loc-1',
                    name: 'Location 1',
                    description: 'Test location 1',
                    type: 'Settlement',
                    mapId: 'test-map-1',
                    hexCoordinate: { q: 0, r: 0 },
                    biome: 'forest' as const,
                    regionId: '',
                    isKnownToPlayers: true,
                    discoveryStatus: 'explored' as const,
                    connectedLocations: [],
                    loreReferences: [],
                    customTags: [],
                    notes: '',
                    createdAt: new Date(),
                    lastModified: new Date()
                },
                {
                    id: 'loc-2',
                    name: 'Location 2',
                    description: 'Test location 2',
                    type: 'Settlement',
                    mapId: 'test-map-1',
                    hexCoordinate: { q: 1, r: 0 },
                    biome: 'forest' as const,
                    regionId: '',
                    isKnownToPlayers: true,
                    discoveryStatus: 'explored' as const,
                    connectedLocations: [],
                    loreReferences: [],
                    customTags: [],
                    notes: '',
                    createdAt: new Date(),
                    lastModified: new Date()
                }
            ];

            useLocationStore.setState({
                ...store,
                maps: { [mapId]: { id: mapId, name: 'Test Map', createdAt: new Date(), lastModified: new Date(), layerOrder: [layerId] } },
                activeMapId: mapId,
                activeLayerId: layerId,
                locations: Object.fromEntries(locations.map(loc => [loc.id, loc])),
                layers: { [layerId]: activeLayer }
            });

            const result = store.getFilteredLocationList();
            expect(result).toEqual(locations);
        });

        it('should filter by layerAssociation when present', () => {
            const mapId = 'test-map-1';
            const layerId1 = 'layer-1';
            const layerId2 = 'layer-2';

            const activeLayer1: MapLayer = {
                id: layerId1,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: {},
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

            const activeLayer2: MapLayer = {
                id: layerId2,
                mapId,
                name: 'Shadowfell',
                type: 'shadowfell',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: {},
                    revealedHexes: {},
                    regions: [],
                    locations: []
                },
                theme: {
                    mode: 'shadowfell',
                    biomePalette: 'subterranean',
                    backgroundColor: '#1a1a1a',
                    patternSet: 'default'
                }
            };

            const locations: ManagedLocation[] = [
                {
                    id: 'loc-1',
                    name: 'Location 1',
                    description: 'Test location 1',
                    type: 'Settlement',
                    mapId: 'test-map-1',
                    hexCoordinate: { q: 0, r: 0 },
                    biome: 'forest' as const,
                    regionId: '',
                    isKnownToPlayers: true,
                    discoveryStatus: 'explored' as const,
                    connectedLocations: [],
                    loreReferences: [],
                    customTags: [],
                    notes: '',
                    createdAt: new Date(),
                    lastModified: new Date(),
                    layerAssociation: {
                        associatedMapId: layerId1,
                        isEchoed: true,
                        originalLayerId: layerId1
                    }
                },
                {
                    id: 'loc-2',
                    name: 'Location 2',
                    description: 'Test location 2',
                    type: 'Settlement',
                    mapId: 'test-map-1',
                    hexCoordinate: { q: 1, r: 0 },
                    biome: 'forest' as const,
                    regionId: '',
                    isKnownToPlayers: true,
                    discoveryStatus: 'explored' as const,
                    connectedLocations: [],
                    loreReferences: [],
                    customTags: [],
                    notes: '',
                    createdAt: new Date(),
                    lastModified: new Date(),
                    layerAssociation: {
                        associatedMapId: layerId2,
                        isEchoed: true,
                        originalLayerId: layerId2
                    }
                }
            ];

            useLocationStore.setState({
                ...store,
                maps: { [mapId]: { id: mapId, name: 'Test Map', createdAt: new Date(), lastModified: new Date(), layerOrder: [layerId1, layerId2] } },
                activeMapId: mapId,
                activeLayerId: layerId2,
                locations: Object.fromEntries(locations.map(loc => [loc.id, loc])),
                layers: {
                    [layerId1]: activeLayer1,
                    [layerId2]: activeLayer2
                }
            });

            const result = store.getFilteredLocationList();
            expect(result).toEqual([locations[1]]);
        });

        it('should filter by mapId when layerAssociation is not present', () => {
            const mapId = 'test-map-1';
            const layerId = 'layer-1';

            const activeLayer: MapLayer = {
                id: layerId,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: {},
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

            const locations: ManagedLocation[] = [
                {
                    id: 'loc-1',
                    name: 'Location 1',
                    description: 'Test location 1',
                    type: 'Settlement',
                    mapId: 'test-map-1',
                    hexCoordinate: { q: 0, r: 0 },
                    biome: 'forest' as const,
                    regionId: '',
                    isKnownToPlayers: true,
                    discoveryStatus: 'explored' as const,
                    connectedLocations: [],
                    loreReferences: [],
                    customTags: [],
                    notes: '',
                    createdAt: new Date(),
                    lastModified: new Date()
                }
            ];

            useLocationStore.setState({
                ...store,
                maps: { [mapId]: { id: mapId, name: 'Test Map', createdAt: new Date(), lastModified: new Date(), layerOrder: [layerId] } },
                activeMapId: mapId,
                activeLayerId: layerId,
                locations: Object.fromEntries(locations.map(loc => [loc.id, loc])),
                layers: { [layerId]: activeLayer }
            });

            const result = store.getFilteredLocationList();
            expect(result).toEqual(locations);
        });

        it('should handle backward compatibility with mapId matching active layer', () => {
            const mapId = 'test-map-1';
            const layerId = 'layer-1';

            const activeLayer: MapLayer = {
                id: layerId,
                mapId,
                name: 'Surface',
                type: 'surface',
                visible: true,
                opacity: 1,
                data: {
                    hexBiomes: {},
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

            const locations: ManagedLocation[] = [
                {
                    id: 'loc-1',
                    name: 'Location 1',
                    description: 'Test location 1',
                    type: 'Settlement',
                    mapId: layerId,  // Uses mapId directly (backward compatible)
                    hexCoordinate: { q: 0, r: 0 },
                    biome: 'forest' as const,
                    regionId: '',
                    isKnownToPlayers: true,
                    discoveryStatus: 'explored' as const,
                    connectedLocations: [],
                    loreReferences: [],
                    customTags: [],
                    notes: '',
                    createdAt: new Date(),
                    lastModified: new Date()
                }
            ];

            useLocationStore.setState({
                ...store,
                maps: { [mapId]: { id: mapId, name: 'Test Map', createdAt: new Date(), lastModified: new Date(), layerOrder: [layerId] } },
                activeMapId: mapId,
                activeLayerId: layerId,
                locations: Object.fromEntries(locations.map(loc => [loc.id, loc])),
                layers: { [layerId]: activeLayer }
            });

            const result = store.getFilteredLocationList();
            expect(result).toEqual(locations);
        });
    });

    describe('LayerIndicator Component', () => {
        it('should render nothing when layerType is not provided', () => {
            const { container } = render(<LayerIndicator />);
            expect(container.firstChild).toBeNull();
        });

        it('should render indicator with correct color for surface layer', () => {
            const { container } = render(<LayerIndicator layerType="surface" />);
            expect(container).not.toBeNull();
            expect(container.innerHTML).toContain('rgb(76, 175, 80)');
        });

        it('should render indicator with correct color for shadowfell layer', () => {
            const { container } = render(<LayerIndicator layerType="shadowfell" />);
            expect(container).not.toBeNull();
            expect(container.innerHTML).toContain('rgb(45, 27, 46)');
        });

        it('should render indicator with correct color for feywild layer', () => {
            const { container } = render(<LayerIndicator layerType="feywild" />);
            expect(container).not.toBeNull();
            expect(container.innerHTML).toContain('rgb(16, 185, 129)');
        });

        it('should render indicator with correct color for underdark layer', () => {
            const { container } = render(<LayerIndicator layerType="underdark" />);
            expect(container).not.toBeNull();
            expect(container.innerHTML).toContain('rgb(26, 26, 26)');
        });

        it('should render indicator with correct color for elemental layer', () => {
            const { container } = render(<LayerIndicator layerType="elemental" />);
            expect(container).not.toBeNull();
            expect(container.innerHTML).toContain('rgb(245, 158, 11)');
        });

        it('should render custom layer color', () => {
            const { container } = render(<LayerIndicator layerType="custom" />);
            expect(container).not.toBeNull();
            expect(container.innerHTML).toContain('rgb(107, 114, 128)');
        });
    });
});
