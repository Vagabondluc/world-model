
import { describe, it, expect } from 'vitest';
import { TagFactory } from './tag_factory';
import { GameEvent, GameState } from '../../../types';
import { SemanticTag } from '../types';

describe('TagFactory', () => {
    const mockState: GameState = {
        age: 1,
        round: 1,
        turn: 1,
        activePlayerId: 'P1',
        players: ['P1', 'P2'],
        events: [],
        revokedEventIds: new Set(),
        draftRollbackUsedByAge: {},
        activeSelection: { kind: 'NONE' },
        previewEvent: null,
        chronicle: {},
        worldCache: new Map(),
        playerCache: {
            'P1': { currentPower: 10, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: true },
            'P2': { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false }
        },
        onboardingStep: 'DONE',
        isHandoverActive: false,
        combatSession: null,
        settings: {} as any
    };

    it('should create OPPORTUNITY tag when receiving own POWER_ROLL', () => {
        const event: GameEvent = {
            id: 'evt_1',
            type: 'POWER_ROLL',
            playerId: 'P1',
            ts: Date.now(),
            age: 1, round: 1, turn: 1,
            payload: { result: 5 }
        };

        const tags = TagFactory.createTagsFromEvent(event, 'P1', mockState);

        expect(tags).toHaveLength(1);
        expect(tags[0].family).toBe('OPPORTUNITY');
        expect(tags[0].source).toBe('P1');
    });

    it('should NOT create tag for other players power roll (unless ENVY implemented)', () => {
        const event: GameEvent = {
            id: 'evt_2',
            type: 'POWER_ROLL',
            playerId: 'P2',
            ts: Date.now(),
            age: 1, round: 1, turn: 1,
            payload: { result: 5 }
        };

        const tags = TagFactory.createTagsFromEvent(event, 'P1', mockState);

        expect(tags).toHaveLength(0);
    });
});
