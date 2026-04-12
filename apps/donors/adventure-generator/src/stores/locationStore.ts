
import { create } from 'zustand';
import { ManagedLocation, Region, WorldMap, LocationStateExport, HexCoordinate } from '../types/location';
import { createLocationDataSlice, LocationDataState, LocationDataActions } from './locationDataSlice';
import { createLocationUiSlice, LocationUiState, LocationUiActions } from './locationUiSlice';
import { GroundingService } from '../services/GroundingService';

export type LocationStoreState = LocationDataState & LocationDataActions & LocationUiState & LocationUiActions & {
    getMapList: () => WorldMap[];
    getActiveMap: () => WorldMap | null;
    getLocationList: () => ManagedLocation[];
    getRegionList: () => Region[];
    getFilteredLocationList: () => ManagedLocation[];

    getGroundingContext: (hex?: HexCoordinate) => string;
    exportState: () => LocationStateExport;
    importState: (state: Partial<LocationStateExport>) => void;
};

export const useLocationStore = create<LocationStoreState>()((set, get, api) => ({
    ...createLocationDataSlice(set, get, api),
    ...createLocationUiSlice(set, get, api),

    // Selectors that operate on the combined state
    getMapList: () => Object.values(get().maps).sort((a: WorldMap, b: WorldMap) => a.createdAt.getTime() - b.createdAt.getTime()),
    getActiveMap: () => {
        const { maps, activeMapId } = get();
        return activeMapId ? maps[activeMapId] : null;
    },
    getLocationList: () => Object.values(get().locations).filter((loc: ManagedLocation) => loc.mapId === get().activeMapId),
    getRegionList: () => Object.values(get().regions).filter((reg: Region) => reg.mapId === get().activeMapId),
    getFilteredLocationList: () => {
        const { activeMapId, activeLayerId, locations, layers } = get();
        if (!activeMapId || !activeLayerId) return [];

        const activeLayer = layers[activeLayerId];
        if (!activeLayer) return [];

        return Object.values(locations).filter((loc: ManagedLocation) => {
            if (loc.mapId !== activeMapId && loc.mapId !== activeLayerId) return false;

            if (loc.layerAssociation) {
                return loc.layerAssociation.associatedMapId === activeLayerId;
            }

            return loc.mapId === activeLayerId || loc.mapId === activeMapId;
        });
    },

    getGroundingContext: (hex?: HexCoordinate): string => {
        const { activeMapId, activeLayerId, layers, regions, locations } = get();
        if (!activeMapId || !activeLayerId) return "";

        const layer = layers[activeLayerId];
        if (!layer) return "";

        const targetHex = hex || get().getViewSettings().centerCoordinate;
        const service = new GroundingService();

        const biome = service.getEffectiveBiome(targetHex, layer, regions);
        const tags = service.getTags(targetHex, layer, locations, regions);

        // Filter locations for the active map before finding landmarks
        const mapLocations = Object.fromEntries(
            Object.entries(locations).filter(([_, loc]) => loc.mapId === activeMapId)
        );
        const landmarks = service.getNearbyLandmarks(targetHex, mapLocations, 1);

        const context = service.formatGroundingContext({ biome, tags, landmarks });
        return service.truncateContext(context, 1000); // ~250 tokens
    },

    // Session management
    exportState: (): LocationStateExport => {
        const { maps, activeMapId, locations, regions, layers, viewSettings } = get();
        return { maps, activeMapId, locations, regions, layers, viewSettings };
    },
    importState: (state) => {
        if (!state) return;

        // V2 session file with layers
        if (state.layers) {
            const firstMapId = Object.keys(state.maps || {})[0] || null;
            const activeMap = firstMapId ? (state.maps || {})[firstMapId] : null;
            const layerOrder = activeMap?.layerOrder || [];

            set(prev => ({
                ...prev,
                maps: state.maps || {},
                activeMapId: state.activeMapId || firstMapId,
                locations: state.locations || {},
                regions: state.regions || {},
                layers: state.layers || {},
                viewSettings: state.viewSettings || {},
                // UI state
                layerOrder: layerOrder,
                activeLayerId: layerOrder[0] || null,
            }));
            return;
        }

        // Fallback for legacy state (V1) if needed
        const firstMapId = Object.keys(state.maps || {})[0] || null;
        set(prev => ({
            ...prev,
            maps: state.maps || {},
            activeMapId: state.activeMapId || firstMapId,
            locations: state.locations || {},
            regions: state.regions || {},
            // Initialize empty layers if importing legacy
            layers: {},
            viewSettings: state.viewSettings || {},
        }));
    }
}));
