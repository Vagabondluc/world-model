
import { StateCreator } from 'zustand';
import { BiomeType, HexCoordinate, InteractionMode, ViewSettings } from '../types/location';
import { LocationStoreState } from './locationStore';

export interface ActiveFilters {
    biomes: BiomeType[];
    discoveryStatus: ('undiscovered' | 'rumored' | 'explored' | 'mapped')[];
    tags: string[];
}

export const defaultViewSettings: ViewSettings = {
    showHexGrid: true,
    showBiomeColors: true,
    showRegionBorders: true,
    showOnlyDiscovered: false,
    enableFog: false,
    fogOpacity: 1, // New: Default to fully opaque
    zoomLevel: 1,
    centerCoordinate: { q: 0, r: 0 },
    ghostModeEnabled: true,
};

export interface LocationUiState {
    viewSettings: Record<string, ViewSettings>;
    activeFilters: ActiveFilters;
    interactionMode: InteractionMode;
    selectedPaintBiome: BiomeType;
    draftRegionHexes: HexCoordinate[];
    editingRegionId: string | null; // New: Track if we are editing an existing region
    fogToolMode: 'reveal' | 'hide';
    mapNavigationStack: string[];
    activeLayerId: string | null;
    layerOrder: string[];
}

export interface LocationUiActions {
    updateViewSettings: (settings: Partial<ViewSettings>) => void;
    updateFilters: (filters: Partial<ActiveFilters>) => void;
    setInteractionMode: (mode: InteractionMode) => void;
    setSelectedPaintBiome: (biome: BiomeType) => void;
    toggleDraftHex: (hex: HexCoordinate) => void;
    setDraftHexes: (hexes: HexCoordinate[]) => void; // New: Set all draft hexes at once
    clearDraftHexes: () => void;
    setEditingRegionId: (id: string | null) => void; // New
    setFogToolMode: (mode: 'reveal' | 'hide') => void;
    getViewSettings: () => ViewSettings;
    
    // Sub-map navigation
    enterSubMap: (subMapId: string) => void;
    returnToParentMap: () => void;
    setActiveLayerId: (id: string | null) => void;
    setLayerOrder: (order: string[]) => void;
}

export const createLocationUiSlice: StateCreator<
    LocationStoreState,
    [],
    [],
    LocationUiState & LocationUiActions
> = (set, get) => ({
    viewSettings: {},
    activeFilters: { biomes: [], discoveryStatus: [], tags: [] },
    interactionMode: 'inspect',
    selectedPaintBiome: 'grassland',
    draftRegionHexes: [],
    editingRegionId: null,
    fogToolMode: 'reveal',
    mapNavigationStack: [],
    activeLayerId: null,
    layerOrder: [],

    updateViewSettings: (settings) => set(state => {
        if (!state.activeMapId) return state;
        return {
            viewSettings: {
                ...state.viewSettings,
                [state.activeMapId]: { ...get().getViewSettings(), ...settings }
            }
        };
    }),
    updateFilters: (filters) => set(state => ({ activeFilters: { ...state.activeFilters, ...filters } })),
    
    setInteractionMode: (mode) => set({ interactionMode: mode }),
    setSelectedPaintBiome: (biome) => set({ selectedPaintBiome: biome }),
    
    toggleDraftHex: (hex) => set(state => {
        const exists = state.draftRegionHexes.some(h => h.q === hex.q && h.r === hex.r);
        return { draftRegionHexes: exists ? state.draftRegionHexes.filter(h => !(h.q === hex.q && h.r === hex.r)) : [...state.draftRegionHexes, hex] };
    }),
    setDraftHexes: (hexes) => set({ draftRegionHexes: hexes }),
    clearDraftHexes: () => set({ draftRegionHexes: [] }),
    setEditingRegionId: (id) => set({ editingRegionId: id }),
    setFogToolMode: (mode) => set({ fogToolMode: mode }),

    getViewSettings: () => {
        const { viewSettings, activeMapId } = get();
        return activeMapId ? viewSettings[activeMapId] || defaultViewSettings : defaultViewSettings;
    },

    setActiveLayerId: (id) => set({ activeLayerId: id }),
    setLayerOrder: (order) => set({ layerOrder: order }),

    enterSubMap: (subMapId) => {
        const { activeMapId, mapNavigationStack, setActiveMapId } = get();
        if (activeMapId && subMapId !== activeMapId) {
            set({ mapNavigationStack: [...mapNavigationStack, activeMapId] });
            setActiveMapId(subMapId);
        }
    },

    returnToParentMap: () => {
        const { mapNavigationStack, setActiveMapId } = get();
        if (mapNavigationStack.length > 0) {
            const newStack = [...mapNavigationStack];
            const parentId = newStack.pop();
            set({ mapNavigationStack: newStack });
            setActiveMapId(parentId || null);
        }
    }
});
