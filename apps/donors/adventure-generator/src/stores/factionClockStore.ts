import { create } from 'zustand';
import { FactionClock, ClockEvent, ResolutionMethod, FactionClockSchema } from '../schemas/faction';

/**
 * Result of rolling a faction clock for downtime advancement
 */
export interface ClockRollResult {
    clockId: string;
    factionId: string;
    rolled: boolean;
    advanced: boolean;
    segmentsAdvanced: number;
    rollValue?: number;
    checkPassed?: boolean;
    event?: ClockEvent;
}

/**
 * State for faction clock management
 */
export interface FactionClockState {
    // Clocks by faction ID
    clocks: Record<string, FactionClock[]>;
    
    // Editing state
    editingClock: { factionId: string; clockId: string } | null;
    isClockFormOpen: boolean;
    
    // Downtime rolling state
    isRolling: boolean;
    rollResults: ClockRollResult[];
    
    // Clock CRUD Operations
    addClock: (factionId: string, clock: FactionClock) => void;
    updateClock: (factionId: string, clockId: string, updates: Partial<FactionClock>) => void;
    deleteClock: (factionId: string, clockId: string) => void;
    getClocks: (factionId: string) => FactionClock[];
    
    // Progress Management
    advanceClock: (factionId: string, clockId: string, segments: number, triggeredBy: 'downtime' | 'encounter' | 'manual', description?: string) => void;
    resetClock: (factionId: string, clockId: string) => void;
    
    // Clock Resolution Logic
    rollClock: (factionId: string, clockId: string) => ClockRollResult | null;
    rollAllClocks: (factionId: string) => ClockRollResult[];
    
    // Completion Handling
    handleClockCompletion: (factionId: string, clockId: string) => void;
    
    // UI State Management
    openClockForm: (factionId: string, clockId?: string) => void;
    closeClockForm: () => void;
    setRolling: (isRolling: boolean) => void;
    
    // Utility
    clearRollResults: () => void;
}

/**
 * Utility function to generate a unique ID for clocks
 */
function generateClockId(): string {
    return `clock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Utility function to roll a die and get the result
 */
function rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
}

/**
 * Utility function to create a clock event
 */
function createClockEvent(
    segment: number,
    description: string,
    triggeredBy: 'downtime' | 'encounter' | 'manual'
): ClockEvent {
    return {
        segment,
        description,
        timestamp: new Date().toISOString(),
        triggeredBy
    };
}

/**
 * Zustand store for managing faction clocks
 * 
 * This store handles:
 * - CRUD operations for faction clocks
 * - Progress advancement and tracking
 * - Clock resolution methods (simple, complex, blended)
 * - Completion handling with ally/enemy cascades
 * - UI state management for clock forms and rolling
 */
export const useFactionClockStore = create<FactionClockState>((set, get) => ({
    // Initial State
    clocks: {},
    editingClock: null,
    isClockFormOpen: false,
    isRolling: false,
    rollResults: [],
    
    /**
     * Add a new clock to a faction
     * Validates the clock using Zod schema before adding
     */
    addClock: (factionId: string, clock: FactionClock) => {
        // Validate the clock using Zod schema
        const validatedClock = FactionClockSchema.parse(clock);
        
        set((state) => {
            const factionClocks = state.clocks[factionId] || [];
            return {
                clocks: {
                    ...state.clocks,
                    [factionId]: [...factionClocks, validatedClock]
                }
            };
        });
    },
    
    /**
     * Update an existing clock with partial updates
     * Validates the updated clock using Zod schema
     */
    updateClock: (factionId: string, clockId: string, updates: Partial<FactionClock>) => {
        set((state) => {
            const factionClocks = state.clocks[factionId] || [];
            const clockIndex = factionClocks.findIndex(c => c.id === clockId);
            
            if (clockIndex === -1) return state;
            
            const updatedClock = { ...factionClocks[clockIndex], ...updates };
            const validatedClock = FactionClockSchema.parse(updatedClock);
            
            const newClocks = [...factionClocks];
            newClocks[clockIndex] = validatedClock;
            
            return {
                clocks: {
                    ...state.clocks,
                    [factionId]: newClocks
                }
            };
        });
    },
    
    /**
     * Delete a clock from a faction
     */
    deleteClock: (factionId: string, clockId: string) => {
        set((state) => {
            const factionClocks = state.clocks[factionId] || [];
            return {
                clocks: {
                    ...state.clocks,
                    [factionId]: factionClocks.filter(c => c.id !== clockId)
                }
            };
        });
    },
    
    /**
     * Get all clocks for a faction
     */
    getClocks: (factionId: string) => {
        return get().clocks[factionId] || [];
    },
    
    /**
     * Advance a clock by a specified number of segments
     * Creates a clock event to track the advancement
     */
    advanceClock: (factionId: string, clockId: string, segments: number, triggeredBy: 'downtime' | 'encounter' | 'manual', description?: string) => {
        set((state) => {
            const factionClocks = state.clocks[factionId] || [];
            const clockIndex = factionClocks.findIndex(c => c.id === clockId);
            
            if (clockIndex === -1) return state;
            
            const clock = factionClocks[clockIndex];
            const newProgress = Math.min(clock.progress + segments, clock.segments);
            
            // Create event for this advancement
            const event = createClockEvent(
                newProgress,
                description || `Advanced ${segments} segment${segments !== 1 ? 's' : ''}`,
                triggeredBy
            );
            
            const updatedClock: FactionClock = {
                ...clock,
                progress: newProgress,
                events: [...clock.events, event]
            };
            
            const newClocks = [...factionClocks];
            newClocks[clockIndex] = updatedClock;
            
            // Check if clock is now complete
            if (newProgress >= clock.segments) {
                // Schedule completion handling for next tick
                setTimeout(() => {
                    get().handleClockCompletion(factionId, clockId);
                }, 0);
            }
            
            return {
                clocks: {
                    ...state.clocks,
                    [factionId]: newClocks
                }
            };
        });
    },
    
    /**
     * Reset a clock's progress to 0
     * Clears all events
     */
    resetClock: (factionId: string, clockId: string) => {
        set((state) => {
            const factionClocks = state.clocks[factionId] || [];
            const clockIndex = factionClocks.findIndex(c => c.id === clockId);
            
            if (clockIndex === -1) return state;
            
            const updatedClock: FactionClock = {
                ...factionClocks[clockIndex],
                progress: 0,
                events: []
            };
            
            const newClocks = [...factionClocks];
            newClocks[clockIndex] = updatedClock;
            
            return {
                clocks: {
                    ...state.clocks,
                    [factionId]: newClocks
                }
            };
        });
    },
    
    /**
     * Roll a single clock for downtime advancement
     * Uses the clock's resolution method to determine if it advances
     * 
     * Resolution methods:
     * - Simple: 1d6 roll, advance 1 segment on 1
     * - Complex: Skill check vs DC, advance 1 segment on success
     * - Blended: 1d4 roll, advance 1 segment on 1
     */
    rollClock: (factionId: string, clockId: string) => {
        const { clocks } = get();
        const factionClocks = clocks[factionId] || [];
        const clock = factionClocks.find(c => c.id === clockId);
        
        if (!clock) return null;
        
        let rolled = true;
        let advanced = false;
        let segmentsAdvanced = 0;
        let rollValue: number | undefined;
        let checkPassed: boolean | undefined;
        let event: ClockEvent | undefined;
        
        switch (clock.resolutionMethod) {
            case 'simple':
                // 1d6 roll, advance 1 segment on 1
                rollValue = rollDie(6);
                advanced = rollValue === 1;
                break;
                
            case 'complex':
                // Skill check vs DC, advance 1 segment on success
                // For now, we'll simulate a check with a random roll + assumed modifier
                // In a full implementation, this would integrate with character stats
                const assumedModifier = 5; // Average PC modifier
                rollValue = rollDie(20) + assumedModifier;
                checkPassed = rollValue >= (clock.difficultyDC || 15);
                advanced = checkPassed;
                break;
                
            case 'blended':
                // 1d4 roll, advance 1 segment on 1
                rollValue = rollDie(4);
                advanced = rollValue === 1;
                break;
        }
        
        if (advanced) {
            segmentsAdvanced = 1;
            event = createClockEvent(
                clock.progress + 1,
                `Downtime roll: ${clock.resolutionMethod} method (${rollValue}${checkPassed !== undefined ? ` vs DC ${clock.difficultyDC || 15}` : ''})`,
                'downtime'
            );
            
            // Apply the advancement
            get().advanceClock(factionId, clockId, segmentsAdvanced, 'downtime', event.description);
        }
        
        return {
            clockId,
            factionId,
            rolled,
            advanced,
            segmentsAdvanced,
            rollValue,
            checkPassed,
            event
        };
    },
    
    /**
     * Roll all clocks for a faction during downtime
     * Returns an array of roll results
     */
    rollAllClocks: (factionId: string) => {
        const { clocks } = get();
        const factionClocks = clocks[factionId] || [];
        
        const results: ClockRollResult[] = factionClocks.map(clock => {
            const result = get().rollClock(factionId, clock.id);
            return result || {
                clockId: clock.id,
                factionId,
                rolled: false,
                advanced: false,
                segmentsAdvanced: 0
            };
        });
        
        set({ rollResults: results });
        
        return results;
    },
    
    /**
     * Handle clock completion when a clock fills completely
     * 
     * Triggers:
     * - Generate "Goal Achieved" event
     * - Check ally clocks (advance progress)
     * - Check enemy clocks (add complications)
     * - Optionally create new clock (not implemented here, would require user input)
     */
    handleClockCompletion: (factionId: string, clockId: string) => {
        const { clocks } = get();
        const factionClocks = clocks[factionId] || [];
        const clock = factionClocks.find(c => c.id === clockId);
        
        if (!clock || clock.progress < clock.segments) return;
        
        // Add completion event
        const completionEvent = createClockEvent(
            clock.segments,
            'Goal Achieved!',
            'manual'
        );
        
        // Update the clock with the completion event
        get().updateClock(factionId, clockId, {
            events: [...clock.events, completionEvent]
        });
        
        // Check ally clocks - advance them by 1 segment
        clock.allies.forEach(allyId => {
            const allyClocks = clocks[allyId] || [];
            allyClocks.forEach(allyClock => {
                if (allyClock.progress < allyClock.segments) {
                    get().advanceClock(
                        allyId,
                        allyClock.id,
                        1,
                        'manual',
                        `Ally clock advanced: ${clock.objective} achieved`
                    );
                }
            });
        });
        
        // Check enemy clocks - add complications (advance by 1-2 segments)
        clock.enemies.forEach(enemyId => {
            const enemyClocks = clocks[enemyId] || [];
            enemyClocks.forEach(enemyClock => {
                if (enemyClock.progress < enemyClock.segments) {
                    const complicationSegments = rollDie(2); // 1-2 segments
                    get().advanceClock(
                        enemyId,
                        enemyClock.id,
                        complicationSegments,
                        'manual',
                        `Complication: Enemy faction ${clock.objective} achieved`
                    );
                }
            });
        });
        
        // Note: Creating a new clock would require user input for the new objective
        // This could be handled by the UI component after completion
    },
    
    /**
     * Open the clock form for creating or editing a clock
     */
    openClockForm: (factionId: string, clockId?: string) => {
        set({
            isClockFormOpen: true,
            editingClock: clockId ? { factionId, clockId } : null
        });
    },
    
    /**
     * Close the clock form
     */
    closeClockForm: () => {
        set({
            isClockFormOpen: false,
            editingClock: null
        });
    },
    
    /**
     * Set the rolling state for UI feedback
     */
    setRolling: (isRolling: boolean) => {
        set({ isRolling });
    },
    
    /**
     * Clear the roll results
     */
    clearRollResults: () => {
        set({ rollResults: [] });
    }
}));
