
import { z } from "zod";
import { IdSchema, FactionCategoryEnum } from "./common";
export { FactionCategoryEnum };

// ClockEvent Schema - For tracking progress events on clocks
export const ClockEventSchema = z.object({
    segment: z.number().int().min(1),
    description: z.string(),
    timestamp: z.string(), // ISO date string
    triggeredBy: z.enum(['downtime', 'encounter', 'manual'])
});

export type ClockEvent = z.infer<typeof ClockEventSchema>;

// ResolutionMethod enum for how clocks advance
export const ResolutionMethodEnum = z.enum(['simple', 'complex', 'blended']);
export type ResolutionMethod = z.infer<typeof ResolutionMethodEnum>;

// FactionClock Schema - Full clock definition with all properties
export const FactionClockSchema = z.object({
    id: z.string(),
    objective: z.string(),
    segments: z.number().int().min(4).max(12), // Typically 4, 6, or 8, but flexible
    progress: z.number().int().min(0),
    difficultyDC: z.number().int().nullable().optional(),
    resolutionMethod: ResolutionMethodEnum,
    allies: z.array(z.string()).default([]),
    enemies: z.array(z.string()).default([]),
    pcImpact: z.boolean().default(false),
    events: z.array(ClockEventSchema).default([])
}).refine(
    (clock) => clock.progress <= clock.segments,
    {
        message: "Progress cannot exceed total segments",
        path: ["progress"]
    }
);

export type FactionClock = z.infer<typeof FactionClockSchema>;

export const FactionDetailsSchema = z.object({
    identity: z.string(),
    ideology: z.string(),
    areaOfOperation: z.string(),
    powerLevel: z.string(),
    shortTermGoal: z.string(),
    midTermGoal: z.string(),
    longTermGoal: z.string(),
    clocks: z.array(FactionClockSchema).default([]),
});

export const FactionSchema = z.object({
    id: IdSchema,
    name: z.string(),
    goal: z.string(),
    category: FactionCategoryEnum,
    details: FactionDetailsSchema.optional()
});

export type Faction = z.infer<typeof FactionSchema>;
export type FactionDetails = z.infer<typeof FactionDetailsSchema>;
