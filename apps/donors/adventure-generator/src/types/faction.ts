
import { FACTION_CATEGORIES } from '../data/constants';
import { z } from 'zod';
import {
    FactionSchema,
    FactionDetailsSchema,
    FactionClockSchema,
    ClockEventSchema,
    ResolutionMethodEnum
} from '../schemas/faction'; // Direct import

export type FactionCategory = typeof FACTION_CATEGORIES[number];

// We infer from Zod to ensure single source of truth, avoiding manual interface drift
export type FactionDetails = z.infer<typeof FactionDetailsSchema>;
export type Faction = z.infer<typeof FactionSchema>;

// Clock-related types
export type FactionClock = z.infer<typeof FactionClockSchema>;
export type ClockEvent = z.infer<typeof ClockEventSchema>;
export type ResolutionMethod = z.infer<typeof ResolutionMethodEnum>;
