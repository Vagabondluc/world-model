import { create } from 'zustand';

export interface Map {
    id: string;
    locationName: string;
    mapType: string;
    scale: string;
    terrain: string;
    pointsOfInterest: string;
    climate: string;
    features: string[];
    promptContext: string;
    createdAt: string;
    updatedAt?: string;
}

export interface MapState {
    // Draft State
    mapLocationName: string;
    mapType: string;
    scale: string;
    terrain: string;
    pointsOfInterest: string;
    climate: string;
    features: string[];
    mapPromptContext: string;

    // Collection state
    maps: Map[];
    selectedMapId: string | null;

    // Loading state
    isLoading: boolean;
    error: string | null;
}

export interface MapActions {
    setMapLocationName: (mapLocationName: string) => void;
    setMapType: (mapType: string) => void;
    setScale: (scale: string) => void;
    setTerrain: (terrain: string) => void;
    setPointsOfInterest: (pointsOfInterest: string) => void;
    setClimate: (climate: string) => void;
    setFeatures: (features: string[]) => void;
    setMapPromptContext: (mapPromptContext: string) => void;

    setMaps: (maps: Map[]) => void;
    addMap: (map: Map) => void;
    updateMap: (id: string, updates: Partial<Map>) => void;
    deleteMap: (id: string) => void;
    setSelectedMapId: (id: string | null) => void;
    resetMap: () => void;
}

type MapStore = MapState & MapActions;

const initialState: MapState = {
    mapLocationName: '',
    mapType: '',
    scale: '',
    terrain: '',
    pointsOfInterest: '',
    climate: '',
    features: [],
    mapPromptContext: '',

    maps: [],
    selectedMapId: null,
    isLoading: false,
    error: null,
};

export const useMapStore = create<MapStore>()((set) => ({
    ...initialState,

    setMapLocationName: (mapLocationName) => set({ mapLocationName }),
    setMapType: (mapType) => set({ mapType }),
    setScale: (scale) => set({ scale }),
    setTerrain: (terrain) => set({ terrain }),
    setPointsOfInterest: (pointsOfInterest) => set({ pointsOfInterest }),
    setClimate: (climate) => set({ climate }),
    setFeatures: (features) => set({ features }),
    setMapPromptContext: (mapPromptContext) => set({ mapPromptContext }),

    setMaps: (maps) => set({ maps }),

    addMap: (map) =>
        set((state) => ({ maps: [...state.maps, map] })),

    updateMap: (id, updates) =>
        set((state) => ({
            maps: state.maps.map((item) =>
                item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
            )
        })),

    deleteMap: (id) =>
        set((state) => ({
            maps: state.maps.filter((item) => item.id !== id),
            selectedMapId: state.selectedMapId === id ? null : state.selectedMapId
        })),

    setSelectedMapId: (id) => set({ selectedMapId: id }),

    resetMap: () => set(initialState),
}));
