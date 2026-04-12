import { describe, it, expect, beforeEach } from 'vitest';
import { age1Actions } from '../actions/age1';
import { age2Actions } from '../actions/age2';
import { age3Actions } from '../actions/age3';
import { GameState, Selection } from '../../types';

describe('Age I Actions', () => {
    let mockState: GameState;
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
            config: { mapSize: 'STANDARD' },
            activeSelection: { kind: 'NONE' },
            previewEvent: null,
            chronicle: {},
            players: ['P1'],
            settings: {
                version: 'qol.v1',
                turn: { apByAge: { 1: 5, 2: 6, 3: 7 }, minRoundsByAge: { 1: 2, 2: 2, 3: 2 }, requireAllPlayersActedToAdvance: false },
                ui: {
                    contextFilterActions: false,
                    showDisabledWithReasons: false,
                    actionPreviewGhost: false,
                    mapJumpFromTimeline: false,
                    searchEnabled: false,
                    showPlayerColorOverlay: false,
                    audioMuted: false,
                    renderPngTiles: false
                },
                social: {
                    ownershipTags: 'OFF',
                    protectedUntilEndOfRound: false,
                    alterationCost: { enabled: false, modifyOthersBasePlus: 0, modifyOthersNamedPlus: 0, namedKinds: [] },
                    warnings: { warnOnModifyingOthers: false, warnOnDeletingNamed: false }
                },
                safety: { undo: { mode: 'OFF' }, draftMode: { enabled: false, draftRoundCountAtAgeStart: 0, allowOneGlobalRollbackDuringDraft: false } },
                genesis: { enableGlobeMode: false }
            },
            onboardingStep: 'MAP_TAP',
            isHandoverActive: false,
            combatSession: null
        } as any;

        mockSelection = { kind: 'HEX', hex: { q: 0, r: 0 } };
    });

    describe('A1_ADD_TERRAIN', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_ADD_TERRAIN.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age1Actions.A1_ADD_TERRAIN.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.reason).toContain('hex');
            }
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 1, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_ADD_TERRAIN.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default biome', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age1Actions.A1_ADD_TERRAIN.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('TERRAIN');
                expect(event.payload.attrs?.biome).toBe('plains');
            }
        });

        it('should build correct event with custom biome', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const customSelection = { kind: 'HEX' as const, hex: { q: 0, r: 0 }, biome: 'forest' } as any;
            const event = age1Actions.A1_ADD_TERRAIN.buildEvent(mockState, customSelection);
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.attrs?.biome).toBe('forest');
            }
        });
    });

    describe('A1_ADD_WATER', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_ADD_WATER.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age1Actions.A1_ADD_WATER.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 1, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_ADD_WATER.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age1Actions.A1_ADD_WATER.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('WATER');
                expect(event.payload.attrs?.biome).toBe('water');
            }
        });
    });

    describe('A1_NAME_REGION', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 2, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_NAME_REGION.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age1Actions.A1_NAME_REGION.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_NAME_REGION.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default name', () => {
            mockState.playerCache = { P1: { currentPower: 2, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age1Actions.A1_NAME_REGION.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('REGION');
                expect(event.payload.name).toBe('Unnamed Region');
            }
        });
    });

    describe('A1_CREATE_LANDMARK', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_CREATE_LANDMARK.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age1Actions.A1_CREATE_LANDMARK.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 2, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_CREATE_LANDMARK.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default name', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age1Actions.A1_CREATE_LANDMARK.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('LANDMARK');
                expect(event.payload.name).toBe('Strange Landmark');
            }
        });
    });

    describe('A1_SHAPE_CLIMATE', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_SHAPE_CLIMATE.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age1Actions.A1_SHAPE_CLIMATE.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 1, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_SHAPE_CLIMATE.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default biome', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age1Actions.A1_SHAPE_CLIMATE.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('CLIMATE');
                expect(event.payload.attrs?.biome).toBe('arctic');
            }
        });

        it('should build correct event with custom biome', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const customSelection = { kind: 'HEX' as const, hex: { q: 0, r: 0 }, biome: 'tropical' } as any;
            const event = age1Actions.A1_SHAPE_CLIMATE.buildEvent(mockState, customSelection);
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.attrs?.biome).toBe('tropical');
            }
        });
    });

    describe('A1_CREATE_AVATAR', () => {
        it('should validate successfully in Age 1 with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 1;
            const result = age1Actions.A1_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation in Age 2', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 2;
            const result = age1Actions.A1_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.reason).toContain('Age-specific');
            }
        });

        it('should fail validation without hex selection', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age1Actions.A1_CREATE_AVATAR.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default name', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age1Actions.A1_CREATE_AVATAR.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('AVATAR');
                expect(event.payload.name).toBe('Great Spirit');
            }
        });
    });

    describe('A1_CREATE_ORDER', () => {
        it('should validate successfully in Age 1 with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 12, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 1;
            const result = age1Actions.A1_CREATE_ORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation in Age 2', () => {
            mockState.playerCache = { P1: { currentPower: 12, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 2;
            const result = age1Actions.A1_CREATE_ORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.reason).toContain('Age-specific');
            }
        });

        it('should fail validation without hex selection', () => {
            mockState.playerCache = { P1: { currentPower: 12, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age1Actions.A1_CREATE_ORDER.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age1Actions.A1_CREATE_ORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });
    });
});

describe('Age II Actions', () => {
    let mockState: GameState;
    let mockSelection: Selection;

    beforeEach(() => {
        mockState = {
            events: [],
            worldCache: new Map(),
            playerCache: {},
            activePlayerId: 'P1',
            age: 2,
            round: 1,
            turn: 1,
            revokedEventIds: new Set(),
            config: { mapSize: 'STANDARD' },
            activeSelection: { kind: 'NONE' },
            previewEvent: null,
            chronicle: {},
            players: ['P1'],
            settings: {
                version: 'qol.v1',
                turn: { apByAge: { 1: 5, 2: 6, 3: 7 }, minRoundsByAge: { 1: 2, 2: 2, 3: 2 }, requireAllPlayersActedToAdvance: false },
                ui: {
                    contextFilterActions: false,
                    showDisabledWithReasons: false,
                    actionPreviewGhost: false,
                    mapJumpFromTimeline: false,
                    searchEnabled: false,
                    showPlayerColorOverlay: false,
                    audioMuted: false,
                    renderPngTiles: false
                },
                social: {
                    ownershipTags: 'OFF',
                    protectedUntilEndOfRound: false,
                    alterationCost: { enabled: false, modifyOthersBasePlus: 0, modifyOthersNamedPlus: 0, namedKinds: [] },
                    warnings: { warnOnModifyingOthers: false, warnOnDeletingNamed: false }
                },
                safety: { undo: { mode: 'OFF' }, draftMode: { enabled: false, draftRoundCountAtAgeStart: 0, allowOneGlobalRollbackDuringDraft: false } },
                genesis: { enableGlobeMode: false }
            },
            onboardingStep: 'MAP_TAP',
            isHandoverActive: false,
            combatSession: null
        } as any;

        mockSelection = { kind: 'HEX', hex: { q: 0, r: 0 } };
    });

    describe('A2_CREATE_RACE', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_CREATE_RACE.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age2Actions.A2_CREATE_RACE.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 2, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_CREATE_RACE.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age2Actions.A2_CREATE_RACE.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('RACE');
            }
        });
    });

    describe('A2_CREATE_SUBRACE', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 4, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_CREATE_SUBRACE.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age2Actions.A2_CREATE_SUBRACE.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 2, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_CREATE_SUBRACE.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 4, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age2Actions.A2_CREATE_SUBRACE.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('SUBRACE');
            }
        });
    });

    describe('A2_FOUND_CITY', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_FOUND_CITY.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age2Actions.A2_FOUND_CITY.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 2, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_FOUND_CITY.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default name', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age2Actions.A2_FOUND_CITY.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('CITY');
                expect(event.payload.name).toBe('New City');
            }
        });
    });

    describe('A2_SHAPE_CLIMATE', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_SHAPE_CLIMATE.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age2Actions.A2_SHAPE_CLIMATE.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 1, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_SHAPE_CLIMATE.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age2Actions.A2_SHAPE_CLIMATE.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('CLIMATE');
            }
        });
    });

    describe('A2_CREATE_AVATAR', () => {
        it('should validate successfully in Age 2 with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 2;
            const result = age2Actions.A2_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation in Age 1', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 1;
            const result = age2Actions.A2_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.reason).toContain('Age-specific');
            }
        });

        it('should fail validation without hex selection', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age2Actions.A2_CREATE_AVATAR.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });
    });

    describe('A2_CREATE_ORDER', () => {
        it('should validate successfully in Age 2 with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 12, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 2;
            const result = age2Actions.A2_CREATE_ORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation in Age 1', () => {
            mockState.playerCache = { P1: { currentPower: 12, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 1;
            const result = age2Actions.A2_CREATE_ORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.reason).toContain('Age-specific');
            }
        });

        it('should fail validation without hex selection', () => {
            mockState.playerCache = { P1: { currentPower: 12, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age2Actions.A2_CREATE_ORDER.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age2Actions.A2_CREATE_ORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });
    });
});

describe('Age III Actions', () => {
    let mockState: GameState;
    let mockSelection: Selection;

    beforeEach(() => {
        mockState = {
            events: [],
            worldCache: new Map(),
            playerCache: {},
            activePlayerId: 'P1',
            age: 3,
            round: 1,
            turn: 1,
            revokedEventIds: new Set(),
            config: { mapSize: 'STANDARD' },
            activeSelection: { kind: 'NONE' },
            previewEvent: null,
            chronicle: {},
            players: ['P1'],
            settings: {
                version: 'qol.v1',
                turn: { apByAge: { 1: 5, 2: 6, 3: 7 }, minRoundsByAge: { 1: 2, 2: 2, 3: 2 }, requireAllPlayersActedToAdvance: false },
                ui: {
                    contextFilterActions: false,
                    showDisabledWithReasons: false,
                    actionPreviewGhost: false,
                    mapJumpFromTimeline: false,
                    searchEnabled: false,
                    showPlayerColorOverlay: false,
                    audioMuted: false,
                    renderPngTiles: false
                },
                social: {
                    ownershipTags: 'OFF',
                    protectedUntilEndOfRound: false,
                    alterationCost: { enabled: false, modifyOthersBasePlus: 0, modifyOthersNamedPlus: 0, namedKinds: [] },
                    warnings: { warnOnModifyingOthers: false, warnOnDeletingNamed: false }
                },
                safety: { undo: { mode: 'OFF' }, draftMode: { enabled: false, draftRoundCountAtAgeStart: 0, allowOneGlobalRollbackDuringDraft: false } },
                genesis: { enableGlobeMode: false }
            },
            onboardingStep: 'MAP_TAP',
            isHandoverActive: false,
            combatSession: null
        } as any;

        mockSelection = { kind: 'HEX', hex: { q: 0, r: 0 } };
    });

    describe('A3_FOUND_NATION', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 8, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_FOUND_NATION.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age3Actions.A3_FOUND_NATION.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 4, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_FOUND_NATION.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default name', () => {
            mockState.playerCache = { P1: { currentPower: 8, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age3Actions.A3_FOUND_NATION.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('NATION');
                expect(event.payload.name).toBe('New Nation');
            }
        });
    });

    describe('A3_CLAIM_BORDER', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_CLAIM_BORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age3Actions.A3_CLAIM_BORDER.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 1, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_CLAIM_BORDER.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age3Actions.A3_CLAIM_BORDER.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_MODIFY');
        });
    });

    describe('A3_SHAPE_CLIMATE', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_SHAPE_CLIMATE.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age3Actions.A3_SHAPE_CLIMATE.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 1, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_SHAPE_CLIMATE.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age3Actions.A3_SHAPE_CLIMATE.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('CLIMATE');
            }
        });
    });

    describe('A3_DECLARE_WAR', () => {
        it('should validate successfully with world selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 4, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const worldSelection: Selection = { kind: 'WORLD', worldId: 'nation_1' };
            const result = age3Actions.A3_DECLARE_WAR.validate(mockState, worldSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without world selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age3Actions.A3_DECLARE_WAR.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 2, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const worldSelection: Selection = { kind: 'WORLD', worldId: 'nation_1' };
            const result = age3Actions.A3_DECLARE_WAR.validate(mockState, worldSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 4, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const worldSelection: Selection = { kind: 'WORLD', worldId: 'nation_1' };
            const event = age3Actions.A3_DECLARE_WAR.buildEvent(mockState, worldSelection);
            expect(event.type).toBe('WORLD_MODIFY');
        });
    });

    describe('A3_SIGN_TREATY', () => {
        it('should validate successfully with world selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const worldSelection: Selection = { kind: 'WORLD', worldId: 'nation_1' };
            const result = age3Actions.A3_SIGN_TREATY.validate(mockState, worldSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without world selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age3Actions.A3_SIGN_TREATY.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 1, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const worldSelection: Selection = { kind: 'WORLD', worldId: 'nation_1' };
            const result = age3Actions.A3_SIGN_TREATY.validate(mockState, worldSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event', () => {
            mockState.playerCache = { P1: { currentPower: 3, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const worldSelection: Selection = { kind: 'WORLD', worldId: 'nation_1' };
            const event = age3Actions.A3_SIGN_TREATY.buildEvent(mockState, worldSelection);
            expect(event.type).toBe('WORLD_MODIFY');
        });
    });

    describe('A3_GREAT_PROJECT', () => {
        it('should validate successfully with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 10, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_GREAT_PROJECT.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation without hex selection', () => {
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age3Actions.A3_GREAT_PROJECT.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_GREAT_PROJECT.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default name', () => {
            mockState.playerCache = { P1: { currentPower: 10, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age3Actions.A3_GREAT_PROJECT.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('PROJECT');
                expect(event.payload.name).toBe('Great Project');
            }
        });
    });

    describe('A3_CREATE_AVATAR', () => {
        it('should validate successfully in Age 3 with hex selection and sufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 3;
            const result = age3Actions.A3_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(true);
        });

        it('should fail validation in Age 2', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            mockState.age = 2;
            const result = age3Actions.A3_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.reason).toContain('Age-specific');
            }
        });

        it('should fail validation without hex selection', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const noneSelection: Selection = { kind: 'NONE' };
            const result = age3Actions.A3_CREATE_AVATAR.validate(mockState, noneSelection);
            expect(result.ok).toBe(false);
        });

        it('should fail validation with insufficient AP', () => {
            mockState.playerCache = { P1: { currentPower: 5, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const result = age3Actions.A3_CREATE_AVATAR.validate(mockState, mockSelection);
            expect(result.ok).toBe(false);
        });

        it('should build correct event with default name', () => {
            mockState.playerCache = { P1: { currentPower: 15, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false } };
            const event = age3Actions.A3_CREATE_AVATAR.buildEvent(mockState, mockSelection);
            expect(event.type).toBe('WORLD_CREATE');
            if (event.type === 'WORLD_CREATE') {
                expect(event.payload.kind).toBe('AVATAR');
                expect(event.payload.name).toBe('Great Spirit');
            }
        });
    });
});
