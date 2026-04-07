import { z } from 'zod';

export const DelveThemeEnum = z.enum(['crypt', 'ruin', 'cavern', 'tower', 'sewer', 'haunted_mansion']);
export const DelveRoomTypeEnum = z.enum(['guardian', 'puzzle', 'trick', 'climax', 'reward']);
export const MonsterTierEnum = z.enum(['tier1', 'tier2', 'tier3', 'tier4']);
export const DelveViewStateEnum = z.enum(['setup', 'concepts', 'hub', 'room-editor']);

export const SensoryPackageSchema = z.object({
    sound: z.string(),
    smell: z.string(),
    feel: z.string(),
});

export const MechanicsPackageSchema = z.object({
    encounter: z.object({
        monsters: z.array(z.string()),
        difficulty: z.string(),
        xp: z.number().optional(),
    }).optional(),
    trap: z.object({
        name: z.string().optional(),
        trigger: z.string(),
        effect: z.string(),
        dc: z.number(),
        spotDC: z.number(),
        disarmDC: z.number(),
    }).optional(),
    puzzle: z.object({
        type: z.string(),
        description: z.string(),
        solution: z.string(),
    }).optional(),
    treasure: z.array(z.string()).optional(),
});

export const DelveSceneNodeSchema = z.object({
    id: z.string(),
    stage: DelveRoomTypeEnum,
    title: z.string(),
    narrative: z.string(),
    sensory: SensoryPackageSchema,
    mechanics: MechanicsPackageSchema,
    features: z.array(z.string()),
    emotionalBeat: z.string(),
    thematicTags: z.array(z.string()),
    continuityRefs: z.array(z.string()),
    externalRef: z.string().optional(),
    nodeType: z.enum(['standard', 'narrative-encounter']),
});

export const DelveConceptSchema = z.object({
    id: z.string(),
    title: z.string(),
    theme: DelveThemeEnum,
    description: z.string(),
    tags: z.array(z.string()),
    visuals: z.string(),
});

export const DelveSchema = z.object({
    id: z.string(),
    title: z.string(),
    theme: DelveThemeEnum,
    level: z.number(),
    rooms: z.array(DelveSceneNodeSchema),
    createdAt: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
    seed: z.string().optional(),
    concept: DelveConceptSchema.optional(),
});
