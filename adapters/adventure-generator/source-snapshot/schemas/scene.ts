
import { z } from "zod";
import { IdSchema, SceneTypeEnum } from "./common";
export { SceneTypeEnum };

export const SceneDetailsSchema = z.object({
    introduction: z.string(),
    interactionPoints: z.array(z.string()),
    npcs: z.array(z.object({
        name: z.string(),
        description: z.string(),
        motivation: z.string()
    })),
    dmNotes: z.string()
});

export const SceneSchema = z.object({
    id: IdSchema,
    title: z.string(),
    type: SceneTypeEnum,
    challenge: z.string(),
    locationId: z.string().optional(),
    details: SceneDetailsSchema.optional()
});

export type Scene = z.infer<typeof SceneSchema>;
export type SceneDetails = z.infer<typeof SceneDetailsSchema>;
