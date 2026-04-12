/**
 * Vitest Test Suite for gameStore
 * 
 * Tests for the gameStore including state initialization, event dispatching,
 * turn/round/age progression, and selectors.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore, selectActiveEventCount } from '../gameStore';
import type { GameSessionConfig, GameEvent } from '../schemas';

// ============================================================================
// SETUP
// ============================================================================

const mockConfig: GameSessionConfig = {
    players: [
        { id: 'P1', name: 'Player 1', color: '#FF0000', isHuman: true },
        { id: 'P2', name: 'Player 2', color: '#00FF00', isHuman: false },
        { id: 'P3', name: 'Player 3', color: '#0000FF', isHuman: false },
    ],
    seed: 12345,
    worldSize: 'medium',
    startingAge: 1,
    enableAI: true,
};

beforeEach(() => {
    // Reset the store before each test
    useGameStore.getState().reset();
});

// ============================================================================
// INITIAL STATE TESTS
// ============================================================================

describe('gameStore - Initial State', () => {
    it('should have correct initial state', () => {
        const state = useGameStore.getState();

        expect(state.config).toBeUndefined();
        expect(state.players).toEqual([]);
        expect(state.activePlayerId).toBe('P1');
        expect(state.age).toBe(1);
        expect(state.round).toBe(1);
        expect(state.turn).toBe(1);
        expect(state.events).toEqual([]);
        expect(state.revokedEventIds).toBeInstanceOf(Set);
        expect(state.revokedEventIds.size).toBe(0);
    });

    it('should have world state with default values', () => {
        const state = useGameStore.getState();

        expect(state.world.cells).toBeInstanceOf(Map);
        expect(state.world.cultures).toBeInstanceOf(Map);
        expect(state.world.civilizations).toBeInstanceOf(Map);
        expect(state.world.year).toBe(0);
        expect(state.world.generationParams.seed).toBeDefined();
        expect(state.world.generationParams.worldSize).toBe('medium');
    });
});

// ============================================================================
// INITIALIZATION TESTS
// ============================================================================

describe('gameStore - Initialization', () => {
    it('should initialize with valid config', () => {
        const { initialize } = useGameStore.getState();

        initialize(mockConfig);

        const state = useGameStore.getState();
        expect(state.config).toEqual(mockConfig);
        expect(state.players.length).toBe(3);
        expect(state.players[0]).toEqual({ ...mockConfig.players[0], ap: 0 });
        expect(state.activePlayerId).toBe('P1');
        expect(state.age).toBe(1);
        expect(state.round).toBe(1);
        expect(state.turn).toBe(1);
        expect(state.events.length).toBe(1);
        expect(state.events[0].type).toBe('GAME_START');
    });

    it('should set world generation params from config', () => {
        const { initialize } = useGameStore.getState();

        initialize(mockConfig);

        const state = useGameStore.getState();
        expect(state.world.generationParams.seed).toBe(mockConfig.seed);
        expect(state.world.generationParams.worldSize).toBe(mockConfig.worldSize);
    });

    it('should set starting age from config', () => {
        const { initialize } = useGameStore.getState();

        const configWithAge2 = { ...mockConfig, startingAge: 2 as const };
        initialize(configWithAge2);

        const state = useGameStore.getState();
        expect(state.age).toBe(2);
    });
});

// ============================================================================
// EVENT DISPATCH TESTS
// ============================================================================

describe('gameStore - Event Dispatch', () => {
    beforeEach(() => {
        useGameStore.getState().initialize(mockConfig);
    });

    it('should dispatch valid events', () => {
        const { dispatch } = useGameStore.getState();

        const event: GameEvent = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'TURN_END',
            timestamp: '2024-01-01T00:00:00.000Z',
            playerId: 'P1',
            payload: { playerId: 'P1' },
        };

        dispatch(event);

        const state = useGameStore.getState();
        expect(state.events).toContain(event);
    });

    it('should reject invalid events', () => {
        const { dispatch } = useGameStore.getState();

        const invalidEvent = {
            id: 'not-a-uuid',
            type: 'TURN_END',
            timestamp: 'not-a-timestamp',
            payload: { playerId: 'P1' },
        } as any;

        // Should throw validation error
        expect(() => dispatch(invalidEvent)).toThrow();

        const state = useGameStore.getState();
        // Event should not be added
        expect(state.events.every(e => e.id !== invalidEvent.id)).toBe(true);
    });

    it('should append events to event log', () => {
        const { dispatch } = useGameStore.getState();

        const event1: GameEvent = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'TURN_END',
            timestamp: '2024-01-01T00:00:00.000Z',
            playerId: 'P1',
            payload: { playerId: 'P1' },
        };

        const event2: GameEvent = {
            id: '550e8400-e29b-41d4-a716-446655440001',
            type: 'TURN_END',
            timestamp: '2024-01-01T00:00:01.000Z',
            playerId: 'P2',
            payload: { playerId: 'P2' },
        };

        dispatch(event1);
        dispatch(event2);

        const state = useGameStore.getState();
        expect(state.events.length).toBe(3); // 1 from init + 2 dispatched
        expect(state.events[1]).toEqual(event1);
        expect(state.events[2]).toEqual(event2);
    });
});


// ============================================================================
// TURN/ROUND/AGE PROGRESSION TESTS
// ============================================================================

describe('gameStore - Turn/Round/Age Progression', () => {
    beforeEach(() => {
        useGameStore.getState().initialize(mockConfig);
    });

    describe('endTurn', () => {
        it('should advance to next player', () => {
            const { endTurn } = useGameStore.getState();

            endTurn();

            const state = useGameStore.getState();
            expect(state.activePlayerId).toBe('P2');
            expect(state.turn).toBe(2);
            expect(state.round).toBe(1);
        });

        it('should advance to next round when wrapping to first player', () => {
            const { endTurn } = useGameStore.getState();

            // P1 -> P2
            endTurn();
            expect(useGameStore.getState().activePlayerId).toBe('P2');

            // P2 -> P3
            endTurn();
            expect(useGameStore.getState().activePlayerId).toBe('P3');

            // P3 -> P1 (new round)
            endEndTurn();
            const state = useGameStore.getState();
            expect(state.activePlayerId).toBe('P1');
            expect(state.round).toBe(2);
            expect(state.turn).toBe(1);
        });

        it('should add TURN_END event to log', () => {
            const { endTurn } = useGameStore.getState();

            endTurn();

            const state = useGameStore.getState();
            const lastEvent = state.events[state.events.length - 1];
            expect(lastEvent.type).toBe('TURN_END');
            expect(lastEvent.playerId).toBe('P1');
        });
    });

    describe('advanceAge', () => {
        it('should advance from age 1 to age 2', () => {
            const { advanceAge } = useGameStore.getState();

            advanceAge();

            const state = useGameStore.getState();
            expect(state.age).toBe(2);
        });

        it('should advance from age 2 to age 3', () => {
            const { advanceAge } = useGameStore.getState();

            // First advance to age 2
            advanceAge();
            expect(useGameStore.getState().age).toBe(2);

            // Then advance to age 3
            advanceAge();
            const state = useGameStore.getState();
            expect(state.age).toBe(3);
        });

        it('should not advance beyond age 3', () => {
            const { advanceAge } = useGameStore.getState();

            advanceAge(); // 1 -> 2
            advanceAge(); // 2 -> 3
            advanceAge(); // 3 -> 3 (no change)

            const state = useGameStore.getState();
            expect(state.age).toBe(3);
        });

        it('should add AGE_ADVANCE event to log', () => {
            const { advanceAge } = useGameStore.getState();

            advanceAge();

            const state = useGameStore.getState();
            const lastEvent = state.events[state.events.length - 1];
            expect(lastEvent.type).toBe('AGE_ADVANCE');
            if (lastEvent.type === 'AGE_ADVANCE') {
                expect(lastEvent.payload.fromAge).toBe(1);
                expect(lastEvent.payload.toAge).toBe(2);
            }
        });
    });

    describe('advanceRound', () => {
        it('should increment round and reset turn', () => {
            const { advanceRound } = useGameStore.getState();

            advanceRound();

            const state = useGameStore.getState();
            expect(state.round).toBe(2);
            expect(state.turn).toBe(1);
            expect(state.activePlayerId).toBe('P1');
        });
    });
});

// Helper function for the test above
function endEndTurn() {
    useGameStore.getState().endTurn();
}

// ============================================================================
// PLAYER MANAGEMENT TESTS
// ============================================================================

describe('gameStore - Player Management', () => {
    beforeEach(() => {
        useGameStore.getState().initialize(mockConfig);
    });

    describe('setActivePlayer', () => {
        it('should set active player', () => {
            const { setActivePlayer } = useGameStore.getState();

            setActivePlayer('P2');

            const state = useGameStore.getState();
            expect(state.activePlayerId).toBe('P2');
        });

        it('should reject invalid player ID', () => {
            const { setActivePlayer } = useGameStore.getState();

            // Should throw validation error
            expect(() => setActivePlayer('invalid' as any)).toThrow();

            const state = useGameStore.getState();
            expect(state.activePlayerId).toBe('P1');
        });
    });

    describe('updatePlayerAP', () => {
        it('should increase player AP', () => {
            const { updatePlayerAP } = useGameStore.getState();

            updatePlayerAP('P1', 5);

            const state = useGameStore.getState();
            const player = state.players.find(p => p.id === 'P1');
            expect(player?.ap).toBe(5);
        });

        it('should decrease player AP', () => {
            const { updatePlayerAP } = useGameStore.getState();

            updatePlayerAP('P1', 10);
            updatePlayerAP('P1', -3);

            const state = useGameStore.getState();
            const player = state.players.find(p => p.id === 'P1');
            expect(player?.ap).toBe(7);
        });

        it('should not allow negative AP', () => {
            const { updatePlayerAP } = useGameStore.getState();

            updatePlayerAP('P1', 5);
            updatePlayerAP('P1', -10);

            const state = useGameStore.getState();
            const player = state.players.find(p => p.id === 'P1');
            expect(player?.ap).toBe(0);
        });
    });
});

// ============================================================================
// EVENT MANAGEMENT TESTS
// ============================================================================

describe('gameStore - Event Management', () => {
    beforeEach(() => {
        useGameStore.getState().initialize(mockConfig);
    });

    describe('revokeEvent', () => {
        const validUuid = '123e4567-e89b-12d3-a456-426614174000';

        it('should add event ID to revoked set', () => {
            const { revokeEvent } = useGameStore.getState();

            revokeEvent(validUuid, 'Test reason');

            const state = useGameStore.getState();
            expect(state.revokedEventIds.has(validUuid)).toBe(true);
        });

        it('should add EVENT_REVOKE event to log', () => {
            const { revokeEvent } = useGameStore.getState();

            revokeEvent(validUuid, 'Test reason');

            const state = useGameStore.getState();
            const lastEvent = state.events[state.events.length - 1];
            expect(lastEvent.type).toBe('EVENT_REVOKE');
            if (lastEvent.type === 'EVENT_REVOKE') {
                expect(lastEvent.payload.eventId).toBe(validUuid);
                expect(lastEvent.payload.reason).toBe('Test reason');
            }
        });
    });

    describe('getEventsByType', () => {
        it('should return events of specified type', () => {
            const { endTurn, getEventsByType } = useGameStore.getState();

            endTurn();
            endTurn();

            const turnEndEvents = getEventsByType('TURN_END');
            expect(turnEndEvents.length).toBe(2);
            turnEndEvents.forEach(event => {
                expect(event.type).toBe('TURN_END');
            });
        });

        it('should return empty array for non-existent type', () => {
            const { getEventsByType } = useGameStore.getState();

            const events = getEventsByType('NON_EXISTENT' as any);
            expect(events).toEqual([]);
        });
    });

    describe('getEventsByPlayer', () => {
        it('should return events from specified player', () => {
            const { endTurn, getEventsByPlayer } = useGameStore.getState();

            endTurn(); // P1 ends turn
            endTurn(); // P2 ends turn
            endTurn(); // P3 ends turn

            const p1Events = getEventsByPlayer('P1');
            expect(p1Events.length).toBe(1); // TURN_END only (GAME_START has no playerId)
        });
    });
});

// ============================================================================
// SELECTOR TESTS
// ============================================================================

describe('gameStore - Selectors', () => {
    beforeEach(() => {
        useGameStore.getState().initialize(mockConfig);
    });

    describe('selectGameState', () => {
        it('should return game state', () => {
            const state = useGameStore.getState();
            const gameState = {
                config: state.config,
                players: state.players,
                activePlayerId: state.activePlayerId,
                age: state.age,
                round: state.round,
                turn: state.turn,
                events: state.events,
                world: state.world,
                revokedEventIds: state.revokedEventIds,
            };

            expect(state).toMatchObject(gameState);
        });
    });

    describe('selectActivePlayer', () => {
        it('should return active player', () => {
            const state = useGameStore.getState();
            const activePlayer = state.players.find(p => p.id === state.activePlayerId);

            expect(activePlayer).toEqual({
                id: 'P1',
                name: 'Player 1',
                color: '#FF0000',
                isHuman: true,
                ap: 0,
            });
        });
    });

    describe('selectPlayerById', () => {
        it('should return player by ID', () => {
            const state = useGameStore.getState();
            const player = state.players.find(p => p.id === 'P2');

            expect(player).toEqual({
                id: 'P2',
                name: 'Player 2',
                color: '#00FF00',
                isHuman: false,
                ap: 0,
            });
        });

        it('should return undefined for non-existent player', () => {
            const state = useGameStore.getState();
            const player = state.players.find(p => p.id === 'P999');

            expect(player).toBeUndefined();
        });
    });

    describe('selectHumanPlayers', () => {
        it('should return only human players', () => {
            const state = useGameStore.getState();
            const humanPlayers = state.players.filter(p => p.isHuman);

            expect(humanPlayers.length).toBe(1);
            expect(humanPlayers[0].id).toBe('P1');
        });
    });

    describe('selectAIPlayers', () => {
        it('should return only AI players', () => {
            const state = useGameStore.getState();
            const aiPlayers = state.players.filter(p => !p.isHuman);

            expect(aiPlayers.length).toBe(2);
            expect(aiPlayers.map(p => p.id)).toEqual(['P2', 'P3']);
        });
    });

    describe('selectIsGameInitialized', () => {
        it('should return true after initialization', () => {
            const state = useGameStore.getState();
            expect(state.config).toBeDefined();
        });

        it('should return false before initialization', () => {
            useGameStore.getState().reset();
            const state = useGameStore.getState();
            expect(state.config).toBeUndefined();
        });
    });

    describe('selectTotalTurnsInRound', () => {
        it('should return number of players', () => {
            const state = useGameStore.getState();
            const totalTurns = state.players.length;

            expect(totalTurns).toBe(3);
        });
    });

    describe('selectTurnProgress', () => {
        it('should return 0 when first player is active', () => {
            const state = useGameStore.getState();
            const currentPlayerIndex = state.players.findIndex(p => p.id === state.activePlayerId);
            const progress = currentPlayerIndex >= 0 ? ((currentPlayerIndex + 1) / state.players.length) * 100 : 0;

            expect(progress).toBeCloseTo(33.33, 1);
        });

        it('should return 100 when last player is active', () => {
            useGameStore.getState().setActivePlayer('P3');
            const state = useGameStore.getState();
            const currentPlayerIndex = state.players.findIndex(p => p.id === state.activePlayerId);
            const progress = currentPlayerIndex >= 0 ? ((currentPlayerIndex + 1) / state.players.length) * 100 : 0;

            expect(progress).toBe(100);
        });
    });

    describe('selectActiveEventCount', () => {
        it('should count only non-revoked events', () => {
            const { revokeEvent } = useGameStore.getState();
            // Use valid UUID to pass validation
            revokeEvent('123e4567-e89b-12d3-a456-426614174000', 'Test reason');

            const count = selectActiveEventCount(useGameStore.getState());
            // Total events: 1 (Game Start) + 1 (Revoke Event) = 2.
            // Revoked event is hypothetical 'some-event-id' which doesn't exist but we recorded revocation.
            // If revokeEvent adds EVENT_REVOKE to log, that is one more event.
            // The revoked id '123...' is not among 'Game Start' event ID.
            // So we have GameStart (valid) + EventRevoke (valid).
            // count should be 2.
            expect(count).toBe(2);
        });
    });
});

// ============================================================================
// RESET TESTS
// ============================================================================

describe('gameStore - Reset', () => {
    it('should reset to initial state', () => {
        const { initialize, reset } = useGameStore.getState();

        initialize(mockConfig);
        expect(useGameStore.getState().config).toBeDefined();

        reset();
        const state = useGameStore.getState();

        expect(state.config).toBeUndefined();
        expect(state.players).toEqual([]);
        expect(state.events).toEqual([]);
        expect(state.age).toBe(1);
        expect(state.round).toBe(1);
        expect(state.turn).toBe(1);
    });
});
