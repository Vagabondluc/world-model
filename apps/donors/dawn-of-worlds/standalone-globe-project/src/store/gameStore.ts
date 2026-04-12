/**
 * Game Store - Core Game State Management
 * 
 * This store manages the core game session state including players, turns,
 * rounds, ages, and the event log. It uses Zod validation middleware to ensure
 * all state updates are type-safe and valid.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { v4 as uuidv4 } from 'uuid';

// Enable Immer MapSet plugin
enableMapSet();

import {
    GameStateSchema,
    GameEventSchema,
    PlayerIdSchema,
    GameAgeEnum,
    type GameState,
    type GameEvent,
    type Player,
    type GameSessionConfig,
    type PlayerId,
    type GameAge,
} from './schemas';
import { zodValidation } from './middleware/zodValidation';

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_STATE: GameState = {
    config: undefined,
    players: [],
    activePlayerId: 'P1',
    age: 1,
    round: 1,
    turn: 1,
    events: [],
    world: {
        cells: new Map(),
        cultures: new Map(),
        civilizations: new Map(),
        year: 0,
        generationParams: {
            seed: Date.now(),
            worldSize: 'medium',
            tectonicPlates: 7,
            erosionIterations: 100,
            temperatureVariation: 0.5,
            moistureVariation: 0.5,
        },
    },
    revokedEventIds: new Set(),
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface GameStoreState extends GameState {
    // Actions
    dispatch: (event: GameEvent) => void;
    initialize: (config: GameSessionConfig) => void;
    reset: () => void;

    // Turn Management
    endTurn: () => void;
    advanceRound: () => void;
    advanceAge: () => void;

    // Player Management
    setActivePlayer: (playerId: PlayerId) => void;
    updatePlayerAP: (playerId: PlayerId, delta: number) => void;

    // Event Management
    revokeEvent: (eventId: string, reason: string) => void;
    getEventsByType: <T extends GameEvent['type']>(type: T) => GameEvent[];
    getEventsByPlayer: (playerId: PlayerId) => GameEvent[];
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function handleGameStart(state: GameState, event: GameEvent): GameState {
    if (event.type !== 'GAME_START') return state;

    const config = event.payload;
    const players = config.players.map((p) => ({
        ...p,
        ap: 0,
    }));

    return {
        ...state,
        config,
        players,
        activePlayerId: players[0]?.id || 'P1',
        age: config.startingAge,
        round: 1,
        turn: 1,
        events: [event],
        world: {
            ...state.world,
            generationParams: {
                ...state.world.generationParams,
                seed: config.seed,
                worldSize: config.worldSize,
            },
        },
    };
}

function handleTurnEnd(state: GameState, event: GameEvent): GameState {
    if (event.type !== 'TURN_END') return state;

    const { playerId } = event.payload;
    const playerIndex = state.players.findIndex((p) => p.id === playerId);

    if (playerIndex === -1) return state;

    const nextPlayerIndex = (playerIndex + 1) % state.players.length;
    const nextPlayerId = state.players[nextPlayerIndex].id;

    let newRound = state.round;
    let newTurn = state.turn;

    if (nextPlayerIndex === 0) {
        // All players have had their turn, new round
        newRound += 1;
        newTurn = 1;
    } else {
        newTurn += 1;
    }

    return {
        ...state,
        activePlayerId: nextPlayerId,
        round: newRound,
        turn: newTurn,
        events: [...state.events, event],
    };
}

function handleAgeAdvance(state: GameState, event: GameEvent): GameState {
    if (event.type !== 'AGE_ADVANCE') return state;

    const { toAge } = event.payload;
    const validatedAge = GameAgeEnum.parse(toAge);

    return {
        ...state,
        age: validatedAge,
        events: [...state.events, event],
    };
}

function handlePowerRoll(state: GameState, event: GameEvent): GameState {
    if (event.type !== 'POWER_ROLL') return state;

    const { playerId, result } = event.payload;

    // Update player's AP based on roll result
    const updatedPlayers = state.players.map((p) =>
        p.id === playerId ? { ...p, ap: p.ap + result } : p
    );

    return {
        ...state,
        players: updatedPlayers,
        events: [...state.events, event],
    };
}

function handleEventRevoke(state: GameState, event: GameEvent): GameState {
    if (event.type !== 'EVENT_REVOKE') return state;

    const { eventId } = event.payload;

    return {
        ...state,
        revokedEventIds: new Set([...state.revokedEventIds, eventId]),
        events: [...state.events, event],
    };
}

// ============================================================================
// MAIN REDUCER
// ============================================================================

function gameReducer(state: GameState, event: GameEvent): GameState {
    switch (event.type) {
        case 'GAME_START':
            return handleGameStart(state, event);
        case 'TURN_END':
            return handleTurnEnd(state, event);
        case 'AGE_ADVANCE':
            return handleAgeAdvance(state, event);
        case 'POWER_ROLL':
            return handlePowerRoll(state, event);
        case 'EVENT_REVOKE':
            return handleEventRevoke(state, event);
        default:
            // For world events, AI events, etc., just append to event log
            return {
                ...state,
                events: [...state.events, event],
            };
    }
}

// ============================================================================
// STORE CREATION
// ============================================================================

export const useGameStore = create<GameStoreState>()(
    zodValidation({
        stateSchema: GameStateSchema,
        eventSchema: GameEventSchema,
        logErrors: true,
        throwOnError: true,
    })(
        immer((set, get) => ({
            ...INITIAL_STATE,

            /**
             * Dispatch a game event
             * Events are validated before being applied
             */
            dispatch: (event) => {
                set((state) => {
                    const newState = gameReducer(state, event);
                    Object.assign(state, newState);
                });
            },

            /**
             * Initialize a new game session
             */
            initialize: (config) => {
                const gameStartEvent: GameEvent = {
                    id: uuidv4(),
                    type: 'GAME_START',
                    timestamp: new Date().toISOString(),
                    payload: config,
                };

                set((state) => {
                    const newState = gameReducer(state, gameStartEvent);
                    Object.assign(state, newState);
                });
            },

            /**
             * Reset the store to initial state
             */
            reset: () => {
                set(INITIAL_STATE);
            },

            /**
             * End the current player's turn
             */
            endTurn: () => {
                const { activePlayerId } = get();
                const event: GameEvent = {
                    id: uuidv4(),
                    type: 'TURN_END',
                    timestamp: new Date().toISOString(),
                    playerId: activePlayerId,
                    payload: { playerId: activePlayerId },
                };

                get().dispatch(event);
            },

            /**
             * Advance to the next round
             */
            advanceRound: () => {
                set((state) => {
                    state.round += 1;
                    state.turn = 1;
                    state.activePlayerId = state.players[0]?.id || 'P1';
                });
            },

            /**
             * Advance to the next age
             */
            advanceAge: () => {
                const { age } = get();
                const nextAge = Math.min(age + 1, 3) as GameAge;

                const event: GameEvent = {
                    id: uuidv4(),
                    type: 'AGE_ADVANCE',
                    timestamp: new Date().toISOString(),
                    payload: {
                        fromAge: age,
                        toAge: nextAge,
                    },
                };

                get().dispatch(event);
            },

            /**
             * Set the active player
             */
            setActivePlayer: (playerId) => {
                PlayerIdSchema.parse(playerId);
                set((state) => {
                    state.activePlayerId = playerId;
                });
            },

            /**
             * Update a player's action points
             */
            updatePlayerAP: (playerId, delta) => {
                set((state) => {
                    const player = state.players.find((p) => p.id === playerId);
                    if (player) {
                        player.ap = Math.max(0, player.ap + delta);
                    }
                });
            },

            /**
             * Revoke a previously dispatched event
             */
            revokeEvent: (eventId, reason) => {
                const event: GameEvent = {
                    id: uuidv4(),
                    type: 'EVENT_REVOKE',
                    timestamp: new Date().toISOString(),
                    payload: { eventId, reason },
                };

                get().dispatch(event);
            },

            /**
             * Get all events of a specific type
             */
            getEventsByType: (type) => {
                return get().events.filter((e) => e.type === type);
            },

            /**
             * Get all events from a specific player
             */
            getEventsByPlayer: (playerId) => {
                return get().events.filter((e) => e.playerId === playerId);
            },
        }))
    )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get the current game state
 */
export const selectGameState = (state: GameStoreState): GameState => ({
    config: state.config,
    players: state.players,
    activePlayerId: state.activePlayerId,
    age: state.age,
    round: state.round,
    turn: state.turn,
    events: state.events,
    world: state.world,
    revokedEventIds: state.revokedEventIds,
});

/**
 * Get the active player
 */
export const selectActivePlayer = (state: GameStoreState): Player | undefined => {
    return state.players.find((p) => p.id === state.activePlayerId);
};

/**
 * Get a player by ID
 */
export const selectPlayerById = (playerId: PlayerId) => (state: GameStoreState): Player | undefined => {
    return state.players.find((p) => p.id === playerId);
};

/**
 * Get all human players
 */
export const selectHumanPlayers = (state: GameStoreState): Player[] => {
    return state.players.filter((p) => p.isHuman);
};

/**
 * Get all AI players
 */
export const selectAIPlayers = (state: GameStoreState): Player[] => {
    return state.players.filter((p) => !p.isHuman);
};

/**
 * Check if the game has been initialized
 */
export const selectIsGameInitialized = (state: GameStoreState): boolean => {
    return state.config !== undefined;
};

/**
 * Get the total number of turns in the current round
 */
export const selectTotalTurnsInRound = (state: GameStoreState): number => {
    return state.players.length;
};

/**
 * Get the current turn progress as a percentage
 */
export const selectTurnProgress = (state: GameStoreState): number => {
    const totalTurns = selectTotalTurnsInRound(state);
    const currentPlayerIndex = state.players.findIndex((p) => p.id === state.activePlayerId);
    return currentPlayerIndex >= 0 ? ((currentPlayerIndex + 1) / totalTurns) * 100 : 0;
};

/**
 * Get the total number of events (excluding revoked ones)
 */
export const selectActiveEventCount = (state: GameStoreState): number => {
    return state.events.filter((e) => !state.revokedEventIds.has(e.id)).length;
};

// ============================================================================
// EXPORTS
// ============================================================================

export type { GameStoreState };
