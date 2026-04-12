import { z } from "zod";
import { IdSchema } from "./common";

export const ConditionEnum = z.enum([
    "Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated",
    "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious", "Exhaustion"
]);

export const CombatantTypeEnum = z.enum(['player', 'npc']);

export const CombatantSchema = z.object({
    id: IdSchema,
    name: z.string(),
    type: CombatantTypeEnum,
    initiative: z.number(),
    hp: z.number(),
    maxHp: z.number(),
    ac: z.number(),
    conditions: z.array(ConditionEnum),
    sourceId: z.string().optional(),
    initiativeBonus: z.number(),
    xp: z.number().optional(),
});

export type Combatant = z.infer<typeof CombatantSchema>;
export type Condition = z.infer<typeof ConditionEnum>;

// --- Narrative Encounter Workflow Types (T-421) ---

export const EncounterStageEnum = z.enum([
    "Setup",
    "Approach",
    "Twist",
    "Challenge",
    "Climax",
    "Aftermath"
]);

export type EncounterStage = z.infer<typeof EncounterStageEnum>;

export const EncounterSensorySchema = z.object({
    sound: z.string(),
    smell: z.string(),
    feel: z.string(),
});
export type EncounterSensory = z.infer<typeof EncounterSensorySchema>;

// Structured monster entry for mechanics
export const EncounterMonsterSchema = z.object({
    name: z.string(),
    count: z.number().int(),
    role: z.string().optional(),
    cr: z.string().optional()
});

export const EncounterMechanicsSchema = z.object({
    // Upgraded from string[] to structured objects for better utility
    combatants: z.array(EncounterMonsterSchema).optional(),
    traps: z.array(z.string()).optional(),
    environment: z.string().optional(),
});

export type EncounterMechanics = z.infer<typeof EncounterMechanicsSchema>;

export const EncounterSceneNodeSchema = z.object({
    id: IdSchema,
    stage: EncounterStageEnum,
    narrative: z.string(),
    thematicTags: z.array(z.string()),
    emotionalShift: z.string(),
    mechanics: EncounterMechanicsSchema.optional(),
    sensory: EncounterSensorySchema.optional(),
    features: z.array(z.string()),
    continuityRefs: z.array(z.string()),
});

export type EncounterSceneNode = z.infer<typeof EncounterSceneNodeSchema>;

// This is the state for the wizard itself
export const EncounterWorkflowStateSchema = z.object({
    currentStage: EncounterStageEnum,
    nodes: z.array(EncounterSceneNodeSchema),
    locationContext: z.string().optional(),
    factionContext: z.array(z.string()).optional(),
});

export type EncounterWorkflowState = z.infer<typeof EncounterWorkflowStateSchema>;

// Schema for AI-generated narrative drafts (DEC-074)
export const AINarrativeResponseSchema = z.object({
    title: z.string().describe("A thematic title for the scene."),
    thinking: z.string().optional().describe("Hidden internal reasoning about the scene's narrative impact, logic, and connection to previous events."),
    narrative: z.string().describe("A rich, atmospheric, real-time description of the scene, incorporating all provided context."),
});

export type AINarrativeResponse = z.infer<typeof AINarrativeResponseSchema>;

// --- Faction Clock Automation (DEC-077) ---

// Faction context for encounters - tracks which factions are involved and their relationship
export const FactionContextSchema = z.object({
    factionId: z.string(),
    factionName: z.string(),
    relationship: z.enum(['ally', 'enemy', 'neutral']),
    clockImpact: z.object({
        clockId: z.string(),
        impact: z.enum(['advance', 'hinder', 'none']),
        segments: z.number().int().min(0).optional(),
    }).optional(),
});

export type FactionContext = z.infer<typeof FactionContextSchema>;

// Impact of an encounter outcome on a specific faction's clocks
export const FactionImpactSchema = z.object({
    factionId: z.string(),
    impact: z.enum(['advance', 'hinder', 'none']),
    segments: z.number().int().min(0),
    description: z.string(),
});

export type FactionImpact = z.infer<typeof FactionImpactSchema>;

// The outcome of an encounter
export const EncounterOutcomeSchema = z.object({
    result: z.enum(['victory', 'defeat', 'fled', 'negotiated', 'other']),
    description: z.string(),
    factionImpacts: z.array(FactionImpactSchema),
});

export type EncounterOutcome = z.infer<typeof EncounterOutcomeSchema>;

// Extended encounter schema with faction context and outcome tracking
export const EncounterWithFactionsSchema = z.object({
    id: z.string(),
    title: z.string(),
    location: z.string(),
    factions: z.array(z.string()), // Faction IDs
    factionContext: z.array(FactionContextSchema).default([]),
    stages: z.array(z.string()), // Stage node IDs
    outcome: EncounterOutcomeSchema.nullable(),
    outcomeTimestamp: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type EncounterWithFactions = z.infer<typeof EncounterWithFactionsSchema>;

export const EncounterTacticSchema = z.object({
    name: z.string(),
    role: z.string(),
    priority: z.string(),
    behavior: z.string(),
});

export type EncounterTactic = z.infer<typeof EncounterTacticSchema>;
