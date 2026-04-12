
import { z } from "zod";
import { DateSchema, IdSchema, SceneTypeEnum } from "./common";
import { GeneratedAdventureSchema } from "./adventure";
import { SceneSchema, SceneDetailsSchema } from "./scene";
import { LocationSchema, LocationDetailsSchema } from "./location";
import { NpcSchema, NpcDetailsSchema } from "./npc";
import { FactionSchema, FactionDetailsSchema } from "./faction";
import { GeneratedTrapSchema } from "./trap";
import { NpcPersonaSchema } from "./npc";
import { EncounterTacticSchema } from "./encounter";
import { DelveSchema, DelveConceptSchema, DelveViewStateEnum } from "./delve";

// --- Ancillary State Schemas ---
export const LoadingStateSchema = z.object({
    hooks: z.boolean(),
    refining: z.boolean(),
    outline: z.boolean(),
    details: z.object({ type: z.string(), id: z.string() }).nullable(),
    statblock: z.string().nullable()
});

export type LoadingState = z.infer<typeof LoadingStateSchema>;

export const DetailingEntitySchema = z.object({
    type: z.enum(['scene', 'location', 'npc', 'faction']),
    id: z.string()
}).nullable();

export type DetailingEntity = z.infer<typeof DetailingEntitySchema>;

// --- Type-Safe History Schemas ---
const BaseHistorySchema = z.object({
    id: IdSchema,
    timestamp: DateSchema,
    label: z.string(),
});

const HooksHistorySchema = BaseHistorySchema.extend({
    type: z.literal('hooks'),
    data: z.object({
        adventures: z.array(GeneratedAdventureSchema),
        matrix: z.array(z.array(z.number())).nullable(),
    }),
});

const OutlineHistorySchema = BaseHistorySchema.extend({
    type: z.literal('outline'),
    data: z.object({
        scenes: z.array(SceneSchema),
        locations: z.array(LocationSchema),
        npcs: z.array(NpcSchema),
        factions: z.array(FactionSchema),
        selectedHook: GeneratedAdventureSchema.nullable(),
    }),
});

const SceneHistorySchema = BaseHistorySchema.extend({
    type: z.literal('scene'),
    data: z.object({ id: z.string(), details: SceneDetailsSchema }),
});

const NpcHistorySchema = BaseHistorySchema.extend({
    type: z.literal('npc'),
    data: z.object({ id: z.string(), details: NpcDetailsSchema }),
});

const LocationHistorySchema = BaseHistorySchema.extend({
    type: z.literal('location'),
    data: z.object({ id: z.string(), details: LocationDetailsSchema }),
});

const FactionHistorySchema = BaseHistorySchema.extend({
    type: z.literal('faction'),
    data: z.object({ id: z.string(), details: FactionDetailsSchema }),
});

const StatblockHistorySchema = BaseHistorySchema.extend({
    type: z.literal('statblock'),
    data: z.object({ id: z.string(), statblock: z.string() }),
});

export const GenerationHistorySchema = z.discriminatedUnion('type', [
    HooksHistorySchema,
    OutlineHistorySchema,
    SceneHistorySchema,
    NpcHistorySchema,
    LocationHistorySchema,
    FactionHistorySchema,
    StatblockHistorySchema,
]);

export type GenerationHistory = z.infer<typeof GenerationHistorySchema>;


// --- Main Generator State Schema ---
export const GeneratorStateSchema = z.object({
    step: z.enum(['initial', 'hooks', 'outline', 'delve']),
    context: z.string(),
    matrix: z.array(z.array(z.number())).nullable(),
    detailingEntity: DetailingEntitySchema,
    loading: LoadingStateSchema,
    error: z.string().nullable(),
    generationHistory: z.array(GenerationHistorySchema),
    
    // Configuration
    generationMethod: z.enum(['arcane', 'pattern', 'delve']),
    combinationMethod: z.string(),
    primaryPlot: z.string(),
    primaryTwist: z.string(),
    secondaryPlot: z.string(),
    secondaryTwist: z.string(),
    sceneCount: z.number().int(),
    sceneTypes: z.record(SceneTypeEnum, z.boolean()),
    
    // Filters
    searchQuery: z.string(),
    filterLocationId: z.string(),
    filterFactionId: z.string(),
    
    // Data
    adventures: z.array(GeneratedAdventureSchema),
    selectedHook: GeneratedAdventureSchema.nullable(),
    adventureOutline: z.array(SceneSchema),
    locations: z.array(LocationSchema),
    npcs: z.array(NpcSchema),
    factions: z.array(FactionSchema)
});

export type GeneratorState = z.infer<typeof GeneratorStateSchema>;

export const GeneratorStateCleanedSchema = z.object({
    matrix: z.array(z.array(z.number())).nullable(),
    adventures: z.array(GeneratedAdventureSchema),
    selectedHook: GeneratedAdventureSchema.nullable(),
    currentAdventureCompendiumIds: z.array(z.string()),
    activeDelve: DelveSchema.nullable(),
    delveView: DelveViewStateEnum,
    currentConcepts: z.array(DelveConceptSchema),
    activeRoomId: z.string().nullable(),
    activeTraps: z.array(GeneratedTrapSchema),
    npcPersonas: z.array(NpcPersonaSchema),
    encounterDesigns: z.array(EncounterTacticSchema),

    context: z.string(),
    generationMethod: z.enum(['arcane', 'pattern', 'delve']),
    combinationMethod: z.string(),
    primaryPlot: z.string(),
    primaryTwist: z.string(),
    secondaryPlot: z.string(),
    secondaryTwist: z.string(),
    sceneCount: z.number().int(),
    sceneTypes: z.record(SceneTypeEnum, z.boolean()),

    generationHistory: z.array(GenerationHistorySchema),

    searchQuery: z.string(),
    filterLocationId: z.string(),
    filterFactionId: z.string(),
});

export type GeneratorStateCleaned = z.infer<typeof GeneratorStateCleanedSchema>;
