
import { z } from "zod";
import { LoreEntrySchema, CompendiumEntrySchema, CompendiumCategoryEnum } from '../schemas/lore'; // Direct import

export type CompendiumCategory = z.infer<typeof CompendiumCategoryEnum>;

// Re-export Lore types from schema for use in rest of app
export type LoreEntry = z.infer<typeof LoreEntrySchema>;
export type CompendiumEntry = z.infer<typeof CompendiumEntrySchema>;

export interface CompendiumStateExport {
    loreEntries: LoreEntry[];
    compendiumEntries: CompendiumEntry[];
}
