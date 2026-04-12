
import { create } from 'zustand';
import { GeneratedAdventure } from '../schemas';
import { Delve, DelveSceneNode, DelveViewState, DelveConcept } from '../types/delve';
import { AdventureDataStateExport } from '../types/generator';
import { GeneratedTrap } from '../types/trap';
import { NpcPersona } from '../types/npc';
import { EncounterTactic } from '../types/encounter';

export interface AdventureDataState {
    matrix: number[][] | null;
    adventures: GeneratedAdventure[];
    selectedHook: GeneratedAdventure | null;
    currentAdventureCompendiumIds: string[];
    activeDelve: Delve | null;
    delveView: DelveViewState;
    currentConcepts: DelveConcept[];
    activeRoomId: string | null;
    activeTraps: GeneratedTrap[];
    npcPersonas: NpcPersona[];
    encounterDesigns: EncounterTactic[];
}

export interface AdventureDataActions {
    reset: () => void;
    setActiveDelve: (delve: Delve | null) => void;
    updateDelveRoom: (updatedRoom: DelveSceneNode) => void;
    setDelveView: (view: DelveViewState) => void;
    setDelveConcept: (concept: DelveConcept) => void; // Updates activeDelve with concept info
    setCurrentConcepts: (concepts: DelveConcept[]) => void;
    setActiveRoomId: (id: string | null) => void;
    exportState: () => AdventureDataStateExport;
    importState: (state: Partial<AdventureDataStateExport>) => void;
    setActiveTraps: (traps: GeneratedTrap[]) => void;
    setNpcPersonas: (personas: NpcPersona[]) => void;
    setEncounterDesigns: (designs: EncounterTactic[]) => void;
}

const initialState: AdventureDataState = {
    matrix: null,
    adventures: [],
    selectedHook: null,
    currentAdventureCompendiumIds: [],
    activeDelve: null,
    delveView: 'setup',
    currentConcepts: [],
    activeRoomId: null,
    activeTraps: [],
    npcPersonas: [],
    encounterDesigns: [],
};

export const useAdventureDataStore = create<AdventureDataState & AdventureDataActions>((set, get) => ({
    ...initialState,
    reset: () => set(initialState),
    setActiveDelve: (delve) => set({ activeDelve: delve }),
    updateDelveRoom: (updatedRoom) => set(state => {
        if (!state.activeDelve) {
            return state;
        }
        const newRooms = state.activeDelve.rooms.map(room =>
            room.id === updatedRoom.id ? updatedRoom : room
        );
        return {
            activeDelve: {
                ...state.activeDelve,
                rooms: newRooms
            }
        };
    }),
    setDelveView: (view) => set({ delveView: view }),
    setDelveConcept: (concept) => set(state => {
        if (!state.activeDelve) return state;
        return {
            activeDelve: {
                ...state.activeDelve,
                title: concept.title,
                concept: concept,
            }
        };
    }),
    setCurrentConcepts: (concepts) => set({ currentConcepts: concepts }),
    setActiveRoomId: (id) => set({ activeRoomId: id }),
    exportState: (): AdventureDataStateExport => {
        const { matrix, adventures, selectedHook, currentAdventureCompendiumIds, activeDelve, delveView, currentConcepts, activeRoomId, activeTraps, npcPersonas, encounterDesigns } = get();
        return { matrix, adventures, selectedHook, currentAdventureCompendiumIds, activeDelve, delveView, currentConcepts, activeRoomId, activeTraps, npcPersonas, encounterDesigns };
    },
    importState: (state) => {
        if (!state) return;
        set(prev => ({
            ...prev,
            matrix: state.matrix || null,
            adventures: state.adventures || [],
            selectedHook: state.selectedHook || null,
            currentAdventureCompendiumIds: state.currentAdventureCompendiumIds || [],
            activeDelve: state.activeDelve || null,
            delveView: state.delveView || 'setup',
            currentConcepts: state.currentConcepts || [],
            activeRoomId: state.activeRoomId || null,
            activeTraps: state.activeTraps || [],
            npcPersonas: state.npcPersonas || [],
            encounterDesigns: state.encounterDesigns || [],
        }));
    },
    setActiveTraps: (traps) => set({ activeTraps: traps }),
    setNpcPersonas: (personas) => set({ npcPersonas: personas }),
    setEncounterDesigns: (designs) => set({ encounterDesigns: designs }),
}));
