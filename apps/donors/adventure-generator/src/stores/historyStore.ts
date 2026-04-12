
import { create } from 'zustand';
import { GenerationHistory } from '../schemas';
import { generateId } from '../utils/helpers';
import { CONFIG } from '../data/constants';
import { useWorkflowStore } from './workflowStore';
import { useAdventureDataStore } from './adventureDataStore';
import { HistoryStateExport } from '../types/generator';

export interface HistoryState {
    generationHistory: GenerationHistory[];
}

export interface HistoryActions {
    addHistoryEntry: (
        type: GenerationHistory['type'],
        data: GenerationHistory['data'],
        label: string
    ) => void;
    restoreHistory: (entry: GenerationHistory) => void;
    getHistoryStateById: (id: string) => GenerationHistory | undefined;
    exportState: () => HistoryStateExport;
    importState: (state: Partial<HistoryStateExport>) => void;
}

const initialState: HistoryState = {
    generationHistory: [],
};

export const useHistoryStore = create<HistoryState & HistoryActions>((set, get) => ({
    ...initialState,
    addHistoryEntry: (type, data, label) => set(state => {
        const historyEntry = {
            id: generateId(),
            timestamp: new Date(),
            type,
            data,
            label
        } as GenerationHistory;
        return {
            generationHistory: [historyEntry, ...state.generationHistory.slice(0, CONFIG.HISTORY_LIMIT - 1)]
        };
    }),
    
    restoreHistory: (entry) => {
        if (entry.type === 'hooks') {
            useAdventureDataStore.setState({ adventures: entry.data.adventures, matrix: entry.data.matrix, currentAdventureCompendiumIds: [] });
            useWorkflowStore.setState({ step: 'hooks' });
        } else if (entry.type === 'outline') {
            const ids = [
                ...entry.data.scenes.map(s => s.id),
                ...entry.data.locations.map(l => l.id),
                ...entry.data.npcs.map(n => n.id),
                ...entry.data.factions.map(f => f.id)
            ];
            useAdventureDataStore.setState({ currentAdventureCompendiumIds: ids, selectedHook: entry.data.selectedHook || null });
            useWorkflowStore.setState({ step: 'outline' });
        }
    },

    getHistoryStateById: (id) => {
        return get().generationHistory.find(h => h.id === id);
    },

    exportState: (): HistoryStateExport => {
        return { generationHistory: get().generationHistory };
    },

    importState: (state) => {
        if (!state || !state.generationHistory) return;
        const revivedHistory = state.generationHistory.map(h => ({ ...h, timestamp: new Date(h.timestamp) }));
        set({ generationHistory: revivedHistory });
    }
}));
