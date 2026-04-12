/**
 * Zod Data Validation Schemas for World Builder
 * 
 * This module provides comprehensive runtime validation for all World Builder domain types.
 * All schemas are designed to be type-safe and provide clear error messages.
 */

import { z } from 'zod';

// ============================================================================
// UTILITY SCHEMAS
// ============================================================================

/**
 * Hex color string format (#RRGGBB)
 */
export const HexColorSchema = z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color in format #RRGGBB');

export type HexColor = z.infer<typeof HexColorSchema>;

/**
 * Player identifier (e.g., "P1", "P2", "P3")
 */
export const PlayerIdSchema = z
    .string()
    .regex(/^P\d+$/, 'Must be a valid player ID in format P{number}');

export type PlayerId = z.infer<typeof PlayerIdSchema>;

/**
 * Cell identifier (e.g., "cell_123")
 */
export const CellIdSchema = z
    .string()
    .regex(/^cell_\d+$/, 'Must be a valid cell ID in format cell_{number}');

export type CellId = z.infer<typeof CellIdSchema>;

/**
 * Culture identifier (e.g., "culture_abc123")
 */
export const CultureIdSchema = z
    .string()
    .regex(/^culture_[a-zA-Z0-9_]+$/, 'Must be a valid culture ID in format culture_{string}');

export type CultureId = z.infer<typeof CultureIdSchema>;

/**
 * Civilization identifier (e.g., "civ_xyz789")
 */
export const CivilizationIdSchema = z
    .string()
    .regex(/^civ_[a-zA-Z0-9_]+$/, 'Must be a valid civilization ID in format civ_{string}');

export type CivilizationId = z.infer<typeof CivilizationIdSchema>;

/**
 * Event identifier (UUID format)
 */
export const EventIdSchema = z
    .string()
    .uuid('Must be a valid UUID');

export type EventId = z.infer<typeof EventIdSchema>;

/**
 * Timestamp (ISO 8601 format)
 */
export const TimestampSchema = z
    .string()
    .datetime('Must be a valid ISO 8601 datetime');

export type Timestamp = z.infer<typeof TimestampSchema>;

/**
 * Non-negative number
 */
export const NonNegativeNumberSchema = z
    .number()
    .nonnegative('Must be non-negative');

/**
 * Positive number
 */
export const PositiveNumberSchema = z
    .number()
    .positive('Must be positive');

/**
 * Percentage (0-1)
 */
export const PercentageSchema = z
    .number()
    .min(0, 'Must be at least 0')
    .max(1, 'Must be at most 1');

// ============================================================================
// BIOME TYPES
// ============================================================================

export const BiomeTypeEnum = z.enum([
    // Water
    'deep_ocean',
    'ocean',
    'beach', // Not currently generated but supported in colors

    // Land
    'tundra',
    'snow', // Not currently generated but supported
    'taiga',
    'grassland',
    'forest',
    'rainforest',
    'desert',
    'savanna',
    'tropical_forest',

    // Elevation
    'mountain',
    'highland',

    // Legacy/Unused (Keeping to prevent breaking changes if used elsewhere, but marked as such)
    'coast',
    'plains',
    'dense_forest',
    'jungle',
    'ice',
    'hills',
    'swamp',
    'marsh',
    'lake',
    'river',
]);

export type BiomeType = z.infer<typeof BiomeTypeEnum>;

// ============================================================================
// CORE ENTITY SCHEMAS
// ============================================================================

/**
 * Player configuration
 */
export const PlayerConfigSchema = z.object({
    id: PlayerIdSchema,
    name: z.string().min(1, 'Player name is required').max(50, 'Player name too long'),
    color: HexColorSchema,
    isHuman: z.boolean(),
    cultureId: CultureIdSchema.optional(),
});

export type PlayerConfig = z.infer<typeof PlayerConfigSchema>;

/**
 * Player (runtime state)
 */
export const PlayerSchema = PlayerConfigSchema.extend({
    ap: z.number().int().min(0, 'Action points cannot be negative').default(0),
});

export type Player = z.infer<typeof PlayerSchema>;

/**
 * World size options
 */
export const WorldSizeEnum = z.enum(['small', 'medium', 'large']);

export type WorldSize = z.infer<typeof WorldSizeEnum>;

/**
 * Game session configuration
 */
export const GameSessionConfigSchema = z.object({
    players: z.array(PlayerConfigSchema).min(1, 'At least one player is required'),
    seed: z.number().int().default(Date.now()),
    worldSize: WorldSizeEnum.default('medium'),
    startingAge: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
    enableAI: z.boolean().default(true),
});

export type GameSessionConfig = z.infer<typeof GameSessionConfigSchema>;

/**
 * Cell entity
 */
export const CellSchema = z.object({
    id: CellIdSchema,
    q: z.number().int('q coordinate must be an integer'),
    r: z.number().int('r coordinate must be an integer'),
    elevation: PercentageSchema,
    moisture: PercentageSchema,
    temperature: PercentageSchema,
    biome: BiomeTypeEnum,
    ownerId: CivilizationIdSchema.optional(),
    cultureId: CultureIdSchema.optional(),
    population: z.number().int().min(0, 'Population cannot be negative').default(0),
    development: PercentageSchema.default(0),
});

export type Cell = z.infer<typeof CellSchema>;

/**
 * Culture entity
 */
export const CultureSchema = z.object({
    id: CultureIdSchema,
    name: z.string().min(1, 'Culture name is required').max(100, 'Culture name too long'),
    language: z.string().min(1, 'Language is required'),
    traits: z.array(z.string()).default([]),
    originCellId: CellIdSchema,
    color: HexColorSchema,
    foundedYear: z.number().int().min(0, 'Founded year cannot be negative'),
});

export type Culture = z.infer<typeof CultureSchema>;

/**
 * Civilization entity
 */
export const CivilizationSchema = z.object({
    id: CivilizationIdSchema,
    name: z.string().min(1, 'Civilization name is required').max(100, 'Civilization name too long'),
    cultureId: CultureIdSchema,
    capitalCellId: CellIdSchema,
    controlledCells: z.set(CellIdSchema),
    foundedYear: z.number().int().min(0, 'Founded year cannot be negative'),
    color: HexColorSchema,
});

export type Civilization = z.infer<typeof CivilizationSchema>;

/**
 * World state
 */
export const WorldStateSchema = z.object({
    cells: z.map(CellIdSchema, CellSchema),
    cultures: z.map(CultureIdSchema, CultureSchema),
    civilizations: z.map(CivilizationIdSchema, CivilizationSchema),
    year: z.number().int().min(0, 'Year cannot be negative').default(0),
    generationParams: z.object({
        seed: z.number().int(),
        worldSize: WorldSizeEnum,
        tectonicPlates: z.number().int().min(1).default(7),
        erosionIterations: z.number().int().min(0).default(100),
        temperatureVariation: PercentageSchema.default(0.5),
        moistureVariation: PercentageSchema.default(0.5),
    }).default({
        seed: Date.now(),
        worldSize: 'medium',
        tectonicPlates: 7,
        erosionIterations: 100,
        temperatureVariation: 0.5,
        moistureVariation: 0.5,
    }),
});

export type WorldState = z.infer<typeof WorldStateSchema>;

/**
 * Game age
 */
export const GameAgeEnum = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export type GameAge = z.infer<typeof GameAgeEnum>;

/**
 * Game state
 */
export const GameStateSchema = z.object({
    config: GameSessionConfigSchema.optional(),
    players: z.array(PlayerSchema).default([]),
    activePlayerId: PlayerIdSchema,
    age: GameAgeEnum.default(1),
    round: PositiveNumberSchema.default(1),
    turn: PositiveNumberSchema.default(1),
    events: z.array(z.any()).default([]), // GameEvent validated separately
    world: WorldStateSchema,
    revokedEventIds: z.set(EventIdSchema).default(new Set()),
});

export type GameState = z.infer<typeof GameStateSchema>;

// ============================================================================
// EVENT PAYLOAD SCHEMAS
// ============================================================================

/**
 * Core event types
 */
export const CoreEventTypeEnum = z.enum([
    'GAME_START',
    'TURN_END',
    'AGE_ADVANCE',
    'POWER_ROLL',
    'EVENT_REVOKE',
]);

export type CoreEventType = z.infer<typeof CoreEventTypeEnum>;

/**
 * AI event types
 */
export const AIEventTypeEnum = z.enum([
    'AI_DECISION',
    'AI_ACTION',
]);

export type AIEventType = z.infer<typeof AIEventTypeEnum>;

/**
 * History event types
 */
export const HistoryEventTypeEnum = z.enum([
    'CELL_UPDATE',
    'CULTURE_FOUND',
    'CIVILIZATION_FOUND',
    'TERRITORY_CHANGE',
]);

export type HistoryEventType = z.infer<typeof HistoryEventTypeEnum>;

/**
 * All event types
 */
export const EventTypeEnum = CoreEventTypeEnum.or(AIEventTypeEnum).or(HistoryEventTypeEnum);

export type EventType = z.infer<typeof EventTypeEnum>;

/**
 * Base event schema
 */
export const BaseEventSchema = z.object({
    id: EventIdSchema,
    type: EventTypeEnum,
    timestamp: TimestampSchema.default(() => new Date().toISOString()),
    playerId: PlayerIdSchema.optional(),
});

export type BaseEvent = z.infer<typeof BaseEventSchema>;

/**
 * Game start event payload
 */
export const GameStartPayloadSchema = GameSessionConfigSchema;

export type GameStartPayload = z.infer<typeof GameStartPayloadSchema>;

/**
 * Turn end event payload
 */
export const TurnEndPayloadSchema = z.object({
    playerId: PlayerIdSchema,
});

export type TurnEndPayload = z.infer<typeof TurnEndPayloadSchema>;

/**
 * Age advance event payload
 */
export const AgeAdvancePayloadSchema = z.object({
    fromAge: z.number().int().min(1).max(3),
    toAge: z.number().int().min(1).max(3),
});

export type AgeAdvancePayload = z.infer<typeof AgeAdvancePayloadSchema>;

/**
 * Power roll event payload
 */
export const PowerRollPayloadSchema = z.object({
    playerId: PlayerIdSchema,
    result: z.number().int().min(1).max(20),
});

export type PowerRollPayload = z.infer<typeof PowerRollPayloadSchema>;

/**
 * Event revoke payload
 */
export const EventRevokePayloadSchema = z.object({
    eventId: EventIdSchema,
    reason: z.string().min(1, 'Reason is required'),
});

export type EventRevokePayload = z.infer<typeof EventRevokePayloadSchema>;

/**
 * AI decision event payload
 */
export const AIDecisionPayloadSchema = z.object({
    aiId: PlayerIdSchema,
    decision: z.string(),
    reasoning: z.string(),
    utilityScore: z.number().optional(),
});

export type AIDecisionPayload = z.infer<typeof AIDecisionPayloadSchema>;

/**
 * AI action event payload
 */
export const AIActionPayloadSchema = z.object({
    aiId: PlayerIdSchema,
    actionType: z.string(),
    targets: z.array(CellIdSchema).default([]),
    success: z.boolean().default(false),
});

export type AIActionPayload = z.infer<typeof AIActionPayloadSchema>;

/**
 * Cell update event payload
 */
export const CellUpdatePayloadSchema = z.object({
    cellId: CellIdSchema,
    changes: z.object({
        elevation: PercentageSchema.optional(),
        moisture: PercentageSchema.optional(),
        temperature: PercentageSchema.optional(),
        biome: BiomeTypeEnum.optional(),
        ownerId: CivilizationIdSchema.optional(),
        cultureId: CultureIdSchema.optional(),
        population: z.number().int().min(0).optional(),
        development: PercentageSchema.optional(),
    }),
});

export type CellUpdatePayload = z.infer<typeof CellUpdatePayloadSchema>;

/**
 * Culture found event payload
 */
export const CultureFoundPayloadSchema = z.object({
    cultureId: CultureIdSchema,
    cellId: CellIdSchema,
    name: z.string().min(1),
    language: z.string().min(1),
    traits: z.array(z.string()).default([]),
});

export type CultureFoundPayload = z.infer<typeof CultureFoundPayloadSchema>;

/**
 * Civilization found event payload
 */
export const CivilizationFoundPayloadSchema = z.object({
    civId: CivilizationIdSchema,
    cultureId: CultureIdSchema,
    capitalId: CellIdSchema,
    name: z.string().min(1),
});

export type CivilizationFoundPayload = z.infer<typeof CivilizationFoundPayloadSchema>;

/**
 * Territory change event payload
 */
export const TerritoryChangePayloadSchema = z.object({
    cellId: CellIdSchema,
    fromId: CivilizationIdSchema.optional(),
    toId: CivilizationIdSchema,
});

export type TerritoryChangePayload = z.infer<typeof TerritoryChangePayloadSchema>;

/**
 * Game event schema (discriminated union)
 */
export const GameEventSchema = z.discriminatedUnion('type', [
    // Core events
    BaseEventSchema.extend({
        type: z.literal('GAME_START'),
        payload: GameStartPayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('TURN_END'),
        payload: TurnEndPayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('AGE_ADVANCE'),
        payload: AgeAdvancePayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('POWER_ROLL'),
        payload: PowerRollPayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('EVENT_REVOKE'),
        payload: EventRevokePayloadSchema,
    }),
    // AI events
    BaseEventSchema.extend({
        type: z.literal('AI_DECISION'),
        payload: AIDecisionPayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('AI_ACTION'),
        payload: AIActionPayloadSchema,
    }),
    // History events
    BaseEventSchema.extend({
        type: z.literal('CELL_UPDATE'),
        payload: CellUpdatePayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('CULTURE_FOUND'),
        payload: CultureFoundPayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('CIVILIZATION_FOUND'),
        payload: CivilizationFoundPayloadSchema,
    }),
    BaseEventSchema.extend({
        type: z.literal('TERRITORY_CHANGE'),
        payload: TerritoryChangePayloadSchema,
    }),
]);

export type GameEvent = z.infer<typeof GameEventSchema>;

// ============================================================================
// WORLD GENERATION PARAMETER SCHEMAS
// ============================================================================

/**
 * World generation parameters
 */
export const WorldGenerationParamsSchema = z.object({
    seed: z.number().int(),
    worldSize: WorldSizeEnum,
    tectonicPlates: z.number().int().min(1).max(20).default(7),
    erosionIterations: z.number().int().min(0).max(1000).default(100),
    temperatureVariation: PercentageSchema.default(0.5),
    moistureVariation: PercentageSchema.default(0.5),
    seaLevel: PercentageSchema.default(0.5),
    mountainHeight: PercentageSchema.default(0.8),
    riverCount: z.number().int().min(0).max(100).default(20),
});

export type WorldGenerationParams = z.infer<typeof WorldGenerationParamsSchema>;

// ============================================================================
// UI STATE SCHEMAS
// ============================================================================

/**
 * Display mode options
 */
export const DisplayModeEnum = z.enum([
    'terrain',
    'political',
    'cultural',
    'elevation',
    'temperature',
    'moisture',
    'population',
]);

export type DisplayMode = z.infer<typeof DisplayModeEnum>;

/**
 * Panel visibility
 */
export const PanelVisibilitySchema = z.object({
    controlPanel: z.boolean().default(true),
    cellInfo: z.boolean().default(false),
    regionStats: z.boolean().default(false),
    aiController: z.boolean().default(false),
});

export type PanelVisibility = z.infer<typeof PanelVisibilitySchema>;

/**
 * Selection mode options
 */
export const SelectionModeEnum = z.enum(['SINGLE', 'REGION']);

export type SelectionMode = z.infer<typeof SelectionModeEnum>;

/**
 * Selection state
 */
export const SelectionStateSchema = z.object({
    selectedCellId: CellIdSchema.optional(),
    selectedCellIds: z.array(CellIdSchema).default([]),
    hoveredCellId: CellIdSchema.optional(),
    selectedPlayerId: PlayerIdSchema.optional(),
});

export type SelectionState = z.infer<typeof SelectionStateSchema>;

/**
 * UI state
 */
export const UIStateSchema = z.object({
    selection: SelectionStateSchema.default({
        selectedCellIds: [],
        selectedCellId: undefined,
        hoveredCellId: undefined,
        selectedPlayerId: undefined,
    }),
    displayMode: DisplayModeEnum.default('terrain'),
    selectionMode: SelectionModeEnum.default('SINGLE'),
    selectionRadius: PositiveNumberSchema.default(1),
    panels: PanelVisibilitySchema.default({}),
    camera: z.object({
        zoom: z.number().positive().default(1),
        rotationX: z.number().default(0),
        rotationY: z.number().default(0),
    }).default({
        zoom: 1,
        rotationX: 0,
        rotationY: 0,
    }),
});

export type UIState = z.infer<typeof UIStateSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate a value against a schema and return the result
 */
export function validate<T>(schema: z.ZodSchema<T>, value: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    error: z.ZodError;
} {
    const result = schema.safeParse(value);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}

/**
 * Validate a value against a schema and throw if invalid
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, value: unknown): T {
    return schema.parse(value);
}

/**
 * Format Zod error for display
 */
export function formatZodError(error: z.ZodError): string {
    return error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');
}

/**
 * Create a partial schema for updates
 */
export function createPartialSchema<T extends z.ZodTypeAny>(schema: T) {
    return schema.partial() as z.ZodObject<{
        [K in keyof z.infer<T>]: z.ZodOptionalAny;
    }>;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Utility schemas
    HexColor: HexColorSchema,
    PlayerId: PlayerIdSchema,
    CellId: CellIdSchema,
    CultureId: CultureIdSchema,
    CivilizationId: CivilizationIdSchema,
    EventId: EventIdSchema,
    Timestamp: TimestampSchema,
    NonNegativeNumber: NonNegativeNumberSchema,
    PositiveNumber: PositiveNumberSchema,
    Percentage: PercentageSchema,

    // Biome types
    BiomeType: BiomeTypeEnum,

    // Core entities
    PlayerConfig: PlayerConfigSchema,
    Player: PlayerSchema,
    GameSessionConfig: GameSessionConfigSchema,
    Cell: CellSchema,
    Culture: CultureSchema,
    Civilization: CivilizationSchema,
    WorldState: WorldStateSchema,
    GameState: GameStateSchema,

    // Events
    GameEvent: GameEventSchema,
    EventType: EventTypeEnum,

    // World generation
    WorldGenerationParams: WorldGenerationParamsSchema,

    // UI state
    UIState: UIStateSchema,
    DisplayMode: DisplayModeEnum,
    SelectionMode: SelectionModeEnum,
    SelectionState: SelectionStateSchema,
    PanelVisibility: PanelVisibilitySchema,

    // Helpers
    validate,
    validateOrThrow,
    formatZodError,
    createPartialSchema,
};
