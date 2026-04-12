import { create } from 'zustand';
import { Combatant, FactionContext, EncounterOutcome } from '../schemas/encounter';
import { generateId } from '../utils/helpers';

interface EncounterState {
    combatants: Combatant[];
    currentTurnIndex: number;
    round: number;
    isActive: boolean;
    // Faction Clock Automation (DEC-077)
    factionContext: FactionContext[];
    outcome: EncounterOutcome | null;
    outcomeTimestamp: string | null;
}

interface EncounterActions {
    addCombatant: (combatant: Omit<Combatant, 'id'>) => void;
    removeCombatant: (id: string) => void;
    updateCombatant: (id: string, updates: Partial<Combatant>) => void;
    setInitiative: (id: string, initiative: number) => void;
    rollNPCInitiative: () => void;
    startEncounter: () => void;
    nextTurn: () => void;
    previousTurn: () => void;
    endEncounter: () => void;
    sortCombatants: () => void;
    resetEncounter: () => void; // Reset state, keep combatants
    clearEncounter: () => void; // Delete all
    setAllInitiatives: (initiatives: Record<string, number>) => void;
    // Faction Clock Automation (DEC-077)
    addFactionContext: (context: FactionContext) => void;
    removeFactionContext: (factionId: string) => void;
    updateFactionClockImpact: (factionId: string, impact: { clockId: string; impact: 'advance' | 'hinder' | 'none'; segments?: number }) => void;
    recordEncounterOutcome: (outcome: EncounterOutcome) => void;
    clearOutcome: () => void;
}

export const useEncounterStore = create<EncounterState & EncounterActions>((set, get) => ({
    combatants: [],
    currentTurnIndex: 0,
    round: 1,
    isActive: false,
    factionContext: [],
    outcome: null,
    outcomeTimestamp: null,

    addCombatant: (c) => set(state => ({
        combatants: [...state.combatants, { ...c, id: generateId() }]
    })),

    removeCombatant: (id) => set(state => {
        const idx = state.combatants.findIndex(c => c.id === id);
        if (idx === -1) return state;

        const newCombatants = state.combatants.filter(c => c.id !== id);
        let newIndex = state.currentTurnIndex;

        // Adjust index if removal affects current turn
        if (idx < state.currentTurnIndex) {
            newIndex--;
        } else if (idx === state.currentTurnIndex) {
             // If we removed the active combatant, index stays same (next guy slides in), unless we were at end
             if (newIndex >= newCombatants.length && newCombatants.length > 0) {
                 newIndex = 0;
             }
        }
        
        return {
            combatants: newCombatants,
            currentTurnIndex: Math.max(0, newIndex)
        };
    }),

    updateCombatant: (id, updates) => set(state => ({
        combatants: state.combatants.map(c => c.id === id ? { ...c, ...updates } : c)
    })),

    setInitiative: (id, val) => {
        set(state => ({
            combatants: state.combatants.map(c => c.id === id ? { ...c, initiative: val } : c)
        }));
        get().sortCombatants();
    },

    setAllInitiatives: (initiatives) => {
        set(state => ({
            combatants: state.combatants.map(c => 
                initiatives[c.id] !== undefined ? { ...c, initiative: initiatives[c.id] } : c
            )
        }));
        get().sortCombatants();
    },

    rollNPCInitiative: () => {
        set(state => ({
            combatants: state.combatants.map(c => {
                if (c.type === 'npc') {
                    const roll = Math.floor(Math.random() * 20) + 1;
                    return { ...c, initiative: roll + c.initiativeBonus };
                }
                return c;
            })
        }));
        get().sortCombatants();
    },

    sortCombatants: () => set(state => ({
        combatants: [...state.combatants].sort((a, b) => {
            if (b.initiative !== a.initiative) return b.initiative - a.initiative;
            if (a.type === 'player' && b.type === 'npc') return -1;
            if (b.type === 'player' && a.type === 'npc') return 1;
            return 0;
        })
    })),

    startEncounter: () => {
        get().sortCombatants();
        set({ isActive: true, round: 1, currentTurnIndex: 0 });
    },

    nextTurn: () => set(state => {
        if (state.combatants.length === 0) return state;
        let nextIndex = state.currentTurnIndex + 1;
        let nextRound = state.round;
        
        if (nextIndex >= state.combatants.length) {
            nextIndex = 0;
            nextRound += 1;
        }
        return { currentTurnIndex: nextIndex, round: nextRound };
    }),

    previousTurn: () => set(state => {
        if (state.combatants.length === 0) return state;
        let prevIndex = state.currentTurnIndex - 1;
        let prevRound = state.round;
        
        if (prevIndex < 0) {
            if (state.round > 1) {
                prevIndex = state.combatants.length - 1;
                prevRound = state.round - 1;
            } else {
                prevIndex = 0; // Stop at the beginning
            }
        }
        return { currentTurnIndex: prevIndex, round: prevRound };
    }),

    endEncounter: () => set({ isActive: false }),
    
    resetEncounter: () => set({ currentTurnIndex: 0, round: 1, isActive: false }),
    
    clearEncounter: () => set({ combatants: [], currentTurnIndex: 0, round: 1, isActive: false }),

    // Faction Clock Automation (DEC-077)
    addFactionContext: (context) => set(state => {
        // Check if faction already exists in context
        const existingIndex = state.factionContext.findIndex(fc => fc.factionId === context.factionId);
        if (existingIndex !== -1) {
            // Update existing faction context
            const newContext = [...state.factionContext];
            newContext[existingIndex] = context;
            return { factionContext: newContext };
        }
        // Add new faction context
        return { factionContext: [...state.factionContext, context] };
    }),

    removeFactionContext: (factionId) => set(state => ({
        factionContext: state.factionContext.filter(fc => fc.factionId !== factionId)
    })),

    updateFactionClockImpact: (factionId, impact) => set(state => {
        const newContext = state.factionContext.map(fc => {
            if (fc.factionId === factionId) {
                return {
                    ...fc,
                    clockImpact: impact
                };
            }
            return fc;
        });
        return { factionContext: newContext };
    }),

    recordEncounterOutcome: (outcome) => set({
        outcome,
        outcomeTimestamp: new Date().toISOString()
    }),

    clearOutcome: () => set({
        outcome: null,
        outcomeTimestamp: null
    })
}));
