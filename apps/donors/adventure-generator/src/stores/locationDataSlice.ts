import { StateCreator } from 'zustand';
import { ManagedLocation, Region, BiomeType, HexCoordinate, WorldMap, MapLayer } from '../types/location';
import { generateId } from '../utils/helpers';
import { LocationStoreState } from './locationStore';
import { GenerationSettings, generateProceduralMapData } from '../utils/mapGenerationUtils';

export interface LocationDataState {
    maps: Record<string, WorldMap>;
    activeMapId: string | null;
    locations: Record<string, ManagedLocation>;
    regions: Record<string, Region>;
    layers: Record<string, MapLayer>;
}

export interface LocationDataActions {
    addMap: (mapData: Omit<WorldMap, 'id' | 'createdAt' | 'lastModified' | 'layerOrder' | 'radius'>) => WorldMap;
    setActiveMapId: (id: string | null) => void;
    setLocations: (locations: ManagedLocation[]) => void;
    addLocation: (location: ManagedLocation) => void;
    updateLocation: (location: ManagedLocation) => void;
    removeLocation: (id: string) => void;
    setRegions: (regions: Region[]) => void;
    addRegion: (region: Region) => void;
    updateRegion: (region: Region) => void;
    removeRegion: (id: string) => void;
    setLayers: (layers: MapLayer[]) => void;
    paintHexBiome: (hex: HexCoordinate, biome: BiomeType) => void;
    getHexBiomes: () => Record<string, BiomeType>;
    revealHex: (hex: HexCoordinate) => void;
    hideHex: (hex: HexCoordinate) => void;
    getRevealedHexes: () => Record<string, boolean>;
    generateProceduralLayer: (settings: GenerationSettings) => void;
    cloneLocationToLayer: (locationId: string, targetLayerId: string) => void;
}

export const createLocationDataSlice: StateCreator<
    LocationStoreState,
    [],
    [],
    LocationDataState & LocationDataActions
> = (set, get) => ({
    maps: {},
    activeMapId: null,
    locations: {},
    regions: {},
    layers: {},

    addMap: (mapData) => {
        const newMapId = generateId();
        const defaultLayerId = generateId();

        const defaultLayer: MapLayer = {
            id: defaultLayerId,
            mapId: newMapId,
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
                backgroundColor: '#f0f0f0',
                patternSet: 'standard'
            }
        };

        const newMap: WorldMap = {
            ...mapData,
            id: newMapId,
            createdAt: new Date(),
            lastModified: new Date(),
            layerOrder: [defaultLayerId],
            radius: 15 // Default
        };

        set(state => {
            const newState: Partial<LocationStoreState> = {
                maps: { ...state.maps, [newMap.id]: newMap },
                layers: { ...state.layers, [defaultLayer.id]: defaultLayer },
            };

            if (!state.activeMapId) {
                newState.activeMapId = newMap.id;
                newState.activeLayerId = defaultLayerId;
                newState.layerOrder = [defaultLayerId];
            }

            return newState;
        });

        return newMap;
    },
    setActiveMapId: (id) => {
        set({ activeMapId: id });
        const newMap = get().maps[id!];
        if (newMap) {
            const newLayerOrder = newMap.layerOrder || [];
            get().setLayerOrder(newLayerOrder);
            get().setActiveLayerId(newLayerOrder[0] || null);
        } else {
            get().setLayerOrder([]);
            get().setActiveLayerId(null);
        }
    },

    setLocations: (locList) => set({
        locations: locList.reduce<Record<string, ManagedLocation>>((acc, loc) => {
            acc[loc.id] = loc;
            return acc;
        }, {})
    }),
    addLocation: (loc) => set(state => ({ locations: { ...state.locations, [loc.id]: loc } })),
    updateLocation: (loc) => set(state => ({ locations: { ...state.locations, [loc.id]: loc } })),
    removeLocation: (id) => set(state => {
        const newLocations = { ...state.locations };
        delete newLocations[id];
        return { locations: newLocations };
    }),

    setRegions: (regList) => set({
        regions: regList.reduce<Record<string, Region>>((acc, reg) => {
            acc[reg.id] = reg;
            return acc;
        }, {})
    }),
    addRegion: (reg) => set(state => ({ regions: { ...state.regions, [reg.id]: reg } })),
    updateRegion: (reg) => set(state => ({ regions: { ...state.regions, [reg.id]: reg } })),
    removeRegion: (id) => set(state => {
        const newRegions = { ...state.regions };
        delete newRegions[id];
        return { regions: newRegions };
    }),

    setLayers: (layerList) => set({
        layers: layerList.reduce<Record<string, MapLayer>>((acc, layer) => {
            acc[layer.id] = layer;
            return acc;
        }, {})
    }),

    paintHexBiome: (hex, biome) => set(state => {
        const { activeLayerId } = state;
        if (!activeLayerId) return state;
        const key = `${hex.q},${hex.r}`;
        const layer = state.layers[activeLayerId];
        if (!layer) return state;

        const updatedLayer = {
            ...layer,
            data: {
                ...layer.data,
                hexBiomes: { ...layer.data.hexBiomes, [key]: biome }
            }
        };
        return { layers: { ...state.layers, [activeLayerId]: updatedLayer } };
    }),

    getHexBiomes: () => {
        const { layers, activeLayerId } = get();
        return (activeLayerId && layers[activeLayerId]?.data.hexBiomes) || {};
    },

    revealHex: (hex) => set(state => {
        const { activeLayerId } = state;
        if (!activeLayerId) return state;
        const key = `${hex.q},${hex.r}`;
        const layer = state.layers[activeLayerId];
        if (!layer) return state;

        const updatedLayer = {
            ...layer,
            data: {
                ...layer.data,
                revealedHexes: { ...layer.data.revealedHexes, [key]: true }
            }
        };
        return { layers: { ...state.layers, [activeLayerId]: updatedLayer } };
    }),
    hideHex: (hex) => set(state => {
        const { activeLayerId } = state;
        if (!activeLayerId) return state;
        const key = `${hex.q},${hex.r}`;
        const layer = state.layers[activeLayerId];
        if (!layer) return state;

        const newRevealed = { ...layer.data.revealedHexes };
        delete newRevealed[key];

        const updatedLayer = {
            ...layer,
            data: { ...layer.data, revealedHexes: newRevealed }
        };
        return { layers: { ...state.layers, [activeLayerId]: updatedLayer } };
    }),
    getRevealedHexes: () => {
        const { layers, activeLayerId } = get();
        return (activeLayerId && layers[activeLayerId]?.data.revealedHexes) || {};
    },

    generateProceduralLayer: (settings: GenerationSettings) => set(state => {
        const { activeMapId, activeLayerId } = state;
        if (!activeMapId || !activeLayerId) return state;

        const layer = state.layers[activeLayerId];
        if (!layer) return state;

        const { hexBiomes, regions, locations } = generateProceduralMapData(settings, activeMapId);

        // Update map radius if it increased
        const currentMap = state.maps[activeMapId];
        const newMapsMap = { ...state.maps };
        if (currentMap && settings.radius > (currentMap.radius || 0)) {
            newMapsMap[activeMapId] = { ...currentMap, radius: settings.radius };
        }

        // Cleanup old data to prevent orphans
        const oldRegionIds = layer.data.regions;
        const newRegionsMap = { ...state.regions };
        oldRegionIds.forEach(rid => delete newRegionsMap[rid]);
        regions.forEach(r => newRegionsMap[r.id] = r);

        const oldLocationIds = layer.data.locations;
        const newLocationsMap = { ...state.locations };
        oldLocationIds.forEach(lid => delete newLocationsMap[lid]);
        locations.forEach(l => newLocationsMap[l.id] = l);

        const updatedLayer = {
            ...layer,
            data: {
                ...layer.data,
                hexBiomes: hexBiomes,
                regions: regions.map(r => r.id),
                locations: locations.map(l => l.id)
            }
        };

        return {
            maps: newMapsMap,
            layers: { ...state.layers, [activeLayerId]: updatedLayer },
            regions: newRegionsMap,
            locations: newLocationsMap
        };
    }),

    cloneLocationToLayer: (locationId, targetLayerId) => set(state => {
        const sourceLoc = state.locations[locationId];
        const targetLayer = state.layers[targetLayerId];
        if (!sourceLoc || !targetLayer) return state;

        const newLocId = generateId();
        const newLoc: ManagedLocation = {
            ...sourceLoc,
            id: newLocId,
            lastModified: new Date(),
            createdAt: new Date()
        };

        const updatedLayer = {
            ...targetLayer,
            data: {
                ...targetLayer.data,
                locations: [...targetLayer.data.locations, newLocId]
            }
        };

        return {
            locations: { ...state.locations, [newLocId]: newLoc },
            layers: { ...state.layers, [targetLayerId]: updatedLayer }
        };
    })
});
