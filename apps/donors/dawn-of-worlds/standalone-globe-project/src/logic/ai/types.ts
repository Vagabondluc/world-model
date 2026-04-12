
export enum AIState {
    IDLE = 'IDLE',
    AWAKENING = 'AWAKENING', // Initial delay when turn starts
    DELIBERATING = 'DELIBERATING', // Scanning and Scoring
    ACTING = 'ACTING', // Executing a move
    COMBAT = 'COMBAT', // Resolving conflict
    YIELDING = 'YIELDING' // Ending turn
}

export interface AIContext {
    personaId: string;
    actionCount: number; // Actions taken this turn
}
