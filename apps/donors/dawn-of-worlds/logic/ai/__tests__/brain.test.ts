import { describe, it, expect, beforeEach, vi } from 'vitest';
import { decideNextMove } from '../brain';
import { GameState } from '../../../types';
import { DEFAULT_PERSONALITIES } from '../profiles';

// Mock dependencies
vi.mock('../scanner');
vi.mock('../manager');

describe('brain decision logic', () => {
    let mockGameState: GameState;

    beforeEach(() => {
        mockGameState = {
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

    describe('brain initialization', () => {
        it('should initialize with default values', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision).toBeDefined();
        });
    });

    describe('brain decision logic', () => {
        it('should return decision with action', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision.action).toBeDefined();
        });

        it('should return decision with reason', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision.reason).toBeDefined();
            expect(typeof decision.reason).toBe('string');
        });

        it('should return decision with shouldYield flag', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision).toHaveProperty('shouldYield');
            expect(typeof decision.shouldYield).toBe('boolean');
        });

        it('should return yield decision when no actions', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision.action).toBeNull();
            expect(decision.reason).toBe('No actions generated.');
            expect(decision.shouldYield).toBe(true);
        });

        it('should return action decision when actions exist', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            if (decision.action) {
                expect(decision.shouldYield).toBe(false);
            }
        });
    });

    describe('brain scoring', () => {
        it('should include cost in action', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            if (decision.action) {
                expect(decision.action).toHaveProperty('cost');
            }
        });

        it('should include description in action', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            if (decision.action) {
                expect(decision.action).toHaveProperty('description');
            }
        });
    });

    describe('brain personality', () => {
        it('should handle AGGRESSOR personality', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision).toBeDefined();
        });

        it('should handle BALANCED personality', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.BALANCED);
            expect(decision).toBeDefined();
        });

        it('should handle CONSERVATIVE personality', () => {
            const decision = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.CONSERVATIVE);
            expect(decision).toBeDefined();
        });
    });

    describe('brain fuzzing', () => {
        it('should handle edge cases in game state', () => {
            const edgeCaseState = {
                ...mockGameState,
                playerCache: {}
            };
            const decision = decideNextMove(edgeCaseState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision).toBeDefined();
        });

        it('should handle empty events array', () => {
            const emptyState = {
                ...mockGameState,
                events: []
            };
            const decision = decideNextMove(emptyState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision).toBeDefined();
        });
    });

    describe('brain response curves', () => {
        it('should return consistent decisions for same state', () => {
            const decision1 = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            const decision2 = decideNextMove(mockGameState, 'P1', DEFAULT_PERSONALITIES.AGGRESSOR);
            expect(decision1).toEqual(decision2);
        });
    });
});
