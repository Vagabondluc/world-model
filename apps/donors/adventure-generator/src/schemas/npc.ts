import { z } from "zod";
import { IdSchema, NpcTypeEnum, OriginContextSchema } from "./common";

export { NpcTypeEnum };

// --- NPC Details Sub-schemas ---
export const MinorNpcDetailsSchema = z.object({
    race: z.string(),
    name: z.string(),
    gender: z.string(),
    sexualPreference: z.string(),
    personality: z.string(),
    physicalDescriptor: z.string(),
    alignment: z.string(),
    speechExample: z.string(),
    job: z.string(),
    jobReason: z.string(),
    skills: z.string(),
    secret: z.string(),
    questHook: z.string(),
    inventory: z.string(),
    comparison: z.string(),
    imageUrl: z.string().optional(),
});

export const MajorNpcDetailsSchema = z.object({
    table: z.object({
        factionAffiliation: z.string(),
        name: z.string(),
        race: z.string(),
        role: z.string(),
        appearance: z.string(),
        alignment: z.string(),
        motivations: z.string(),
        personality: z.string(),
        flaws: z.string(),
        catchphrase: z.string(),
        mannerisms: z.string(),
        speech: z.string(),
        availableKnowledge: z.string(),
        hiddenKnowledge: z.string(),
        bonds: z.string(),
        roleplayingCues: z.string(),
    }),
    backstory: z.string(),
    personalityDetails: z.object({
        motivations: z.string(),
        morals: z.string(),
        personality: z.string(),
        flaws: z.string(),
    }),
    memorySummary: z.string().optional().describe("Consolidated narrative history and recent player interactions."),
    imageUrl: z.string().optional(),
});

export const CreatureDetailsSchema = z.object({
    table: z.object({
        creatureType: z.string(),
        size: z.string(),
        alignment: z.string(),
        armorClass: z.string(),
        hitPoints: z.string(),
        speed: z.string(),
        senses: z.string(),
        languages: z.string(),
        challengeRating: z.string(),
        keyAbilities: z.string(),
        role: z.string(),
    }),
    abilityScores: z.object({
        str: z.number().int(),
        dex: z.number().int(),
        con: z.number().int(),
        int: z.number().int(),
        wis: z.number().int(),
        cha: z.number().int(),
    }).optional(),
    savingThrows: z.record(z.string(), z.number()).optional(),
    skills: z.record(z.string(), z.number()).optional(),
    damageVulnerabilities: z.array(z.string()).optional(),
    damageResistances: z.array(z.string()).optional(),
    damageImmunities: z.array(z.string()).optional(),
    conditionImmunities: z.array(z.string()).optional(),
    abilitiesAndTraits: z.string(), // Markdown content
    actions: z.string(), // Markdown content
    legendaryActions: z.string().optional(),
    roleplayingAndTactics: z.string(),
    imageUrl: z.string().optional(),
});

// Union of all possible NPC details
export const NpcDetailsSchema = z.union([
    MinorNpcDetailsSchema,
    MajorNpcDetailsSchema,
    CreatureDetailsSchema
]);

export type NpcDetails = z.infer<typeof NpcDetailsSchema>;

// --- NPC Schema ---
export const NpcSchema = z.object({
    id: IdSchema,
    name: z.string(),
    description: z.string(),
    type: NpcTypeEnum,
    factionId: z.string().optional(),
    details: NpcDetailsSchema.optional(),
    statblock: z.string().optional(), // Added for consistency
});

export type NPC = z.infer<typeof NpcSchema>;

// --- Saved Monster Schema ---
export const SavedMonsterSchema = z.object({
    id: IdSchema,
    name: z.string(),
    description: z.string().optional(),
    profile: CreatureDetailsSchema,
    statblock: z.string().optional(),
    origin: OriginContextSchema.optional(),
    source: z.string().optional(), // e.g. "a5e", "tob1-2023"
});

export type SavedMonster = z.infer<typeof SavedMonsterSchema>;

export const NpcPersonaSchema = z.object({
    name: z.string(),
    race: z.string(),
    role: z.string(),
    alignment: z.string(),
    appearance: z.string(),
    motivations: z.string(),
    personalityTraits: z.string(),
    flaws: z.string(),
    catchphrase: z.string(),
    mannerisms: z.string(),
    speechPatterns: z.string(),
    knowledgeAvailable: z.string(),
    knowledgeSecret: z.string(),
    bonds: z.string(),
    roleplayingCues: z.array(z.string()),
    backstory: z.string(),
    detailedPersonality: z.string(),
    archetype: z.string().optional(),
    motivation: z.string().optional(),
    quirk: z.string().optional(),
    flaw: z.string().optional(),
});

export type NpcPersona = z.infer<typeof NpcPersonaSchema>;
