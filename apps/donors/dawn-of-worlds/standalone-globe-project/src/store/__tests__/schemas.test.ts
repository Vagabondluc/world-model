/**
 * Vitest Test Suite for Zod Schemas
 * 
 * Tests for all Zod validation schemas in the World Builder store.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import schemas from '../schemas';

// ============================================================================
// UTILITY SCHEMA TESTS
// ============================================================================

describe('Utility Schemas', () => {
    describe('HexColor', () => {
        it('should accept valid hex colors', () => {
            const validColors = ['#FF0000', '#00FF00', '#0000FF', '#123456', '#ABCDEF'];

            validColors.forEach((color) => {
                const result = schemas.HexColor.safeParse(color);
                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data).toBe(color);
                }
            });
        });

        it('should reject invalid hex colors', () => {
            const invalidColors = [
                'FF0000',          // Missing #
                '#FF00',           // Too short
                '#FF00000',        // Too long
                '#GGGGGG',         // Invalid hex
                'red',             // Named color
                '',                // Empty string
            ];

            invalidColors.forEach((color) => {
                const result = schemas.HexColor.safeParse(color);
                expect(result.success).toBe(false);
            });
        });

        it('should accept lowercase hex colors', () => {
            const result = schemas.HexColor.safeParse('#ff0000');
            expect(result.success).toBe(true);
        });
    });

    describe('PlayerId', () => {
        it('should accept valid player IDs', () => {
            const validIds = ['P1', 'P2', 'P3', 'P10', 'P100'];

            validIds.forEach((id) => {
                const result = schemas.PlayerId.safeParse(id);
                expect(result.success).toBe(true);
            });
        });

        it('should reject invalid player IDs', () => {
            const invalidIds = ['p1', 'player1', 'P', 'P-1', 'P_1', '', '1P'];

            invalidIds.forEach((id) => {
                const result = schemas.PlayerId.safeParse(id);
                expect(result.success).toBe(false);
            });
        });
    });

    describe('CellId', () => {
        it('should accept valid cell IDs', () => {
            const validIds = ['cell_0', 'cell_123', 'cell_999999'];

            validIds.forEach((id) => {
                const result = schemas.CellId.safeParse(id);
                expect(result.success).toBe(true);
            });
        });

        it('should reject invalid cell IDs', () => {
            const invalidIds = ['cell', 'cell_abc', 'Cell_1', '', 'c1'];

            invalidIds.forEach((id) => {
                const result = schemas.CellId.safeParse(id);
                expect(result.success).toBe(false);
            });
        });
    });

    describe('CultureId', () => {
        it('should accept valid culture IDs', () => {
            const validIds = ['culture_abc123', 'culture_test', 'culture_Culture123'];

            validIds.forEach((id) => {
                const result = schemas.CultureId.safeParse(id);
                expect(result.success).toBe(true);
            });
        });

        it('should reject invalid culture IDs', () => {
            const invalidIds = ['culture', 'civ_abc', 'Culture_1', ''];

            invalidIds.forEach((id) => {
                const result = schemas.CultureId.safeParse(id);
                expect(result.success).toBe(false);
            });
        });
    });

    describe('CivilizationId', () => {
        it('should accept valid civilization IDs', () => {
            const validIds = ['civ_xyz789', 'civ_test', 'civ_Civ123'];

            validIds.forEach((id) => {
                const result = schemas.CivilizationId.safeParse(id);
                expect(result.success).toBe(true);
            });
        });

        it('should reject invalid civilization IDs', () => {
            const invalidIds = ['civ', 'civilization_abc', 'Civ_1', ''];

            invalidIds.forEach((id) => {
                const result = schemas.CivilizationId.safeParse(id);
                expect(result.success).toBe(false);
            });
        });
    });

    describe('Percentage', () => {
        it('should accept valid percentages (0-1)', () => {
            const validValues = [0, 0.5, 1, 0.25, 0.75, 0.999];

            validValues.forEach((value) => {
                const result = schemas.Percentage.safeParse(value);
                expect(result.success).toBe(true);
            });
        });

        it('should reject invalid percentages', () => {
            const invalidValues = [-0.1, -1, 1.1, 2, -0.5];

            invalidValues.forEach((value) => {
                const result = schemas.Percentage.safeParse(value);
                expect(result.success).toBe(false);
            });
        });
    });
});

// ============================================================================
// ENTITY SCHEMA TESTS
// ============================================================================

describe('Entity Schemas', () => {
    describe('PlayerConfig', () => {
        const validPlayerConfig = {
            id: 'P1',
            name: 'Test Player',
            color: '#FF0000',
            isHuman: true,
        };

        it('should accept valid player config', () => {
            const result = schemas.PlayerConfig.safeParse(validPlayerConfig);
            expect(result.success).toBe(true);
        });

        it('should accept player config with optional cultureId', () => {
            const configWithCulture = { ...validPlayerConfig, cultureId: 'culture_test' };
            const result = schemas.PlayerConfig.safeParse(configWithCulture);
            expect(result.success).toBe(true);
        });

        it('should reject player config with empty name', () => {
            const invalidConfig = { ...validPlayerConfig, name: '' };
            const result = schemas.PlayerConfig.safeParse(invalidConfig);
            expect(result.success).toBe(false);
        });

        it('should reject player config with name too long', () => {
            const invalidConfig = { ...validPlayerConfig, name: 'a'.repeat(51) };
            const result = schemas.PlayerConfig.safeParse(invalidConfig);
            expect(result.success).toBe(false);
        });
    });

    describe('Player', () => {
        const validPlayer = {
            id: 'P1',
            name: 'Test Player',
            color: '#FF0000',
            isHuman: true,
            ap: 5,
        };

        it('should accept valid player', () => {
            const result = schemas.Player.safeParse(validPlayer);
            expect(result.success).toBe(true);
        });

        it('should default ap to 0', () => {
            const playerWithoutAP = { ...validPlayer, ap: undefined as any };
            const result = schemas.Player.safeParse(playerWithoutAP);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.ap).toBe(0);
            }
        });

        it('should reject negative AP', () => {
            const invalidPlayer = { ...validPlayer, ap: -1 };
            const result = schemas.Player.safeParse(invalidPlayer);
            expect(result.success).toBe(false);
        });
    });

    describe('GameSessionConfig', () => {
        const validConfig = {
            players: [
                { id: 'P1', name: 'Player 1', color: '#FF0000', isHuman: true },
                { id: 'P2', name: 'Player 2', color: '#00FF00', isHuman: false },
            ],
            seed: 12345,
            worldSize: 'medium' as const,
            startingAge: 1 as const,
            enableAI: true,
        };

        it('should accept valid game session config', () => {
            const result = schemas.GameSessionConfig.safeParse(validConfig);
            expect(result.success).toBe(true);
        });

        it('should require at least one player', () => {
            const invalidConfig = { ...validConfig, players: [] };
            const result = schemas.GameSessionConfig.safeParse(invalidConfig);
            expect(result.success).toBe(false);
        });

        it('should accept all valid world sizes', () => {
            const worldSizes = ['small', 'medium', 'large'] as const;

            worldSizes.forEach((size) => {
                const config = { ...validConfig, worldSize: size };
                const result = schemas.GameSessionConfig.safeParse(config);
                expect(result.success).toBe(true);
            });
        });

        it('should accept valid ages', () => {
            const ages = [1, 2, 3] as const;

            ages.forEach((age) => {
                const config = { ...validConfig, startingAge: age };
                const result = schemas.GameSessionConfig.safeParse(config);
                expect(result.success).toBe(true);
            });
        });
    });

    describe('Cell', () => {
        const validCell = {
            id: 'cell_0',
            q: 0,
            r: 0,
            elevation: 0.5,
            moisture: 0.5,
            temperature: 0.5,
            biome: 'plains' as const,
            population: 100,
            development: 0.5,
        };

        it('should accept valid cell', () => {
            const result = schemas.Cell.safeParse(validCell);
            expect(result.success).toBe(true);
        });

        it('should accept cell with optional owner', () => {
            const cellWithOwner = { ...validCell, ownerId: 'civ_test' };
            const result = schemas.Cell.safeParse(cellWithOwner);
            expect(result.success).toBe(true);
        });

        it('should reject cell with negative population', () => {
            const invalidCell = { ...validCell, population: -1 };
            const result = schemas.Cell.safeParse(invalidCell);
            expect(result.success).toBe(false);
        });

        it('should accept all valid biomes', () => {
            const biomes = [
                'ocean', 'deep_ocean', 'coast', 'beach', 'plains',
                'grassland', 'forest', 'dense_forest', 'jungle', 'desert',
                'savanna', 'tundra', 'ice', 'mountain', 'hills',
                'swamp', 'marsh', 'lake', 'river',
            ] as const;

            biomes.forEach((biome) => {
                const cell = { ...validCell, biome };
                const result = schemas.Cell.safeParse(cell);
                expect(result.success).toBe(true);
            });
        });
    });

    describe('Culture', () => {
        const validCulture = {
            id: 'culture_test',
            name: 'Test Culture',
            language: 'Test Language',
            traits: ['trait1', 'trait2'],
            originCellId: 'cell_0',
            color: '#FF0000',
            foundedYear: 100,
        };

        it('should accept valid culture', () => {
            const result = schemas.Culture.safeParse(validCulture);
            expect(result.success).toBe(true);
        });

        it('should reject culture with empty name', () => {
            const invalidCulture = { ...validCulture, name: '' };
            const result = schemas.Culture.safeParse(invalidCulture);
            expect(result.success).toBe(false);
        });

        it('should reject culture with negative founded year', () => {
            const invalidCulture = { ...validCulture, foundedYear: -1 };
            const result = schemas.Culture.safeParse(invalidCulture);
            expect(result.success).toBe(false);
        });
    });

    describe('Civilization', () => {
        const validCiv = {
            id: 'civ_test',
            name: 'Test Civilization',
            cultureId: 'culture_test',
            capitalCellId: 'cell_0',
            controlledCells: new Set(['cell_0', 'cell_1']),
            foundedYear: 100,
            color: '#FF0000',
        };

        it('should accept valid civilization', () => {
            const result = schemas.Civilization.safeParse(validCiv);
            expect(result.success).toBe(true);
        });

        it('should accept civilization with empty controlled cells', () => {
            const civWithNoCells = { ...validCiv, controlledCells: new Set<string>() };
            const result = schemas.Civilization.safeParse(civWithNoCells);
            expect(result.success).toBe(true);
        });
    });
});

// ============================================================================
// EVENT SCHEMA TESTS
// ============================================================================

describe('Event Schemas', () => {
    describe('GameEvent', () => {
        it('should accept valid GAME_START event', () => {
            const event = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'GAME_START' as const,
                timestamp: '2024-01-01T00:00:00.000Z',
                payload: {
                    players: [
                        { id: 'P1', name: 'Player 1', color: '#FF0000', isHuman: true },
                    ],
                    seed: 12345,
                    worldSize: 'medium' as const,
                    startingAge: 1 as const,
                    enableAI: true,
                },
            };

            const result = schemas.GameEvent.safeParse(event);
            expect(result.success).toBe(true);
        });

        it('should accept valid TURN_END event', () => {
            const event = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'TURN_END' as const,
                timestamp: '2024-01-01T00:00:00.000Z',
                playerId: 'P1',
                payload: { playerId: 'P1' },
            };

            const result = schemas.GameEvent.safeParse(event);
            expect(result.success).toBe(true);
        });

        it('should accept valid AGE_ADVANCE event', () => {
            const event = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'AGE_ADVANCE' as const,
                timestamp: '2024-01-01T00:00:00.000Z',
                payload: { fromAge: 1, toAge: 2 },
            };

            const result = schemas.GameEvent.safeParse(event);
            expect(result.success).toBe(true);
        });

        it('should accept valid POWER_ROLL event', () => {
            const event = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'POWER_ROLL' as const,
                timestamp: '2024-01-01T00:00:00.000Z',
                playerId: 'P1',
                payload: { playerId: 'P1', result: 10 },
            };

            const result = schemas.GameEvent.safeParse(event);
            expect(result.success).toBe(true);
        });

        it('should accept valid CELL_UPDATE event', () => {
            const event = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'CELL_UPDATE' as const,
                timestamp: '2024-01-01T00:00:00.000Z',
                payload: {
                    cellId: 'cell_0',
                    changes: { population: 200 },
                },
            };

            const result = schemas.GameEvent.safeParse(event);
            expect(result.success).toBe(true);
        });

        it('should reject event with invalid UUID', () => {
            const event = {
                id: 'not-a-uuid',
                type: 'GAME_START' as const,
                timestamp: '2024-01-01T00:00:00.000Z',
                payload: {
                    players: [],
                    seed: 12345,
                    worldSize: 'medium' as const,
                    startingAge: 1 as const,
                    enableAI: true,
                },
            };

            const result = schemas.GameEvent.safeParse(event);
            expect(result.success).toBe(false);
        });

        it('should reject event with invalid timestamp', () => {
            const event = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'GAME_START' as const,
                timestamp: 'not-a-timestamp',
                payload: {
                    players: [],
                    seed: 12345,
                    worldSize: 'medium' as const,
                    startingAge: 1 as const,
                    enableAI: true,
                },
            };

            const result = schemas.GameEvent.safeParse(event);
            expect(result.success).toBe(false);
        });
    });
});

// ============================================================================
// UI STATE SCHEMA TESTS
// ============================================================================

describe('UI State Schemas', () => {
    describe('UIState', () => {
        const validUIState = {
            selection: {
                selectedCellId: 'cell_0',
                hoveredCellId: 'cell_1',
                selectedPlayerId: 'P1',
            },
            displayMode: 'terrain' as const,
            panels: {
                controlPanel: true,
                cellInfo: false,
                regionStats: false,
                aiController: false,
            },
            camera: {
                zoom: 1.5,
                rotationX: 0.5,
                rotationY: 0.3,
            },
        };

        it('should accept valid UI state', () => {
            const result = schemas.UIState.safeParse(validUIState);
            expect(result.success).toBe(true);
        });

        it('should accept UI state with empty selection', () => {
            const emptySelectionState = {
                ...validUIState,
                selection: {},
            };

            const result = schemas.UIState.safeParse(emptySelectionState);
            expect(result.success).toBe(true);
        });

        it('should accept all display modes', () => {
            const displayModes = [
                'terrain', 'political', 'cultural', 'elevation',
                'temperature', 'moisture', 'population',
            ] as const;

            displayModes.forEach((mode) => {
                const state = { ...validUIState, displayMode: mode };
                const result = schemas.UIState.safeParse(state);
                expect(result.success).toBe(true);
            });
        });
    });
});

// ============================================================================
// HELPER FUNCTION TESTS
// ============================================================================

describe('Helper Functions', () => {
    describe('validate', () => {
        it('should return success for valid data', () => {
            const result = schemas.validate(schemas.PlayerId, 'P1');
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe('P1');
            }
        });

        it('should return error for invalid data', () => {
            const result = schemas.validate(schemas.PlayerId, 'invalid');
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBeInstanceOf(z.ZodError);
            }
        });
    });

    describe('validateOrThrow', () => {
        it('should return data for valid input', () => {
            const data = schemas.validateOrThrow(schemas.PlayerId, 'P1');
            expect(data).toBe('P1');
        });

        it('should throw for invalid input', () => {
            expect(() => {
                schemas.validateOrThrow(schemas.PlayerId, 'invalid');
            }).toThrow();
        });
    });

    describe('formatZodError', () => {
        it('should format Zod error as string', () => {
            const result = schemas.PlayerId.safeParse('invalid');
            if (!result.success) {
                const formatted = schemas.formatZodError(result.error);
                expect(typeof formatted).toBe('string');
                expect(formatted.length).toBeGreaterThan(0);
            }
        });
    });
});

// ============================================================================
// TYPE INFERENCE TESTS
// ============================================================================

describe('Type Inference', () => {
    it('should infer correct types from schemas', () => {
        // These tests ensure that the inferred types match what we expect
        type PlayerId = z.infer<typeof schemas.PlayerId>;
        type Cell = z.infer<typeof schemas.Cell>;
        type GameEvent = z.infer<typeof schemas.GameEvent>;

        // Type assertions (compile-time checks)
        const playerId: PlayerId = 'P1';
        expect(typeof playerId).toBe('string');

        const cell: Cell = {
            id: 'cell_0',
            q: 0,
            r: 0,
            elevation: 0.5,
            moisture: 0.5,
            temperature: 0.5,
            biome: 'plains',
            population: 100,
            development: 0.5,
        };
        expect(cell.id).toBe('cell_0');

        // GameEvent is a discriminated union, so we can test specific types
        const gameStartEvent: GameEvent = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'GAME_START',
            timestamp: '2024-01-01T00:00:00.000Z',
            payload: {
                players: [],
                seed: 12345,
                worldSize: 'medium',
                startingAge: 1,
                enableAI: true,
            },
        };
        expect(gameStartEvent.type).toBe('GAME_START');
    });
});
