import { describe, it, expect, beforeEach } from 'vitest';
import { derivePlayerState } from '../derivePlayerState';
import { GameEvent, PlayerId } from '../../types';

describe('derivePlayerState', () => {
    let mockPlayers: PlayerId[];
    let mockEvents: GameEvent[];
    let revokedIds: Set<string>;

    beforeEach(() => {
        mockPlayers = ['P1', 'P2'];
        mockEvents = [];
        revokedIds = new Set();
    });

    describe('Empty Events', () => {
        it('should return default state with no events', () => {
            const result = derivePlayerState([], revokedIds, mockPlayers);
            expect(result.P1).toBeDefined();
            expect(result.P2).toBeDefined();
            expect(result.P1.currentPower).toBe(0);
            expect(result.P1.hasRolledThisTurn).toBe(false);
            expect(result.P1.lowPowerBonus).toBe(0);
            expect(result.P1.lastTurnSpend).toBe(0);
        });
    });

    describe('POWER_ROLL event handling', () => {
        it('should add power from POWER_ROLL event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'POWER_ROLL',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { result: 10 }
            };
            const result = derivePlayerState([event], revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(10);
        });

        it('should set hasRolledThisTurn to true after POWER_ROLL', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'POWER_ROLL',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { result: 10 }
            };
            const result = derivePlayerState([event], revokedIds, mockPlayers);
            expect(result.P1.hasRolledThisTurn).toBe(true);
        });

        it('should handle multiple power rolls', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: { result: 8 }
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(18);
        });

        it('should skip revoked POWER_ROLL events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'POWER_ROLL',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { result: 10 }
            };
            revokedIds.add('evt_1');
            const result = derivePlayerState([event], revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(0);
        });
    });

    describe('TURN_END event handling', () => {
        it('should calculate lowPowerBonus when power is 5 or less', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 5 }
                },
                {
                    id: 'evt_2',
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lowPowerBonus).toBe(1);
        });

        it('should calculate lowPowerBonus when power is 0', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lowPowerBonus).toBe(1);
        });

        it('should not increase lowPowerBonus when power is greater than 5', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lowPowerBonus).toBe(0);
        });

        it('should reset lowPowerBonus to 0 when power is greater than 5', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: {}
                },
                {
                    id: 'evt_2',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_3',
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lowPowerBonus).toBe(0);
        });

        it('should cap lowPowerBonus at 3', () => {
            const events: GameEvent[] = [];
            for (let i = 0; i < 5; i++) {
                events.push({
                    id: `evt_${i}`,
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: i + 1,
                    payload: {}
                });
            }
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lowPowerBonus).toBe(3);
        });

        it('should reset lastTurnSpend on TURN_END', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] },
                    cost: 5
                },
                {
                    id: 'evt_2',
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lastTurnSpend).toBe(0);
        });
    });

    describe('lowPowerBonus calculation', () => {
        it('should increment lowPowerBonus each turn with low power', () => {
            const events: GameEvent[] = [];
            for (let i = 0; i < 3; i++) {
                events.push({
                    id: `evt_${i}`,
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: i + 1,
                    payload: {}
                });
            }
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lowPowerBonus).toBe(3);
        });

        it('should reset lowPowerBonus when power increases above 5', () => {
            const events: GameEvent[] = [
                { id: 'evt_1', type: 'TURN_END', playerId: 'P1', age: 1, round: 1, turn: 1, payload: {} },
                { id: 'evt_2', type: 'TURN_END', playerId: 'P1', age: 1, round: 1, turn: 2, payload: {} },
                { id: 'evt_3', type: 'POWER_ROLL', playerId: 'P1', age: 1, round: 1, turn: 3, payload: { result: 10 } },
                { id: 'evt_4', type: 'TURN_END', playerId: 'P1', age: 1, round: 1, turn: 3, payload: {} }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lowPowerBonus).toBe(0);
        });
    });

    describe('AP tracking across turns', () => {
        it('should track power spent on WORLD_CREATE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] },
                cost: 5
            };
            const result = derivePlayerState([event], revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(-5);
        });

        it('should track power spent on WORLD_MODIFY events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', patch: [] },
                cost: 3
            };
            const result = derivePlayerState([event], revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(-3);
        });

        it('should track power spent on WORLD_DELETE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_DELETE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1' },
                cost: 2
            };
            const result = derivePlayerState([event], revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(-2);
        });

        it('should track lastTurnSpend', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] },
                    cost: 5
                },
                {
                    id: 'evt_2',
                    type: 'WORLD_MODIFY',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { worldId: 'w_1', patch: [] },
                    cost: 3
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.lastTurnSpend).toBe(8);
        });
    });

    describe('age advancement', () => {
        it('should reset hasRolledThisTurn for all players on AGE_ADVANCE', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'POWER_ROLL',
                    playerId: 'P2',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: { result: 8 }
                },
                {
                    id: 'evt_3',
                    type: 'AGE_ADVANCE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 3,
                    payload: { from: 1, to: 2 }
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.hasRolledThisTurn).toBe(false);
            expect(result.P2.hasRolledThisTurn).toBe(false);
        });
    });

    describe('player state caching', () => {
        it('should maintain separate state for each player', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'POWER_ROLL',
                    playerId: 'P2',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: { result: 8 }
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(10);
            expect(result.P2.currentPower).toBe(8);
        });

        it('should not affect other players when one player spends power', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] },
                    cost: 5
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(5);
            expect(result.P2.currentPower).toBe(0);
        });
    });

    describe('multiple players state derivation', () => {
        it('should handle three players', () => {
            const threePlayers: PlayerId[] = ['P1', 'P2', 'P3'];
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'POWER_ROLL',
                    playerId: 'P2',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: { result: 8 }
                },
                {
                    id: 'evt_3',
                    type: 'POWER_ROLL',
                    playerId: 'P3',
                    age: 1,
                    round: 1,
                    turn: 3,
                    payload: { result: 12 }
                }
            ];
            const result = derivePlayerState(events, revokedIds, threePlayers);
            expect(result.P1.currentPower).toBe(10);
            expect(result.P2.currentPower).toBe(8);
            expect(result.P3.currentPower).toBe(12);
        });
    });

    describe('event filtering by player', () => {
        it('should only apply events to the respective player', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'WORLD_CREATE',
                    playerId: 'P2',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] },
                    cost: 5
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(10);
            expect(result.P2.currentPower).toBe(-5);
        });
    });

    describe('state invalidation', () => {
        it('should ignore events for non-existent players', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P3',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(0);
            expect(result.P2.currentPower).toBe(0);
        });
    });

    describe('AP calculation with bonuses', () => {
        it('should calculate total power with lowPowerBonus', () => {
            const events: GameEvent[] = [
                { id: 'evt_1', type: 'TURN_END', playerId: 'P1', age: 1, round: 1, turn: 1, payload: {} },
                { id: 'evt_2', type: 'TURN_END', playerId: 'P1', age: 1, round: 1, turn: 2, payload: {} },
                { id: 'evt_3', type: 'POWER_ROLL', playerId: 'P1', age: 1, round: 1, turn: 3, payload: { result: 5 } }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(5);
            expect(result.P1.lowPowerBonus).toBe(2);
        });
    });

    describe('turn order tracking', () => {
        it('should track hasRolledThisTurn per player', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'TURN_BEGIN',
                    playerId: 'P2',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.hasRolledThisTurn).toBe(true);
            expect(result.P2.hasRolledThisTurn).toBe(false);
        });

        it('should reset hasRolledThisTurn on TURN_BEGIN', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'TURN_BEGIN',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 2,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.hasRolledThisTurn).toBe(false);
        });
    });

    describe('player status updates', () => {
        it('should update all player fields correctly', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 10 }
                },
                {
                    id: 'evt_2',
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] },
                    cost: 5
                },
                {
                    id: 'evt_3',
                    type: 'TURN_END',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: {}
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(5);
            expect(result.P1.hasRolledThisTurn).toBe(true);
            expect(result.P1.lowPowerBonus).toBe(0);
            expect(result.P1.lastTurnSpend).toBe(0);
        });
    });

    describe('victory conditions', () => {
        it('should track power for victory calculation', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'POWER_ROLL',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { result: 100 }
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(100);
        });
    });

    describe('defeat conditions', () => {
        it('should track negative power for defeat conditions', () => {
            const events: GameEvent[] = [
                {
                    id: 'evt_1',
                    type: 'WORLD_CREATE',
                    playerId: 'P1',
                    age: 1,
                    round: 1,
                    turn: 1,
                    payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] },
                    cost: 50
                }
            ];
            const result = derivePlayerState(events, revokedIds, mockPlayers);
            expect(result.P1.currentPower).toBe(-50);
        });
    });
});
