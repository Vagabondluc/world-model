import { describe, it, expect, beforeEach } from 'vitest';
import { deriveWorld } from '../deriveWorld';
import { GameEvent, WorldObject, Hex, QolSettings } from '../../types';

describe('deriveWorld', () => {
    let mockSettings: QolSettings;
    let mockEvents: GameEvent[];
    let revokedIds: Set<string>;

    beforeEach(() => {
        mockSettings = {
            social: { ownershipTags: 'SOFT' }
        } as any;
        mockEvents = [];
        revokedIds = new Set();
    });

    describe('Empty Events', () => {
        it('should return empty map with no events', () => {
            const result = deriveWorld([], revokedIds, mockSettings);
            expect(result.size).toBe(0);
        });

        it('should return empty map with only revoked events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }] }
            };
            revokedIds.add('evt_1');
            const result = deriveWorld([event], revokedIds, mockSettings);
            expect(result.size).toBe(0);
        });
    });

    describe('TERRAIN_ADD Events', () => {
        it('should create terrain object from WORLD_CREATE event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'terrain_1',
                    kind: 'TERRAIN',
                    hexes: [{ q: 0, r: 0 }],
                    attrs: { biome: 'plains' }
                }
            };
            const result = deriveWorld([event], revokedIds, mockSettings);
            expect(result.size).toBe(1);
            const terrain = result.get('terrain_1');
            expect(terrain).toBeDefined();
            expect(terrain?.kind).toBe('TERRAIN');
            expect(terrain?.attrs?.biome).toBe('plains');
        });

        it('should set ownership tag when SOFT ownership is enabled', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'terrain_1',
                    kind: 'TERRAIN',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const result = deriveWorld([event], revokedIds, mockSettings);
            expect(result.get('terrain_1')?.createdBy).toBe('P1');
        });

        it('should not set ownership tag when HARD ownership is enabled', () => {
            const hardSettings = { social: { ownershipTags: 'HARD' } } as any;
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'terrain_1',
                    kind: 'TERRAIN',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const result = deriveWorld([event], revokedIds, hardSettings);
            expect(result.get('terrain_1')?.createdBy).toBeUndefined();
        });
    });

    describe('WATER_ADD Events', () => {
        it('should create water object from WORLD_CREATE event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'water_1',
                    kind: 'WATER',
                    hexes: [{ q: 0, r: 0 }],
                    attrs: { biome: 'water' }
                }
            };
            const result = deriveWorld([event], revokedIds, mockSettings);
            expect(result.size).toBe(1);
            const water = result.get('water_1');
            expect(water).toBeDefined();
            expect(water?.kind).toBe('WATER');
            expect(water?.attrs?.biome).toBe('water');
        });
    });

    describe('REGION_NAME Events', () => {
        it('should create region object with name', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: {
                    worldId: 'region_1',
                    kind: 'REGION',
                    name: 'Mystic Valley',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const result = deriveWorld([event], revokedIds, mockSettings);
            const region = result.get('region_1');
            expect(region?.name).toBe('Mystic Valley');
            expect(region?.isNamed).toBe(true);
        });

        it('should set isNamed to false for empty name', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: {
                    worldId: 'region_1',
                    kind: 'REGION',
                    name: '   ',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const result = deriveWorld([event], revokedIds, mockSettings);
            const region = result.get('region_1');
            expect(region?.isNamed).toBe(false);
        });
    });

    describe('LANDMARK_CREATE Events', () => {
        it('should create landmark object', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 3,
                payload: {
                    worldId: 'landmark_1',
                    kind: 'LANDMARK',
                    name: 'Ancient Ruins',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const result = deriveWorld([event], revokedIds, mockSettings);
            const landmark = result.get('landmark_1');
            expect(landmark?.kind).toBe('LANDMARK');
            expect(landmark?.name).toBe('Ancient Ruins');
        });
    });

    describe('mergeHexes function', () => {
        it('should merge two hex arrays without duplicates', () => {
            const hexes1: Hex[] = [{ q: 0, r: 0 }, { q: 1, r: 0 }];
            const hexes2: Hex[] = [{ q: 1, r: 0 }, { q: 2, r: 0 }];
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: hexes1 }
            };
            const modifyEvent: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: {
                    worldId: 'w_1',
                    patch: [{ op: 'addHex', hexes: hexes2 }]
                }
            };
            const result = deriveWorld([event1, modifyEvent], revokedIds, mockSettings);
            const obj = result.get('w_1');
            expect(obj?.hexes.length).toBe(3);
        });
    });

    describe('removeHexes function', () => {
        it('should remove hexes from object', () => {
            const hexes: Hex[] = [{ q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 }];
            const removeHexes: Hex[] = [{ q: 1, r: 0 }];
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes }
            };
            const modifyEvent: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: {
                    worldId: 'w_1',
                    patch: [{ op: 'removeHex', hexes: removeHexes }]
                }
            };
            const result = deriveWorld([event1, modifyEvent], revokedIds, mockSettings);
            const obj = result.get('w_1');
            expect(obj?.hexes.length).toBe(2);
            expect(obj?.hexes.find(h => h.q === 1 && h.r === 0)).toBeUndefined();
        });
    });

    describe('applyEvent with different event types', () => {
        it('should handle WORLD_CREATE event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'w_1',
                    kind: 'TERRAIN',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const result = deriveWorld([event], revokedIds, mockSettings);
            expect(result.has('w_1')).toBe(true);
        });

        it('should handle WORLD_MODIFY event', () => {
            const createEvent: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'w_1',
                    kind: 'TERRAIN',
                    name: 'Old Name',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const modifyEvent: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: {
                    worldId: 'w_1',
                    patch: [{ op: 'set', path: 'name', value: 'New Name' }]
                }
            };
            const result = deriveWorld([createEvent, modifyEvent], revokedIds, mockSettings);
            expect(result.get('w_1')?.name).toBe('New Name');
        });

        it('should handle WORLD_DELETE event', () => {
            const createEvent: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'w_1',
                    kind: 'TERRAIN',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const deleteEvent: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_DELETE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: { worldId: 'w_1' }
            };
            const result = deriveWorld([createEvent, deleteEvent], revokedIds, mockSettings);
            expect(result.has('w_1')).toBe(false);
        });
    });

    describe('WORLD_SNAPSHOT handling', () => {
        it('should restore world from snapshot', () => {
            const snapshot: WorldObject = {
                id: 'w_1',
                kind: 'TERRAIN',
                hexes: [{ q: 0, r: 0 }],
                attrs: { biome: 'plains' },
                isNamed: false
            };
            const snapshotEvent: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_SNAPSHOT',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: { cacheSnapshot: [['w_1', snapshot]] }
            };
            const result = deriveWorld([snapshotEvent], revokedIds, mockSettings);
            expect(result.has('w_1')).toBe(true);
            expect(result.get('w_1')?.kind).toBe('TERRAIN');
        });

        it('should apply events after snapshot', () => {
            const snapshot: WorldObject = {
                id: 'w_1',
                kind: 'TERRAIN',
                hexes: [{ q: 0, r: 0 }],
                attrs: { biome: 'plains' },
                isNamed: false
            };
            const snapshotEvent: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_SNAPSHOT',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: { cacheSnapshot: [['w_1', snapshot]] }
            };
            const modifyEvent: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 1,
                payload: {
                    worldId: 'w_1',
                    patch: [{ op: 'set', path: 'name', value: 'Modified' }]
                }
            };
            const result = deriveWorld([snapshotEvent, modifyEvent], revokedIds, mockSettings);
            expect(result.get('w_1')?.name).toBe('Modified');
        });
    });

    describe('event ordering in derivation', () => {
        it('should apply events in chronological order', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'w_1',
                    kind: 'TERRAIN',
                    name: 'First',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 1,
                payload: {
                    worldId: 'w_1',
                    patch: [{ op: 'set', path: 'name', value: 'Second' }]
                }
            };
            const event3: GameEvent = {
                id: 'evt_3',
                ts: 1002,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 3,
                cost: 1,
                payload: {
                    worldId: 'w_1',
                    patch: [{ op: 'set', path: 'name', value: 'Third' }]
                }
            };
            const result = deriveWorld([event1, event2, event3], revokedIds, mockSettings);
            expect(result.get('w_1')?.name).toBe('Third');
        });
    });

    describe('event revocation handling', () => {
        it('should skip revoked events', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: {
                    worldId: 'w_1',
                    kind: 'TERRAIN',
                    name: 'First',
                    hexes: [{ q: 0, r: 0 }]
                }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 1,
                payload: {
                    worldId: 'w_1',
                    patch: [{ op: 'set', path: 'name', value: 'Second' }]
                }
            };
            revokedIds.add('evt_2');
            const result = deriveWorld([event1, event2], revokedIds, mockSettings);
            expect(result.get('w_1')?.name).toBe('First');
        });

        it('should handle multiple revoked events', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    ts: 1000,
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    cost: 2,
                    payload: { worldId: 'w_1', kind: 'TERRAIN', name: 'First', hexes: [{ q: 0, r: 0 }] }
                },
                {
                    id: 'evt_2',
                    ts: 1001,
                    type: 'WORLD_MODIFY',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 2,
                    cost: 1,
                    payload: { worldId: 'w_1', patch: [{ op: 'set', path: 'name', value: 'Second' }] }
                },
                {
                    id: 'evt_3',
                    ts: 1002,
                    type: 'WORLD_MODIFY',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 3,
                    cost: 1,
                    payload: { worldId: 'w_1', patch: [{ op: 'set', path: 'name', value: 'Third' }] }
                }
            ];
            revokedIds.add('evt_2');
            revokedIds.add('evt_3');
            const result = deriveWorld(events, revokedIds, mockSettings);
            expect(result.get('w_1')?.name).toBe('First');
        });
    });

    describe('hex coordinate merging', () => {
        it('should merge hexes from multiple addHex operations', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 1,
                payload: { worldId: 'w_1', patch: [{ op: 'addHex', hexes: [{ q: 1, r: 0 }] }] }
            };
            const event3: GameEvent = {
                id: 'evt_3',
                ts: 1002,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 3,
                cost: 1,
                payload: { worldId: 'w_1', patch: [{ op: 'addHex', hexes: [{ q: 2, r: 0 }] }] }
            };
            const result = deriveWorld([event1, event2, event3], revokedIds, mockSettings);
            expect(result.get('w_1')?.hexes.length).toBe(3);
        });
    });

    describe('terrain type updates', () => {
        it('should update terrain attributes via modify', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }], attrs: { biome: 'plains' } }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 1,
                payload: { worldId: 'w_1', patch: [{ op: 'set', path: 'attrs.biome', value: 'forest' }] }
            };
            const result = deriveWorld([event1, event2], revokedIds, mockSettings);
            expect(result.get('w_1')?.attrs?.biome).toBe('forest');
        });

        it('should unset terrain attributes', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }], attrs: { biome: 'plains', elevation: 'high' } }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 1,
                payload: { worldId: 'w_1', patch: [{ op: 'unset', path: 'attrs.elevation' }] }
            };
            const result = deriveWorld([event1, event2], revokedIds, mockSettings);
            expect(result.get('w_1')?.attrs?.elevation).toBeUndefined();
            expect(result.get('w_1')?.attrs?.biome).toBe('plains');
        });
    });

    describe('water body updates', () => {
        it('should update water attributes', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 2,
                payload: { worldId: 'w_1', kind: 'WATER', hexes: [{ q: 0, r: 0 }], attrs: { biome: 'water' } }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 1,
                payload: { worldId: 'w_1', patch: [{ op: 'set', path: 'attrs.waterType', value: 'river' }] }
            };
            const result = deriveWorld([event1, event2], revokedIds, mockSettings);
            expect(result.get('w_1')?.attrs?.waterType).toBe('river');
        });
    });

    describe('landmark updates', () => {
        it('should update landmark name', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 3,
                payload: { worldId: 'w_1', kind: 'LANDMARK', name: 'Old Name', hexes: [{ q: 0, r: 0 }] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                ts: 1001,
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                cost: 1,
                payload: { worldId: 'w_1', patch: [{ op: 'set', path: 'name', value: 'New Name' }] }
            };
            const result = deriveWorld([event1, event2], revokedIds, mockSettings);
            expect(result.get('w_1')?.name).toBe('New Name');
            expect(result.get('w_1')?.isNamed).toBe(true);
        });
    });
});
