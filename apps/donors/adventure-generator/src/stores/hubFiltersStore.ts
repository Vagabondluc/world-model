
import { create } from 'zustand';
import { HubFiltersStateExport } from '../types/generator';

export interface HubFiltersState {
    searchQuery: string;
    filterLocationId: string;
    filterFactionId: string;
}

export interface HubFiltersActions {
    updateFilters: (filters: Partial<HubFiltersState>) => void;
    exportState: () => HubFiltersStateExport;
    importState: (state: Partial<HubFiltersStateExport>) => void;
}

const initialState: HubFiltersState = {
    searchQuery: '',
    filterLocationId: '',
    filterFactionId: '',
};

export const useHubFiltersStore = create<HubFiltersState & HubFiltersActions>((set, get) => ({
    ...initialState,
    updateFilters: (filters) => set(state => ({ ...state, ...filters })),
    exportState: (): HubFiltersStateExport => {
        const { searchQuery, filterLocationId, filterFactionId } = get();
        return { searchQuery, filterLocationId, filterFactionId };
    },
    importState: (state) => {
        if (!state) return;
        set(prev => ({
            ...prev,
            searchQuery: state.searchQuery || '',
            filterLocationId: state.filterLocationId || '',
            filterFactionId: state.filterFactionId || '',
        }));
    }
}));
