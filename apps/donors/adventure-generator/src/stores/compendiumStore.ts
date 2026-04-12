import { create } from 'zustand';
import { LoreEntry, CompendiumEntry, CompendiumStateExport } from '../types/compendium';

export interface CompendiumState {
    loreEntries: LoreEntry[];
    compendiumEntries: CompendiumEntry[];
    
    // Navigation State
    navigationStack: string[];
    historyIndex: number;

    setLoreEntries: (entries: LoreEntry[]) => void;
    addLoreEntry: (entry: LoreEntry) => void;
    updateLoreEntry: (entry: LoreEntry) => void;
    deleteLoreEntry: (id: string) => void;
    
    setCompendiumEntries: (entries: CompendiumEntry[]) => void;
    addCompendiumEntries: (entries: CompendiumEntry[]) => void;
    updateCompendiumEntry: (entry: CompendiumEntry) => void;

    // NPC specific
    updateNpcMemory: (id: string, summary: string) => void;

    // Navigation Actions
    openEntry: (id: string) => void;
    pushEntry: (id: string) => void;
    navigateBack: () => void;
    navigateForward: () => void;
    closeDetails: () => void;

    // Session Management
    exportState: () => CompendiumStateExport;
    importState: (state: Partial<CompendiumStateExport>) => void;
}

export const useCompendiumStore = create<CompendiumState>((set, get) => ({
    loreEntries: [],
    compendiumEntries: [],
    navigationStack: [],
    historyIndex: -1,

    setLoreEntries: (loreEntries) => set({ loreEntries }),
    
    addLoreEntry: (entry) => set((state) => ({ 
        loreEntries: [...state.loreEntries, entry] 
    })),
    
    updateLoreEntry: (entry) => set((state) => ({
        loreEntries: state.loreEntries.map(e => e.id === entry.id ? entry : e)
    })),
    
    deleteLoreEntry: (id) => set((state) => ({
        loreEntries: state.loreEntries.filter(e => e.id !== id)
    })),

    setCompendiumEntries: (compendiumEntries) => set({ compendiumEntries }),

    addCompendiumEntries: (entries) => set((state) => {
        const existingIds = new Set(state.compendiumEntries.map(e => e.id));
        const newUniqueEntries = entries.filter(e => !existingIds.has(e.id));
        return { compendiumEntries: [...state.compendiumEntries, ...newUniqueEntries] };
    }),

    updateCompendiumEntry: (entry) => set((state) => ({
        compendiumEntries: state.compendiumEntries.map(e => e.id === entry.id ? entry : e)
    })),

    updateNpcMemory: (id, summary) => set((state) => {
        const entry = state.compendiumEntries.find(e => e.id === id);
        if (!entry || entry.category !== 'npc' || !entry.fullContent) return state;
        
        try {
            const details = JSON.parse(entry.fullContent);
            details.memorySummary = summary;
            const updatedEntry = { 
                ...entry, 
                fullContent: JSON.stringify(details),
                lastModified: new Date()
            };
            return {
                compendiumEntries: state.compendiumEntries.map(e => e.id === id ? updatedEntry : e)
            };
        } catch (e) {
            console.error("Failed to update NPC memory", e);
            return state;
        }
    }),

    // Navigation Actions
    openEntry: (id) => set({ navigationStack: [id], historyIndex: 0 }),
    
    pushEntry: (id) => set((state) => {
        if (state.navigationStack[state.historyIndex] === id) return {};
        const newStack = state.navigationStack.slice(0, state.historyIndex + 1);
        newStack.push(id);
        return { navigationStack: newStack, historyIndex: newStack.length - 1 };
    }),

    navigateBack: () => set((state) => ({ 
        historyIndex: Math.max(0, state.historyIndex - 1) 
    })),

    navigateForward: () => set((state) => ({ 
        historyIndex: Math.min(state.navigationStack.length - 1, state.historyIndex + 1) 
    })),

    closeDetails: () => set({ navigationStack: [], historyIndex: -1 }),
    
    exportState: (): CompendiumStateExport => {
        const { loreEntries, compendiumEntries } = get();
        return { loreEntries, compendiumEntries };
    },

    importState: (state) => {
        const revivedLore = (state.loreEntries || []).map(e => ({...e, createdAt: new Date(e.createdAt), lastModified: new Date(e.lastModified)}));
        const revivedCompendium = (state.compendiumEntries || []).map(e => ({...e, createdAt: new Date(e.createdAt), lastModified: new Date(e.lastModified)}));
        
        set({
            loreEntries: revivedLore,
            compendiumEntries: revivedCompendium,
        });
    },
}));