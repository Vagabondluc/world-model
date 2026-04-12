import { describe, it, expect, beforeEach } from 'vitest';
import {
    selectLegalActions,
    selectApRemaining,
    selectCanAdvanceAge,
    selectWorldObjectsAtHex,
    selectEventsAffectingHex,
    selectPlayerColor,
    selectPlayerConfig,
    existsKindAtHex,
    isAdjacentToKind,
    getNeighbors
} from '../selectors';
import { GameState, Hex, ActionDef, WorldObject, GameEvent, Selection } from '../../types';

describe('selectLegalActions', () => {
    let mockState: GameState;
    let mockActions: ActionDef[];
    let mockSelection: Selection;

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
            settings: { ui: { contextFilterActions: false }, turn: { minRoundsByAge: { 1: 3, 2: 5, 3: 8 }, requireAllPlayersActedToAdvance: false } }
        } as any;

        mockActions = [
            {
                id: 'ACTION_1',
                label: 'Test Action 1',
                age: 1,
                baseCost: 2,
                target: 'HEX',
                validate: () => ({ ok: true }),
                buildEvent: () => ({ type: 'TURN_BEGIN', payload: {} } as any)
            },
            {
                id: 'ACTION_2',
                label: 'Test Action 2',
                age: 2,
                baseCost: 3,
                target: 'HEX',
                validate: () => ({ ok: true }),
                buildEvent: () => ({ type: 'TURN_BEGIN', payload: {} } as any)
            }
        ];

        mockSelection = { q: 0, r: 0 };
    });

    it('should filter actions by age', () => {
        mockState.age = 1;
        const result = selectLegalActions(mockState, mockSelection, mockActions);
        expect(result.length).toBe(1);
        expect(result[0].action.id).toBe('ACTION_1');
    });

    it('should include all age-appropriate actions', () => {
        mockState.age = 2;
        const result = selectLegalActions(mockState, mockSelection, mockActions);
        expect(result.length).toBe(2);
    });

    it('should mark actions as enabled when validation passes', () => {
        const result = selectLegalActions(mockState, mockSelection, mockActions);
        expect(result[0].enabled).toBe(true);
    });

    it('should mark actions as disabled when validation fails', () => {
        const failingAction: ActionDef = {
            id: 'FAIL_ACTION',
            label: 'Failing Action',
            age: 1,
            baseCost: 2,
            target: 'HEX',
            validate: () => ({ ok: false, reason: 'Test failure' }),
            buildEvent: () => ({ type: 'TURN_BEGIN', payload: {} } as any)
        };
        const result = selectLegalActions(mockState, mockSelection, [failingAction]);
        expect(result[0].enabled).toBe(false);
        expect(result[0].reason).toBe('Test failure');
    });

    it('should apply context filter when enabled', () => {
        mockState.settings.ui.contextFilterActions = true;
        const failingAction: ActionDef = {
            id: 'FAIL_ACTION',
            label: 'Failing Action',
            age: 1,
            baseCost: 2,
            target: 'HEX',
            validate: () => ({ ok: false, reason: 'Test failure' }),
            buildEvent: () => ({ type: 'TEST', payload: {} } as any)
        };
        const result = selectLegalActions(mockState, mockSelection, mockActions.concat(failingAction));
        // Should only show enabled actions and actions from current age
        expect(result.length).toBe(1);
        expect(result[0].action.id).toBe('ACTION_1');
    });

    it('should not apply context filter when disabled', () => {
        mockState.settings.ui.contextFilterActions = false;
        const failingAction: ActionDef = {
            id: 'FAIL_ACTION',
            label: 'Failing Action',
            age: 1,
            baseCost: 2,
            target: 'HEX',
            validate: () => ({ ok: false, reason: 'Test failure' }),
            buildEvent: () => ({ type: 'TEST', payload: {} } as any)
        };
        const result = selectLegalActions(mockState, mockSelection, mockActions.concat(failingAction));
        // Should show all age-appropriate actions
        expect(result.length).toBe(2);
    });
});

describe('selectApRemaining', () => {
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

    it('should return 0 when player has no power', () => {
        mockState.playerCache = { P1: { currentPower: 0 } } as any;
        expect(selectApRemaining(mockState)).toBe(0);
    });

    it('should return current power for active player', () => {
        mockState.playerCache = { P1: { currentPower: 10 } } as any;
        expect(selectApRemaining(mockState)).toBe(10);
    });

    it('should return correct power for different active player', () => {
        mockState.activePlayerId = 'P2';
        mockState.playerCache = { P1: { currentPower: 10 }, P2: { currentPower: 5 } } as any;
        expect(selectApRemaining(mockState)).toBe(5);
    });

    it('should handle negative power', () => {
        mockState.playerCache = { P1: { currentPower: -5 } } as any;
        expect(selectApRemaining(mockState)).toBe(-5);
    });
});

describe('selectCanAdvanceAge', () => {
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
            settings: {
                ui: {},
                turn: {
                    minRoundsByAge: { 1: 3, 2: 5, 3: 8 },
                    requireAllPlayersActedToAdvance: false
                }
            }
        } as any;
    });

    it('should return false when round is less than minimum', () => {
        mockState.round = 2;
        expect(selectCanAdvanceAge(mockState)).toBe(false);
    });

    it('should return true when round meets minimum', () => {
        mockState.round = 3;
        expect(selectCanAdvanceAge(mockState)).toBe(true);
    });

    it('should return true when round exceeds minimum', () => {
        mockState.round = 5;
        expect(selectCanAdvanceAge(mockState)).toBe(true);
    });

    it('should require all players to act when setting is enabled', () => {
        mockState.settings.turn.requireAllPlayersActedToAdvance = true;
        mockState.round = 3;
        mockState.events = [
            {
                id: 'evt_1',
                type: 'TURN_BEGIN',
                playerId: 'P1',
                age: 1,
                round: 3,
                turn: 1,
                payload: {}
            }
        ];
        expect(selectCanAdvanceAge(mockState)).toBe(false);
    });

    it('should return true when all players have acted', () => {
        mockState.settings.turn.requireAllPlayersActedToAdvance = true;
        mockState.round = 3;
        mockState.events = [
            {
                id: 'evt_1',
                type: 'TURN_BEGIN',
                playerId: 'P1',
                age: 1,
                round: 3,
                turn: 1,
                payload: {}
            },
            {
                id: 'evt_2',
                type: 'TURN_BEGIN',
                playerId: 'P2',
                age: 1,
                round: 3,
                turn: 2,
                payload: {}
            }
        ];
        expect(selectCanAdvanceAge(mockState)).toBe(true);
    });

    it('should ignore revoked events when checking player actions', () => {
        mockState.settings.turn.requireAllPlayersActedToAdvance = true;
        mockState.round = 3;
        mockState.revokedEventIds.add('evt_1');
        mockState.events = [
            {
                id: 'evt_1',
                type: 'TURN_BEGIN',
                playerId: 'P1',
                age: 1,
                round: 3,
                turn: 1,
                payload: {}
            }
        ];
        expect(selectCanAdvanceAge(mockState)).toBe(false);
    });
});

describe('selectWorldObjectsAtHex', () => {
    let mockState: GameState;
    let mockHex: Hex;

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

        mockHex = { q: 0, r: 0 };
    });

    it('should return empty array when no objects at hex', () => {
        const result = selectWorldObjectsAtHex(mockState, mockHex);
        expect(result).toEqual([]);
    });

    it('should return object at hex', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 0, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const result = selectWorldObjectsAtHex(mockState, mockHex);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(obj);
    });

    it('should return multiple objects at hex', () => {
        const obj1: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 0, r: 0 }],
            attrs: {},
            isNamed: false
        };
        const obj2: WorldObject = {
            id: 'obj_2',
            kind: 'CITY',
            hexes: [{ q: 0, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj1);
        mockState.worldCache.set('obj_2', obj2);
        const result = selectWorldObjectsAtHex(mockState, mockHex);
        expect(result.length).toBe(2);
    });

    it('should not return objects at different hex', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 1, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const result = selectWorldObjectsAtHex(mockState, mockHex);
        expect(result.length).toBe(0);
    });

    it('should handle objects with multiple hexes', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 0, r: 0 }, { q: 1, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const result = selectWorldObjectsAtHex(mockState, mockHex);
        expect(result.length).toBe(1);
    });
});

describe('selectEventsAffectingHex', () => {
    let mockState: GameState;
    let mockHex: Hex;

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

        mockHex = { q: 0, r: 0 };
    });

    it('should return empty array when no events affect hex', () => {
        const result = selectEventsAffectingHex(mockState, mockHex);
        expect(result).toEqual([]);
    });

    it('should return WORLD_CREATE events at hex', () => {
        const event: GameEvent = {
            id: 'evt_1',
            type: 'WORLD_CREATE',
            playerId: 'P1',
            age: 1,
            round: 1,
            turn: 1,
            payload: { worldId: 'obj_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }] }
        };
        mockState.events = [event];
        const result = selectEventsAffectingHex(mockState, mockHex);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(event);
    });

    it('should return WORLD_MODIFY events affecting hex', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 0, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const event: GameEvent = {
            id: 'evt_1',
            type: 'WORLD_MODIFY',
            playerId: 'P1',
            age: 1,
            round: 1,
            turn: 1,
            payload: { worldId: 'obj_1', patch: [] }
        };
        mockState.events = [event];
        const result = selectEventsAffectingHex(mockState, mockHex);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(event);
    });

    it('should return WORLD_DELETE events affecting hex', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 0, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const event: GameEvent = {
            id: 'evt_1',
            type: 'WORLD_DELETE',
            playerId: 'P1',
            age: 1,
            round: 1,
            turn: 1,
            payload: { worldId: 'obj_1' }
        };
        mockState.events = [event];
        const result = selectEventsAffectingHex(mockState, mockHex);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(event);
    });

    it('should ignore revoked events', () => {
        const event: GameEvent = {
            id: 'evt_1',
            type: 'WORLD_CREATE',
            playerId: 'P1',
            age: 1,
            round: 1,
            turn: 1,
            payload: { worldId: 'obj_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }] }
        };
        mockState.events = [event];
        mockState.revokedEventIds.add('evt_1');
        const result = selectEventsAffectingHex(mockState, mockHex);
        expect(result.length).toBe(0);
    });
});

describe('selectPlayerColor', () => {
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
            config: {
                mapSize: 'STANDARD',
                players: [
                    { id: 'P1', name: 'Player 1', color: '#ff0000' },
                    { id: 'P2', name: 'Player 2', color: '#00ff00' }
                ]
            },
            settings: { ui: {}, turn: {} }
        } as any;
    });

    it('should return player color from config', () => {
        const color = selectPlayerColor(mockState, 'P1');
        expect(color).toBe('#ff0000');
    });

    it('should return default color when player not found', () => {
        const color = selectPlayerColor(mockState, 'P3');
        expect(color).toBe('#fff');
    });

    it('should return different colors for different players', () => {
        const color1 = selectPlayerColor(mockState, 'P1');
        const color2 = selectPlayerColor(mockState, 'P2');
        expect(color1).toBe('#ff0000');
        expect(color2).toBe('#00ff00');
    });
});

describe('selectPlayerConfig', () => {
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
            config: {
                mapSize: 'STANDARD',
                players: [
                    { id: 'P1', name: 'Player 1', color: '#ff0000' },
                    { id: 'P2', name: 'Player 2', color: '#00ff00' }
                ]
            },
            settings: { ui: {}, turn: {} }
        } as any;
    });

    it('should return player config for valid player', () => {
        const config = selectPlayerConfig(mockState, 'P1');
        expect(config).toBeDefined();
        expect(config?.id).toBe('P1');
        expect(config?.name).toBe('Player 1');
        expect(config?.color).toBe('#ff0000');
    });

    it('should return undefined for invalid player', () => {
        const config = selectPlayerConfig(mockState, 'P3');
        expect(config).toBeUndefined();
    });
});

describe('existsKindAtHex', () => {
    let mockState: GameState;
    let mockHex: Hex;

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

        mockHex = { q: 0, r: 0 };
    });

    it('should return false when no object of kind at hex', () => {
        const result = existsKindAtHex(mockState, mockHex, 'TERRAIN');
        expect(result).toBe(false);
    });

    it('should return true when object of kind at hex', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 0, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const result = existsKindAtHex(mockState, mockHex, 'TERRAIN');
        expect(result).toBe(true);
    });

    it('should return false when different kind at hex', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'CITY',
            hexes: [{ q: 0, r: 0 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const result = existsKindAtHex(mockState, mockHex, 'TERRAIN');
        expect(result).toBe(false);
    });
});

describe('isAdjacentToKind', () => {
    let mockState: GameState;
    let mockHex: Hex;

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

        mockHex = { q: 0, r: 0 };
    });

    it('should return false when no adjacent object of kind', () => {
        const result = isAdjacentToKind(mockState, mockHex, 'TERRAIN');
        expect(result).toBe(false);
    });

    it('should return true when adjacent object of kind', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'TERRAIN',
            hexes: [{ q: 0, r: -1 }], // Top neighbor
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const result = isAdjacentToKind(mockState, mockHex, 'TERRAIN');
        expect(result).toBe(true);
    });

    it('should return false when different kind adjacent', () => {
        const obj: WorldObject = {
            id: 'obj_1',
            kind: 'CITY',
            hexes: [{ q: 0, r: -1 }],
            attrs: {},
            isNamed: false
        };
        mockState.worldCache.set('obj_1', obj);
        const result = isAdjacentToKind(mockState, mockHex, 'TERRAIN');
        expect(result).toBe(false);
    });
});

describe('getNeighbors', () => {
    it('should return 6 neighbors for hex', () => {
        const hex: Hex = { q: 0, r: 0 };
        const neighbors = getNeighbors(hex);
        expect(neighbors.length).toBe(6);
    });

    it('should return neighbors as Hex objects', () => {
        const hex: Hex = { q: 0, r: 0 };
        const neighbors = getNeighbors(hex);
        neighbors.forEach(n => {
            expect(n).toHaveProperty('q');
            expect(n).toHaveProperty('r');
        });
    });
});

describe('selector memoization', () => {
    it('should return same result for same inputs', () => {
        const mockState = {
            events: [],
            worldCache: new Map(),
            playerCache: { P1: { currentPower: 10 } },
            activePlayerId: 'P1',
            age: 1,
            round: 1,
            turn: 1,
            revokedEventIds: new Set(),
            players: ['P1', 'P2'],
            config: { mapSize: 'STANDARD', players: [] },
            settings: { ui: {}, turn: {} }
        } as any;

        const result1 = selectApRemaining(mockState);
        const result2 = selectApRemaining(mockState);
        expect(result1).toBe(result2);
    });
});

describe('selector with empty state', () => {
    it('should handle empty world cache', () => {
        const mockState = {
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

        const result = selectWorldObjectsAtHex(mockState, { q: 0, r: 0 });
        expect(result).toEqual([]);
    });
});

describe('selector with complex state', () => {
    it('should handle multiple objects and events', () => {
        const mockState = {
            events: [
                {
                    id: 'evt_1',
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { worldId: 'obj_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }] }
                },
                {
                    id: 'evt_2',
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: { worldId: 'obj_2', kind: 'CITY', hexes: [{ q: 1, r: 0 }] }
                }
            ],
            worldCache: new Map([
                ['obj_1', { id: 'obj_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }], attrs: {}, isNamed: false }],
                ['obj_2', { id: 'obj_2', kind: 'CITY', hexes: [{ q: 1, r: 0 }], attrs: {}, isNamed: false }]
            ]),
            playerCache: { P1: { currentPower: 10 } },
            activePlayerId: 'P1',
            age: 1,
            round: 1,
            turn: 1,
            revokedEventIds: new Set(),
            players: ['P1', 'P2'],
            config: { mapSize: 'STANDARD', players: [] },
            settings: { ui: {}, turn: {} }
        } as any;

        const objects = selectWorldObjectsAtHex(mockState, { q: 0, r: 0 });
        expect(objects.length).toBe(1);
        expect(objects[0].id).toBe('obj_1');
    });
});
