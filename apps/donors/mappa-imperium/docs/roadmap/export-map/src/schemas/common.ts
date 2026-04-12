
import { z } from "zod";

// --- Shared Enums ---
export const BiomeTypeEnum = z.enum([
    'arctic', 'coastal', 'desert', 'forest', 'grassland',
    'hill', 'jungle', 'mountain', 'swamp', 'underdark',
    'underwater', 'urban', 'planar', 'wasteland', 'volcanic',
    'ocean', 'lake'
]);

export const LocationTypeEnum = z.enum([
    'Battlemap', 'Dungeon', 'Settlement', 'Special Location'
]);

export const DiscoveryStatusEnum = z.enum([
    'undiscovered', 'rumored', 'explored', 'mapped'
]);

export const NpcTypeEnum = z.enum([
    'Minor', 'Major', 'Antagonist', 'Creature'
]);

export const FactionCategoryEnum = z.enum([
    "Government & Authority", "Religious Organizations", "Criminal Enterprises",
    "Economic & Trade", "Arcane & Scholarly", "Adventuring & Mercenary",
    "Racial & Cultural", "Ideological & Revolutionary", "Secret & Shadow",
    "Planar & Extraplanar", "Environmental & Territorial"
]);

export const SceneTypeEnum = z.enum([
    'Exploration', 'Combat', 'NPC Interaction', 'Dungeon'
]);

// --- Shared Primitive Schemas ---
// Flexible date parser that handles ISO strings often returned by JSON serialization
export const DateSchema = z.union([z.date(), z.string()])
    .transform((val) => new Date(val));

// ID Generator fallback if needed during parsing
export const IdSchema = z.string().min(1);

// --- Origin Context ---
export const OriginContextSchema = z.object({
    type: z.enum(['generator', 'manual', 'import']),
    sourceId: z.string().optional(), // ID of the parent adventure/hook
    generatorStep: z.string().optional(), // e.g., 'hooks', 'outline'
    historyStateId: z.string().optional(), // ID in HistoryStore to restore state
});

export type OriginContext = z.infer<typeof OriginContextSchema>;
