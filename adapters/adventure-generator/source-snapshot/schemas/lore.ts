
import { z } from "zod";
import { IdSchema, DateSchema, OriginContextSchema } from "./common";

// --- Enums ---
export const LoreTypeEnum = z.enum([
    'legend', 'history', 'culture', 'religion', 'organization', 'custom'
]);

export const CompendiumCategoryEnum = z.enum([
    'npc', 'location', 'faction', 'lore', 'item', 'event', 'hazard'
]);

export const VisibilityEnum = z.enum([
    'public', 'dm-only', 'player-discovered'
]);

export const ImportanceEnum = z.enum([
    'minor', 'major', 'critical'
]);

// --- Lore Entry Schema ---
export const LoreEntrySchema = z.object({
    id: IdSchema,
    type: LoreTypeEnum,
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()),
    relatedLocationIds: z.array(z.string()),
    relatedNpcIds: z.array(z.string()),
    relatedFactionsIds: z.array(z.string()),
    isPublicKnowledge: z.boolean(),
    sources: z.array(z.string()),
    createdAt: DateSchema,
    lastModified: DateSchema,
    origin: OriginContextSchema.optional(),
});

export type LoreEntry = z.infer<typeof LoreEntrySchema>;

// --- Compendium Entry Schema ---
export const CompendiumEntrySchema = z.object({
    id: z.string(),
    category: CompendiumCategoryEnum,
    title: z.string(),
    content: z.string(),
    summary: z.string().optional(),
    fullContent: z.string().optional(),
    tags: z.array(z.string()),
    relationships: z.object({
        connectedEntries: z.array(z.string()),
        mentionedIn: z.array(z.string()),
    }).optional(),
    visibility: VisibilityEnum.optional(),
    importance: ImportanceEnum.optional(),
    createdAt: z.date().optional(),
    lastModified: z.date().optional(),
    origin: OriginContextSchema.optional(),
});

export type CompendiumEntry = z.infer<typeof CompendiumEntrySchema>;
