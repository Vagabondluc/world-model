
import { z } from "zod";

export const TrapTierEnum = z.enum(['1-4', '5-10', '11-16', '17-20']);

export const TrapRuleSchema = z.object({
    type: z.enum(['Attack Roll', 'Saving Throw', 'Automatic']),
    stat: z.enum(['Strength', 'Dexterity', 'Constitution', 'Wisdom', 'Intelligence', 'Charisma']).optional(),
    dc: z.number().int().optional(),
    attackBonus: z.number().int().optional(),
    damage: z.string().optional(),
    condition: z.string().optional(),
    area: z.string().optional(),
});

export const TrapCountermeasuresSchema = z.object({
    detection: z.object({
        skill: z.string(),
        dc: z.number().int(),
        details: z.string(),
    }),
    disarm: z.object({
        skill: z.string(),
        dc: z.number().int(),
        details: z.string(),
    }),
});

export const GeneratedTrapSchema = z.object({
    name: z.string(),
    description: z.string(),
    tier: TrapTierEnum,
    type: z.enum(['mechanical', 'magical', 'natural', 'complex', 'divine', 'psionic']),
    tags: z.array(z.string()),
    trigger: z.string(),
    effect: z.string(),
    rules: z.array(TrapRuleSchema),
    countermeasures: TrapCountermeasuresSchema,
});

export type TrapTier = z.infer<typeof TrapTierEnum>;
export type TrapRule = z.infer<typeof TrapRuleSchema>;
export type GeneratedTrap = z.infer<typeof GeneratedTrapSchema>;
