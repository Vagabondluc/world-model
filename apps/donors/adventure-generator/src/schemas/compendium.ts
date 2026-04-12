import { z } from 'zod';
import { LoreEntrySchema, CompendiumEntrySchema } from './lore';

export const CompendiumStateExportSchema = z.object({
    loreEntries: z.array(LoreEntrySchema).optional().default([]),
    compendiumEntries: z.array(CompendiumEntrySchema).optional().default([]),
});
