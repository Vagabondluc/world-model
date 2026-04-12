import { describe, it, expect, beforeEach, vi } from 'vitest';
import { proposeTurnScopedUndo } from '../undo';
import { GameState, GameEvent } from '../../types';

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'mock-uuid-1234'
} as any;

describe('proposeTurnScopedUndo', () => {
    let mockState: GameState;

    beforeEach(() => {
        mockState = {
            events: [],
            worldCache: new Map(),
            playerCache: {},
            activePlayerId: 'P1',
            age: 1,
            round: 1,
            turn: 1,
            revokedEventIds: new Set(),
            players: ['P1', 'P2'],
            config: { mapSize: 'STANDARD', players: [] },
            settings: { ui: {}, turn: {} }
        } as any;
    });

    describe('turn-scoped undo with single action', () => {
        it('should create EVENT_REVOKE for last action in current turn', () => {
            const actionEvent: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [actionEvent];
            const result = proposeTurnScopedUndo(mockState);
            expect(result).not.toBeNull();
            expect(result?.type).toBe('EVENT_REVOKE');
            if (result?.type === 'EVENT_REVOKE') {
                expect(result.payload.targetEventIds).toEqual(['evt_1']);
                expect(result.payload.reason).toBe('User Undo');
            }
        });

        it('should return null when no events exist', () => {
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should return null when only revoked events exist', () => {
            const actionEvent: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [actionEvent];
            mockState.revokedEventIds.add('evt_1');
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });
    });

    describe('turn-scoped undo with multiple actions', () => {
        it('should revoke only the last action', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_2', kind: 'WATER', hexes: [] }
            };
            mockState.events = [event1, event2];
            const result = proposeTurnScopedUndo(mockState);
            if (result?.type === 'EVENT_REVOKE') {
                expect(result.payload.targetEventIds).toEqual(['evt_2']);
            }
        });

        it('should handle multiple actions from different players', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P2',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_2', kind: 'WATER', hexes: [] }
            };
            mockState.events = [event1, event2];
            const result = proposeTurnScopedUndo(mockState);
            if (result?.type === 'EVENT_REVOKE') {
                expect(result.payload.targetEventIds).toEqual(['evt_2']);
            }
        });
    });

    describe('undo with different event types', () => {
        it('should revoke WORLD_CREATE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.type).toBe('EVENT_REVOKE');
        });

        it('should revoke WORLD_MODIFY events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: { worldId: 'w_1', patch: [] }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.type).toBe('EVENT_REVOKE');
        });

        it('should revoke WORLD_DELETE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_DELETE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: { worldId: 'w_1' }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.type).toBe('EVENT_REVOKE');
        });
    });

    describe('undo with revoked events', () => {
        it('should skip revoked events and find last valid one', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_2', kind: 'WATER', hexes: [] }
            };
            mockState.events = [event1, event2];
            mockState.revokedEventIds.add('evt_2');
            const result = proposeTurnScopedUndo(mockState);
            if (result?.type === 'EVENT_REVOKE') {
                expect(result.payload.targetEventIds).toEqual(['evt_1']);
            }
        });
    });

    describe('undo boundary conditions', () => {
        it('should not revoke events from previous turns', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            mockState.turn = 2;
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should not revoke events from previous rounds', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            mockState.round = 2;
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should not revoke events from previous ages', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            mockState.age = 2;
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should not revoke events from other players', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P2',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            mockState.activePlayerId = 'P1';
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });
    });

    describe('undo with age advancement', () => {
        it('should not revoke AGE_ADVANCE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'AGE_ADVANCE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: { from: 1, to: 2 }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should find valid action after AGE_ADVANCE', () => {
            const ageEvent: GameEvent = {
                id: 'evt_age',
                ts: 1000,
                type: 'AGE_ADVANCE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: { from: 1, to: 2 }
            };
            const actionEvent: GameEvent = {
                id: 'evt_action',
                ts: 1001,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 2,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [ageEvent, actionEvent];
            mockState.age = 2;
            const result = proposeTurnScopedUndo(mockState);
            if (result?.type === 'EVENT_REVOKE') {
                expect(result.payload.targetEventIds).toEqual(['evt_action']);
            }
        });
    });

    describe('undo with combat events', () => {
        it('should revoke combat-related events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'ATTACK_TILE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: { targetHex: { q: 1, r: 0 } }
            } as any;
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.type).toBe('EVENT_REVOKE');
        });
    });

    describe('undo validation', () => {
        it('should not revoke TURN_BEGIN events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'TURN_BEGIN',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: {}
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should not revoke TURN_END events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'TURN_END',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: {}
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should not revoke ROUND_END events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'ROUND_END',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: {}
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should not revoke EVENT_REVOKE events recursively', () => {
            const revokeEvent: GameEvent = {
                id: 'evt_revoke',
                ts: 1000,
                type: 'EVENT_REVOKE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: { targetEventIds: ['evt_1'], reason: 'User Undo' }
            };
            mockState.events = [revokeEvent];
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });
    });

    describe('undo error handling', () => {
        it('should handle empty events array', () => {
            mockState.events = [];
            const result = proposeTurnScopedUndo(mockState);
            expect(result).toBeNull();
        });

        it('should handle events from multiple turns', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 2,
                payload: { worldId: 'w_2', kind: 'WATER', hexes: [] }
            };
            mockState.events = [event1, event2];
            mockState.turn = 2;
            const result = proposeTurnScopedUndo(mockState);
            if (result?.type === 'EVENT_REVOKE') {
                expect(result.payload.targetEventIds).toEqual(['evt_2']);
            }
        });

        it('should generate unique ID for revoke event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.id).toBe('mock-uuid-1234');
        });

        it('should set correct timestamp on revoke event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.ts).toBeDefined();
            expect(typeof result?.ts).toBe('number');
        });

        it('should set correct player ID on revoke event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.playerId).toBe('P1');
        });

        it('should set correct age, round, turn on revoke event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            mockState.events = [event];
            const result = proposeTurnScopedUndo(mockState);
            expect(result?.age).toBe(1);
            expect(result?.round).toBe(1);
            expect(result?.turn).toBe(1);
        });
    });
});
