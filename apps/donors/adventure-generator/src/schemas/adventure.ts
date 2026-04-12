import { z } from "zod";
import { SceneSchema } from "./scene";
import { LocationSchema } from "./location";
import { NpcSchema } from "./npc";
import { FactionSchema } from "./faction";

// --- Adventure Hooks ---
export const SimpleAdventureSchema = z.object({
    type: z.literal('simple'),
    premise: z.string(),
    origin: z.string(),
    positioning: z.string(),
    stakes: z.string()
});

export const DetailedAdventureSchema = z.object({
    type: z.literal('detailed'),
    title: z.string(),
    plot_type: z.array(z.string()),
    tags: z.array(z.string()),
    hook: z.string(),
    player_buy_in: z.string(),
    starter_scene: z.string(),
    gm_notes: z.object({
        twists_applied: z.array(z.string()),
        escalation: z.string(),
        tier_scaling: z.record(z.string(), z.string())
    })
});

export const GeneratedAdventureSchema = z.union([
    SimpleAdventureSchema,
    DetailedAdventureSchema
]);

export type SimpleAdventure = z.infer<typeof SimpleAdventureSchema>;
export type DetailedAdventure = z.infer<typeof DetailedAdventureSchema>;
export type GeneratedAdventure = z.infer<typeof GeneratedAdventureSchema>;

// --- Adventure Outline (Composite) ---
// This schema represents the raw output from the AI when generating an outline.
// We strictly OMIT 'details' fields here because they often involve complex ZodUnions
// which can cause issues with standard JSON schema conversion if not handled perfectly,
// and we don't want the AI generating full details at this stage anyway.
export const AdventureOutlineSchema = z.object({
    scenes: z.array(SceneSchema.omit({ id: true, locationId: true, details: true }).extend({ locationName: z.string().optional() })),
    locations: z.array(LocationSchema.omit({ id: true, details: true })),
    npcs: z.array(NpcSchema.omit({ id: true, factionId: true, details: true }).extend({ faction: z.string().optional() })),
    factions: z.array(FactionSchema.omit({ id: true, details: true }))
});

export type AdventureOutline = z.infer<typeof AdventureOutlineSchema>;