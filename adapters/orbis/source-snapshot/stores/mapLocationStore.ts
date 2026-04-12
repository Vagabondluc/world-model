import { create } from 'zustand';

export interface MapLocation {
    id: string;
    createdAt: string;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface MapLocationState {
    locationName: string;
    mapType: string;
    scale: string;
    terrain: string;
    pointsOfInterest: string[];
    climate: string;
    features: string[];
    mapPromptContext: string;
    mapLocations: MapLocation[];
    selectedMapLocationId: string | null;
    isGenerating: boolean;
    error: string | null;
}

export interface MapLocationActions {
    setLocationName: (value: string) => void;
    setMapType: (value: string) => void;
    setScale: (value: string) => void;
    setTerrain: (value: string) => void;
    setPointsOfInterest: (value: string[]) => void;
    setClimate: (value: string) => void;
    setFeatures: (value: string[]) => void;
    setMapPromptContext: (value: string) => void;
    addMapLocation: (item: MapLocation) => void;
    updateMapLocation: (id: string, updates: Partial<MapLocation>) => void;
    deleteMapLocation: (id: string) => void;
    setSelectedMapLocationId: (id: string | null) => void;
    resetMapLocation: () => void;
}

export type MapLocationStore = MapLocationState & MapLocationActions;

const initialState: MapLocationState = {
    locationName: '',
    mapType: '',
    scale: '',
    terrain: '',
    pointsOfInterest: [],
    climate: '',
    features: [],
    mapPromptContext: '',
    mapLocations: [],
    selectedMapLocationId: null,
    isGenerating: false,
    error: null,
};

export const useMapLocationStore = create<MapLocationStore>()(( set, get ) => ({
    ...initialState,
    
    setLocationName: (value) => set({ locationName: value }),
    setMapType: (value) => set({ mapType: value }),
    setScale: (value) => set({ scale: value }),
    setTerrain: (value) => set({ terrain: value }),
    setPointsOfInterest: (value) => set({ pointsOfInterest: value }),
    setClimate: (value) => set({ climate: value }),
    setFeatures: (value) => set({ features: value }),
    setMapPromptContext: (value) => set({ mapPromptContext: value }),
    
    addMapLocation: (item) => set((state) => ({ mapLocations: [...state.mapLocations, item] })),
    
    updateMapLocation: (id, updates) => set((state) => ({
        mapLocations: state.mapLocations.map((i: MapLocation) =>
            i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
        ),
    })),
    
    deleteMapLocation: (id) => set((state) => ({
        mapLocations: state.mapLocations.filter((i: MapLocation) => i.id !== id),
        selectedMapLocationId: state.selectedMapLocationId === id ? null : state.selectedMapLocationId,
    })),
    
    setSelectedMapLocationId: (id) => set({ selectedMapLocationId: id }),
    
    resetMapLocation: () => set(initialState),
}));
