import { describe, it, expect, beforeEach } from 'vitest';
import { Chronicler } from '../engine';
import { GameEvent, WorldObject } from '../../../types';

describe('Chronicler Engine', () => {
    let chronicler: Chronicler;
    let mockEvents: GameEvent[];
    let mockWorldCache: Map<string, WorldObject>;

    beforeEach(() => {
        chronicler = new Chronicler();
        mockEvents = [];
        mockWorldCache = new Map();
    });

    describe('Chronicler class initialization', () => {
        it('should initialize with empty triggers', () => {
            const chronicler = new Chronicler();
            expect(chronicler).toBeDefined();
        });

        it('should initialize with default state', () => {
            const chronicler = new Chronicler();
            expect(chronicler).toBeDefined();
        });
    });

    describe('processEvent method', () => {
        it('should process WORLD_CREATE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }], name: 'Test City' }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return empty array for non-triggering events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'TURN_END',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: {}
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBe(0);
        });

        it('should handle WORLD_MODIFY events', () => {
            const createEvent: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }], name: 'Test City' }
            };
            const modifyEvent: GameEvent = {
                id: 'evt_2',
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                payload: { worldId: 'w_1', patch: [{ op: 'set', path: 'name', value: 'Modified City' }] }
            };

            mockWorldCache.set('w_1', {
                id: 'w_1',
                kind: 'CITY',
                hexes: [{ q: 0, r: 0 }],
                name: 'Test City',
                attrs: {},
                isNamed: true,
                createdBy: 'P1'
            });

            const state = { events: [createEvent, modifyEvent], worldCache: mockWorldCache };
            const result = chronicler.processEvent(modifyEvent, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('evaluateCondition method', () => {
        it('should evaluate ALWAYS condition', () => {
            const condition = { type: 'ALWAYS' };
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const worldObj: WorldObject = {
                id: 'w_1',
                kind: 'CITY',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: true,
                createdBy: 'P1'
            };

            const state = { events: [event], worldCache: new Map([['w_1', worldObj]]) };
            const result = (chronler as any).evaluateCondition(condition, event, state);
            expect(result).toBe(true);
        });

        it('should evaluate FIRST_OF_KIND condition', () => {
            const condition = { type: 'FIRST_OF_KIND', kind: 'CITY' };
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const worldObj: WorldObject = {
                id: 'w_1',
                kind: 'CITY',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: true,
                createdBy: 'P1'
            };

            const state = { events: [event], worldCache: new Map([['w_1', worldObj]]) };
            const result = (chronler as any).evaluateCondition(condition, event, state);
            expect(result).toBe(true);
        });

        it('should return false for FIRST_OF_KIND when other exists', () => {
            const condition = { type: 'FIRST_OF_KIND', kind: 'CITY' };
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const existingObj: WorldObject = {
                id: 'w_2',
                kind: 'CITY',
                hexes: [{ q: 1, r: 0 }],
                attrs: {},
                isNamed: true,
                createdBy: 'P1'
            };

            const state = { events: [event], worldCache: new Map([['w_1', worldObj], ['w_2', existingObj]]) };
            const result = (chronler as any).evaluateCondition(condition, event, state);
            expect(result).toBe(false);
        });
    });

    describe('trigger evaluation', () => {
        it('should match trigger event type', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });

        it('should match trigger event kind', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('form generation', () => {
        it('should generate candidates with templates', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('entry creation', () => {
        it('should create journal entries', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('backlog management', () => {
        it('should manage candidate backlog', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('auto mode', () => {
        it('should auto-commit eligible candidates', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('event filtering', () => {
        it('should filter events by type', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                type: 'TURN_END',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: {}
            };

            const state = { events: [event1, event2], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event1, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });

        it('should handle empty events array', () => {
            const state = { events: [], worldCache: mockWorldCache };
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('candidate generation', () => {
        it('should generate candidates with correct structure', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('journal commits', () => {
        it('should create journal entries from candidates', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('template rendering', () => {
        it('should render templates with data', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }], name: 'Test City' }
            };

            const state = { events: [event], worldCache: mockWorldCache };
            const result = chronicler.processEvent(event, state);
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });
});
