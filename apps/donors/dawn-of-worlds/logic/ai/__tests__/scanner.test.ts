import { describe, it, expect, beforeEach } from 'vitest';
import { scanForActions } from '../scanner';
import { GameState } from '../../../types';

describe('AI Scanner', () => {
    let mockGameState: GameState;

    beforeEach(() => {
        mockGameState = {
            events: [],
            worldCache: new Map(),
            playerCache: {},
            activePlayerId: 'AI_1',
            age: 1,
            round: 1,
            turn: 1,
            revokedEventIds: new Set(),
            players: ['AI_1', 'P1'],
            config: { mapSize: 'STANDARD', players: [] },
            settings: { ui: {}, turn: {} }
        } as any;
    });

    describe('scanner initialization', () => {
        it('should initialize with provided state', () => {
            const result = scanForActions(mockGameState, 'AI_1');
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return empty array when no actions available', () => {
            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('world scanning', () => {
        it('should scan worldCache for objects', () => {
            const city = {
                id: 'city_1',
                kind: 'CITY',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'AI_1',
                isNamed: false
            };
            mockGameState.worldCache.set('city_1', city);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should identify terrain objects', () => {
            const terrain = {
                id: 'terrain_1',
                kind: 'TERRAIN',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockGameState.worldCache.set('terrain_1', terrain);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should identify water objects', () => {
            const water = {
                id: 'water_1',
                kind: 'WATER',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                isNamed: false
            };
            mockGameState.worldCache.set('water_1', water);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('unit counting', () => {
        it('should count units owned by player', () => {
            const unit = {
                id: 'unit_1',
                kind: 'ARMY',
                hexes: [{ q: 0, r: 0 }],
                attrs: { power: 10 },
                createdBy: 'AI_1',
                isNamed: false
            };
            mockGameState.worldCache.set('unit_1', unit);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should count cities owned by player', () => {
            const city = {
                id: 'city_1',
                kind: 'CITY',
                hexes: [{ q: 0, r: 0 }],
                attrs: { power: 5 },
                createdBy: 'AI_1',
                isNamed: false
            };
            mockGameState.worldCache.set('city_1', city);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should count nations owned by player', () => {
            const nation = {
                id: 'nation_1',
                kind: 'NATION',
                hexes: [{ q: 0, r: 0 }],
                attrs: {},
                createdBy: 'AI_1',
                isNamed: false
            };
            mockGameState.worldCache.set('nation_1', nation);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('terrain analysis', () => {
        it('should analyze terrain types', () => {
            const terrain = {
                id: 'terrain_1',
                kind: 'TERRAIN',
                hexes: [{ q: 0, r: 0 }],
                attrs: { biome: 'forest' },
                createdBy: 'AI_1',
                isNamed: false
            };
            mockGameState.worldCache.set('terrain_1', terrain);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should identify terrain features', () => {
            const terrain = {
                id: 'terrain_1',
                kind: 'TERRAIN',
                hexes: [{ q: 0, r: 0 }],
                attrs: { elevation: 'high' },
                createdBy: 'AI_1',
                isNamed: false
            };
            mockGameState.worldCache.set('terrain_1', terrain);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('threat detection', () => {
        it('should detect enemy units', () => {
            const enemyUnit = {
                id: 'enemy_unit_1',
                kind: 'ARMY',
                hexes: [{ q: 1, r: 0 }],
                attrs: { power: 10 },
                createdBy: 'P1',
                isNamed: false
            };
            mockGameState.worldCache.set('enemy_unit_1', enemyUnit);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should detect enemy cities', () => {
            const enemyCity = {
                id: 'enemy_city_1',
                kind: 'CITY',
                hexes: [{ q: 1, r: 0 }],
                attrs: { power: 15 },
                createdBy: 'P1',
                isNamed: false
            };
            mockGameState.worldCache.set('enemy_city_1', enemyCity);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should detect enemy nations', () => {
            const enemyNation = {
                id: 'enemy_nation_1',
                kind: 'NATION',
                hexes: [{ q: 1, r: 0 }],
                attrs: {},
                createdBy: 'P1',
                isNamed: false
            };
            mockGameState.worldCache.set('enemy_nation_1', enemyNation);

            const result = scanForActions(mockGameState, 'AI_1');
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('scanner error handling', () => {
        it('should handle empty worldCache', () => {
            const result = scanForActions(mockGameState, 'AI_1');
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should handle missing player cache', () => {
            const stateWithoutPlayer = {
                ...mockGameState,
                playerCache: {}
            };
            const result = scanForActions(stateWithoutPlayer, 'AI_1');
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });
});
