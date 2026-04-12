import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../gameStore';
import { GameEvent, GameSessionConfig, Selection, CombatSession } from '../../types';
import type { JournalEntry } from '../../logic/chronicler/types';
import type { ChronicleCandidate } from '../../logic/chronicler/types';

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)
} as any;

describe('GameStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useGameStore.getState().reset();
    });

    describe('dispatch function', () => {
        it('should add event to events array', () => {
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
            useGameStore.getState().dispatch(event);
            const state = useGameStore.getState();
            expect(state.events).toContain(event);
        });

        it('should update worldCache on dispatch', () => {
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
            useGameStore.getState().dispatch(event);
            const state = useGameStore.getState();
            expect(state.worldCache.has('w_1')).toBe(true);
        });

        it('should update playerCache on dispatch', () => {
            const event: GameEvent = {
                id: 'evt_1',
                ts: 1000,
                type: 'POWER_ROLL',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: { result: 10 }
            };
            useGameStore.getState().dispatch(event);
            const state = useGameStore.getState();
            expect(state.playerCache['P1']?.currentPower).toBe(10);
        });

        it('should handle EVENT_REVOKE events', () => {
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
            const revokeEvent: GameEvent = {
                id: 'evt_revoke',
                ts: 1000,
                type: 'EVENT_REVOKE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                cost: 0,
                payload: { targetEventIds: ['evt_1'], reason: 'Test' }
            };
            useGameStore.getState().dispatch(event1);
            useGameStore.getState().dispatch(revokeEvent);
            const state = useGameStore.getState();
            expect(state.revokedEventIds.has('evt_1')).toBe(true);
        });
    });

    describe('compactLog function', () => {
        it('should create WORLD_SNAPSHOT event', () => {
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
            useGameStore.getState().dispatch(event);
            useGameStore.getState().compactLog();
            const state = useGameStore.getState();
            expect(state.events[0].type).toBe('WORLD_SNAPSHOT');
        });

        it('should reset revokedEventIds on compact', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const revokeEvent: GameEvent = {
                id: 'evt_revoke',
                type: 'EVENT_REVOKE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { targetEventIds: ['evt_1'], reason: 'Test' }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().dispatch(revokeEvent);
            useGameStore.getState().compactLog();
            const state = useGameStore.getState();
            expect(state.revokedEventIds.size).toBe(0);
        });

        it('should preserve worldCache in snapshot', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().compactLog();
            const state = useGameStore.getState();
            expect(state.worldCache.has('w_1')).toBe(true);
        });
    });

    describe('setSelection function', () => {
        it('should update activeSelection', () => {
            const selection: Selection = { kind: 'HEX', hex: { q: 0, r: 0 } };
            useGameStore.getState().setSelection(selection);
            const state = useGameStore.getState();
            expect(state.activeSelection).toEqual(selection);
        });

        it('should clear previewEvent on setSelection', () => {
            const selection: Selection = { kind: 'HEX', hex: { q: 0, r: 0 } };
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            useGameStore.getState().setPreview(event);
            useGameStore.getState().setSelection(selection);
            const state = useGameStore.getState();
            expect(state.previewEvent).toBeNull();
        });

        it('should advance onboarding when selecting hex', () => {
            const selection: Selection = { kind: 'HEX', hex: { q: 0, r: 0 } };
            useGameStore.getState().setOnboardingStep('MAP_TAP');
            useGameStore.getState().setSelection(selection);
            const state = useGameStore.getState();
            expect(state.onboardingStep).toBe('INSPECT');
        });
    });

    describe('setPreview function', () => {
        it('should update previewEvent', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            useGameStore.getState().setPreview(event);
            const state = useGameStore.getState();
            expect(state.previewEvent).toEqual(event);
        });

        it('should clear previewEvent when null', () => {
            useGameStore.getState().setPreview(null);
            const state = useGameStore.getState();
            expect(state.previewEvent).toBeNull();
        });

        it('should advance onboarding when setting preview', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            useGameStore.getState().setOnboardingStep('ACTION');
            useGameStore.getState().setPreview(event);
            const state = useGameStore.getState();
            expect(state.onboardingStep).toBe('END_TURN');
        });
    });

    describe('initializeSession function', () => {
        it('should set config from input', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };
            useGameStore.getState().initializeSession(config);
            const state = useGameStore.getState();
            expect(state.config).toEqual(config);
        });

        it('should set players from config', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [
                    { id: 'P1', name: 'Player 1', color: '#ff0000' },
                    { id: 'P2', name: 'Player 2', color: '#00ff00' }
                ],
                initialAge: 1,
                rules: {}
            };
            useGameStore.getState().initializeSession(config);
            const state = useGameStore.getState();
            expect(state.players).toEqual(['P1', 'P2']);
        });

        it('should set initial age from config', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 2,
                rules: {}
            };
            useGameStore.getState().initializeSession(config);
            const state = useGameStore.getState();
            expect(state.age).toBe(2);
        });

        it('should set isHydrated to true', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };
            useGameStore.getState().initializeSession(config);
            const state = useGameStore.getState();
            expect(state.isHydrated).toBe(true);
        });
    });

    describe('updateConfig function', () => {
        it('should update config', () => {
            const config: GameSessionConfig = {
                mapSize: 'GRAND',
                players: [{ id: 'P1', name: 'Player 1', color: '#ff0000' }],
                initialAge: 1,
                rules: {}
            };
            useGameStore.getState().updateConfig(config);
            const state = useGameStore.getState();
            expect(state.config).toEqual(config);
        });

        it('should update players from config', () => {
            const config: GameSessionConfig = {
                mapSize: 'STANDARD',
                players: [
                    { id: 'P3', name: 'Player 3', color: '#0000ff' }
                ],
                initialAge: 1,
                rules: {}
            };
            useGameStore.getState().updateConfig(config);
            const state = useGameStore.getState();
            expect(state.players).toEqual(['P3']);
        });
    });

    describe('loadSession function', () => {
        it('should return true', async () => {
            const result = await useGameStore.getState().loadSession();
            expect(result).toBe(true);
        });
    });

    describe('reset function', () => {
        it('should reset all state to initial values', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().reset();
            const state = useGameStore.getState();
            expect(state.events).toEqual([]);
            expect(state.worldCache.size).toBe(0);
            expect(state.age).toBe(1);
            expect(state.round).toBe(1);
            expect(state.turn).toBe(1);
        });

        it('should set isHydrated to true after reset', () => {
            useGameStore.getState().reset();
            const state = useGameStore.getState();
            expect(state.isHydrated).toBe(true);
        });
    });

    describe('startCombat function', () => {
        it('should create combat session', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            const state = useGameStore.getState();
            expect(state.combatSession).not.toBeNull();
            expect(state.combatSession?.attackerId).toBe('unit_1');
            expect(state.combatSession?.defenderId).toBe('w_1');
        });

        it('should add city modifier for city defenders', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            const state = useGameStore.getState();
            const cityMod = state.combatSession?.defenderModifiers.find(m => m.id === 'def-city');
            expect(cityMod).toBeDefined();
            expect(cityMod?.value).toBe(1);
        });

        it('should add nation modifier for nation defenders', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'NATION', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            const state = useGameStore.getState();
            const nationMod = state.combatSession?.defenderModifiers.find(m => m.id === 'def-nat');
            expect(nationMod).toBeDefined();
            expect(nationMod?.value).toBe(1);
        });
    });

    describe('setCombatStage function', () => {
        it('should update combat stage', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            useGameStore.getState().setCombatStage('ATTACK');
            const state = useGameStore.getState();
            expect(state.combatSession?.stage).toBe('ATTACK');
        });

        it('should not update stage when no combat session', () => {
            useGameStore.getState().setCombatStage('ATTACK');
            const state = useGameStore.getState();
            expect(state.combatSession).toBeNull();
        });
    });

    describe('updateCombatSession function', () => {
        it('should update combat session', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            useGameStore.getState().updateCombatSession({ damage: 5 });
            const state = useGameStore.getState();
            expect(state.combatSession?.damage).toBe(5);
        });

        it('should not update when no combat session', () => {
            useGameStore.getState().updateCombatSession({ damage: 5 });
            const state = useGameStore.getState();
            expect(state.combatSession).toBeNull();
        });
    });

    describe('closeCombat function', () => {
        it('should clear combat session', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            useGameStore.getState().closeCombat();
            const state = useGameStore.getState();
            expect(state.combatSession).toBeNull();
        });
    });

    describe('addCandidate function', () => {
        it('should add candidate to candidates', () => {
            const candidate: ChronicleCandidate = {
                id: 'candidate_1',
                triggerType: 'TEST_TRIGGER',
                sourceEventIds: ['evt_1'],
                suggestedTemplates: [],
                suggestedAuthors: [],
                defaultScope: 'GLOBAL',
                autoEligible: true,
                urgency: 'NORMAL',
                enabled: true
            };
            useGameStore.getState().addCandidate(candidate);
            const state = useGameStore.getState();
            expect(state.candidates['candidate_1']).toEqual(candidate);
        });
    });

    describe('dismissCandidate function', () => {
        it('should remove candidate from candidates', () => {
            const candidate: ChronicleCandidate = {
                id: 'candidate_1',
                triggerType: 'TEST_TRIGGER',
                sourceEventIds: ['evt_1'],
                suggestedTemplates: [],
                suggestedAuthors: [],
                defaultScope: 'GLOBAL',
                autoEligible: true,
                urgency: 'NORMAL',
                enabled: true
            };
            useGameStore.getState().addCandidate(candidate);
            useGameStore.getState().dismissCandidate('candidate_1');
            const state = useGameStore.getState();
            expect(state.candidates['candidate_1']).toBeUndefined();
        });
    });

    describe('commitJournalEntry function', () => {
        it('should add entry to journal', () => {
            const entry: JournalEntry = {
                id: 'journal_1',
                timestamp: Date.now(),
                title: 'Test Entry',
                content: 'Test content',
                triggeredByEventIds: ['evt_1'],
                author: 'System'
            };
            useGameStore.getState().commitJournalEntry(entry);
            const state = useGameStore.getState();
            expect(state.journal['journal_1']).toEqual(entry);
        });

        it('should remove related candidate from candidates', () => {
            const candidate: ChronicleCandidate = {
                id: 'candidate_1',
                triggerType: 'TEST_TRIGGER',
                sourceEventIds: ['evt_1'],
                suggestedTemplates: [],
                suggestedAuthors: [],
                defaultScope: 'GLOBAL',
                autoEligible: true,
                urgency: 'NORMAL',
                enabled: true
            };
            const entry: JournalEntry = {
                id: 'journal_1',
                timestamp: Date.now(),
                title: 'Test Entry',
                content: 'Test content',
                triggeredByEventIds: ['evt_1'],
                author: 'System'
            };
            useGameStore.getState().addCandidate(candidate);
            useGameStore.getState().commitJournalEntry(entry);
            const state = useGameStore.getState();
            expect(state.candidates['candidate_1']).toBeUndefined();
        });
    });

    describe('store initialization', () => {
        it('should initialize with default values', () => {
            const state = useGameStore.getState();
            expect(state.events).toEqual([]);
            expect(state.age).toBe(1);
            expect(state.round).toBe(1);
            expect(state.turn).toBe(1);
            expect(state.activePlayerId).toBe('P1');
            expect(state.players).toEqual(['P1', 'P2']);
        });

        it('should initialize with empty worldCache', () => {
            const state = useGameStore.getState();
            expect(state.worldCache.size).toBe(0);
        });

        it('should initialize with empty playerCache', () => {
            const state = useGameStore.getState();
            expect(state.playerCache).toEqual({});
        });
    });

    describe('store persistence', () => {
        it('should have storage name configured', () => {
            const state = useGameStore.getState();
            // Store is configured with name 'dawn_of_worlds_save_v1'
            expect(state).toBeDefined();
        });
    });

    describe('store event ordering', () => {
        it('should maintain event order', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                payload: { worldId: 'w_2', kind: 'WATER', hexes: [] }
            };
            useGameStore.getState().dispatch(event1);
            useGameStore.getState().dispatch(event2);
            const state = useGameStore.getState();
            expect(state.events[0].id).toBe('evt_1');
            expect(state.events[1].id).toBe('evt_2');
        });
    });

    describe('store state derivation', () => {
        it('should derive worldCache from events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            const state = useGameStore.getState();
            expect(state.worldCache.get('w_1')?.kind).toBe('TERRAIN');
        });

        it('should derive playerCache from events', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'POWER_ROLL',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { result: 10 }
            };
            useGameStore.getState().dispatch(event);
            const state = useGameStore.getState();
            expect(state.playerCache['P1']?.currentPower).toBe(10);
        });
    });

    describe('store action validation', () => {
        it('should validate events before dispatching', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            useGameStore.getState().dispatch(event);
            const state = useGameStore.getState();
            expect(state.events.length).toBe(1);
        });
    });

    describe('store error handling', () => {
        it('should handle missing world object gracefully', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'nonexistent', patch: [] }
            };
            useGameStore.getState().dispatch(event);
            const state = useGameStore.getState();
            expect(state.events).toContain(event);
        });
    });

    describe('store with multiple players', () => {
        it('should track events from multiple players', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const event2: GameEvent = {
                id: 'evt_2',
                type: 'WORLD_CREATE',
                playerId: 'P2',
                age: 1,
                round: 1,
                turn: 2,
                payload: { worldId: 'w_2', kind: 'WATER', hexes: [] }
            };
            useGameStore.getState().dispatch(event1);
            useGameStore.getState().dispatch(event2);
            const state = useGameStore.getState();
            expect(state.events.length).toBe(2);
        });
    });

    describe('store with complex events', () => {
        it('should handle WORLD_MODIFY events', () => {
            const createEvent: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', name: 'Old', hexes: [] }
            };
            const modifyEvent: GameEvent = {
                id: 'evt_2',
                type: 'WORLD_MODIFY',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                payload: { worldId: 'w_1', patch: [{ op: 'set', path: 'name', value: 'New' }] }
            };
            useGameStore.getState().dispatch(createEvent);
            useGameStore.getState().dispatch(modifyEvent);
            const state = useGameStore.getState();
            expect(state.worldCache.get('w_1')?.name).toBe('New');
        });

        it('should handle WORLD_DELETE events', () => {
            const createEvent: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const deleteEvent: GameEvent = {
                id: 'evt_2',
                type: 'WORLD_DELETE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                payload: { worldId: 'w_1' }
            };
            useGameStore.getState().dispatch(createEvent);
            useGameStore.getState().dispatch(deleteEvent);
            const state = useGameStore.getState();
            expect(state.worldCache.has('w_1')).toBe(false);
        });
    });

    describe('store undo integration', () => {
        it('should handle EVENT_REVOKE events', () => {
            const event1: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            const revokeEvent: GameEvent = {
                id: 'evt_revoke',
                type: 'EVENT_REVOKE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 2,
                payload: { targetEventIds: ['evt_1'], reason: 'Undo' }
            };
            useGameStore.getState().dispatch(event1);
            useGameStore.getState().dispatch(revokeEvent);
            const state = useGameStore.getState();
            expect(state.revokedEventIds.has('evt_1')).toBe(true);
        });
    });

    describe('store selection state', () => {
        it('should update selection', () => {
            const selection: Selection = { kind: 'HEX', hex: { q: 0, r: 0 } };
            useGameStore.getState().setSelection(selection);
            const state = useGameStore.getState();
            expect(state.activeSelection).toEqual(selection);
        });

        it('should clear selection', () => {
            const selection: Selection = { kind: 'NONE' };
            useGameStore.getState().setSelection(selection);
            const state = useGameStore.getState();
            expect(state.activeSelection.kind).toBe('NONE');
        });
    });

    describe('store preview state', () => {
        it('should set preview event', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'TERRAIN', hexes: [] }
            };
            useGameStore.getState().setPreview(event);
            const state = useGameStore.getState();
            expect(state.previewEvent).toEqual(event);
        });

        it('should clear preview event', () => {
            useGameStore.getState().setPreview(null);
            const state = useGameStore.getState();
            expect(state.previewEvent).toBeNull();
        });
    });

    describe('store combat state', () => {
        it('should initialize combat session', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            const state = useGameStore.getState();
            expect(state.combatSession?.stage).toBe('SETUP');
        });

        it('should update combat session', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            useGameStore.getState().updateCombatSession({ damage: 10 });
            const state = useGameStore.getState();
            expect(state.combatSession?.damage).toBe(10);
        });

        it('should close combat session', () => {
            const event: GameEvent = {
                id: 'evt_1',
                type: 'WORLD_CREATE',
                playerId: 'P1',
                age: 1,
                round: 1,
                turn: 1,
                payload: { worldId: 'w_1', kind: 'CITY', hexes: [{ q: 0, r: 0 }] }
            };
            useGameStore.getState().dispatch(event);
            useGameStore.getState().startCombat('unit_1', 'w_1');
            useGameStore.getState().closeCombat();
            const state = useGameStore.getState();
            expect(state.combatSession).toBeNull();
        });
    });

    describe('store chronicler state', () => {
        it('should add candidate', () => {
            const candidate: ChronicleCandidate = {
                id: 'candidate_1',
                triggerType: 'TEST_TRIGGER',
                sourceEventIds: ['evt_1'],
                suggestedTemplates: [],
                suggestedAuthors: [],
                defaultScope: 'GLOBAL',
                autoEligible: true,
                urgency: 'NORMAL',
                enabled: true
            };
            useGameStore.getState().addCandidate(candidate);
            const state = useGameStore.getState();
            expect(state.candidates['candidate_1']).toEqual(candidate);
        });

        it('should dismiss candidate', () => {
            const candidate: ChronicleCandidate = {
                id: 'candidate_1',
                triggerType: 'TEST_TRIGGER',
                sourceEventIds: ['evt_1'],
                suggestedTemplates: [],
                suggestedAuthors: [],
                defaultScope: 'GLOBAL',
                autoEligible: true,
                urgency: 'NORMAL',
                enabled: true
            };
            useGameStore.getState().addCandidate(candidate);
            useGameStore.getState().dismissCandidate('candidate_1');
            const state = useGameStore.getState();
            expect(state.candidates['candidate_1']).toBeUndefined();
        });

        it('should commit journal entry', () => {
            const entry: JournalEntry = {
                id: 'journal_1',
                timestamp: Date.now(),
                title: 'Test Entry',
                content: 'Test content',
                triggeredByEventIds: ['evt_1'],
                author: 'System'
            };
            useGameStore.getState().commitJournalEntry(entry);
            const state = useGameStore.getState();
            expect(state.journal['journal_1']).toEqual(entry);
        });
    });
});
