
import { z } from 'zod';
import { SettlementType } from '../types';
import { TerrainConfigSchema } from './configSchemas';

export const ProjectMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  version: z.string(),
  thumbnail: z.string().optional(),
});

export const WorldDeltaSchema = z.object({
  h: z.number().optional(),
  t: z.number().optional(),
  m: z.number().optional(),
  s: z.nativeEnum(SettlementType).optional(),
  d: z.string().optional(),
});

export const ProjectSaveSchema = z.object({
  meta: ProjectMetaSchema,
  world: z.object({
    seed: z.number(),
    config: TerrainConfigSchema,
  }),
  deltas: z.record(z.string(), WorldDeltaSchema),
});
