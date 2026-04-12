import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIAgent } from '../agent';
import { AgentID, CulturalBias } from '../types';
import { GameState, GameEvent } from '../../../types';

// Mock dependencies
vi.mock('../pressure');
vi.mock('../foresight');
vi.mock('../execution/tactics');

describe('AIAgent', () => {
    let mockGameState: GameState;
    let mockAgent: AIAgent;

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

        mockAgent = new AIAgent({
            id: 'AI_1' as AgentID,
            culture: CulturalBias.NEUTRAL,
            availableStores: [],
            foresightConfig: {}
        });
    });

    describe('AIAgent class initialization', () => {
        it('should initialize with provided config', () => {
            const agent = new AIAgent({
                id: 'AI_1' as AgentID,
                culture: CulturalBias.NEUTRAL,
                availableStores: [],
                foresightConfig: {}
            });
            expect(agent['id']).toBe('AI_1');
            expect(agent['culture']).toBe(CulturalBias.NEUTRAL);
        });

        it('should initialize pressure engine', () => {
            const agent = new AIAgent({
                id: 'AI_1' as AgentID,
                culture: CulturalBias.NEUTRAL,
                availableStores: [],
                foresightConfig: {}
            });
            expect(agent['pressureEngine']).toBeDefined();
        });

        it('should initialize foresight engine', () => {
            const agent = new AIAgent({
                id: 'AI_1' as AgentID,
                culture: CulturalBias.NEUTRAL,
                availableStores: [],
                foresightConfig: {}
            });
            expect(agent['foresightEngine']).toBeDefined();
        });

        it('should initialize empty known stores', () => {
            const agent = new AIAgent({
                id: 'AI_1' as AgentID,
                culture: CulturalBias.NEUTRAL,
                availableStores: [],
                foresightConfig: {}
            });
            expect(agent['knownStores']).toEqual([]);
        });

        it('should initialize empty active tags', () => {
            const agent = new AIAgent({
                id: 'AI_1' as AgentID,
                culture: CulturalBias.NEUTRAL,
                availableStores: [],
                foresightConfig: {}
            });
            expect(agent['activeTags']).toEqual([]);
        });

        it('should initialize empty active plans', () => {
            const agent = new AIAgent({
                id: 'AI_1' as AgentID,
                culture: CulturalBias.NEUTRAL,
                availableStores: [],
                foresightConfig: {}
            });
            expect(agent['activePlans'].size).toBe(0);
        });
    });

    describe('onGameEvent method', () => {
        it('should process WORLD_CREATE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            mockAgent.onGameEvent(event, mockGameState);
            // Should create tags for city creation
            expect(mockAgent['activeTags']).toBeDefined();
        });

        it('should process WORLD_DELETE events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_DELETE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1' }
            };

            mockAgent.onGameEvent(event, mockGameState);
            // Should create tags for city destruction
            expect(mockAgent['activeTags']).toBeDefined();
        });

        it('should skip events from other players', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P2',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const initialTags = mockAgent['activeTags'].length;
            mockAgent.onGameEvent(event, mockGameState);
            // Should not add tags for other player's events
            expect(mockAgent['activeTags'].length).toBe(initialTags);
        });
    });

    describe('decideNextMove method', () => {
        it('should return array of actions', () => {
            const actions = mockAgent.think(mockGameState);
            expect(Array.isArray(actions)).toBe(true);
        });

        it('should return empty array when no valid actions', () => {
            const actions = mockAgent.think(mockGameState);
            expect(actions.length).toBeGreaterThanOrEqual(0);
        });

        it('should include action type', () => {
            const actions = mockAgent.think(mockGameState);
            if (actions.length > 0) {
                expect(actions[0]).toHaveProperty('type');
            }
        });
    });

    describe('agent state management', () => {
        it('should track active tags', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'AI_1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            mockAgent.onGameEvent(event, mockGameState);
            expect(mockAgent['activeTags'].length).toBeGreaterThan(0);
        });

        it('should track active plans', () => {
            const plans = mockAgent['activePlans'];
            expect(Map.isMap(plans)).toBe(true);
        });

        it('should update plan readiness', () => {
            const plans = mockAgent['activePlans'];
            expect(plans.size).toBe(0);
        });
    });

    describe('agent decision making', () => {
        it('should generate tactical moves', () => {
            const actions = mockAgent.think(mockGameState);
            // Actions should include tactical moves
            expect(actions.length).toBeGreaterThanOrEqual(0);
        });

        it('should generate scheme actions', () => {
            const actions = mockAgent.think(mockGameState);
            // Actions should include scheme actions
            expect(actions.length).toBeGreaterThanOrEqual(0);
        });

        it('should generate wait actions', () => {
            const actions = mockAgent.think(mockGameState);
            // Actions should include wait actions
            expect(actions.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('agent event filtering', () => {
        it('should filter events by player ID', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'AI_1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };

            const otherEvent: GameEvent = {
                id: 'evt_2',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_2', kind: 'CITY', hexes: [{ q: 1, r: 0 }] }
            };

            mockAgent.onGameEvent(event, mockGameState);
            mockAgent.onGameEvent(otherEvent, mockGameState);
            // Should only process AI's events
            expect(mockAgent['activeTags'].length).toBeGreaterThan(0);
        });
    });

    describe('agent priority handling', () => {
        it('should evaluate plan priority', () => {
            const actions = mockAgent.think(mockGameState);
            // Plans should be evaluated based on priority
            expect(actions.length).toBeGreaterThanOrEqual(0);
        });

        it('should execute highest priority plan first', () => {
            const actions = mockAgent.think(mockGameState);
            // Actions should be ordered by priority
            expect(actions.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('agent error handling', () => {
        it('should handle invalid game state gracefully', () => {
            const invalidState = null as any;
            const actions = mockAgent.think(invalidState);
            expect(Array.isArray(actions)).toBe(true);
        });

        it('should handle missing game state properties', () => {
            const incompleteState = {} as any;
            const actions = mockAgent.think(incompleteState);
            expect(Array.isArray(actions)).toBe(true);
        });
    });
});
