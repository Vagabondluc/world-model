import { z } from 'zod';

// --- EROSION (docs/26-erosion-sediment.md) ---
export enum LithologyClass {
  SOFT_SOIL = 'SOFT_SOIL',
  SEDIMENTARY = 'SEDIMENTARY',
  METAMORPHIC = 'METAMORPHIC',
  IGNEOUS = 'IGNEOUS'
}
export const LithologyClassSchema = z.nativeEnum(LithologyClass);

export const ElevationDeltaCellSchema = z.number().int();
export const SedimentFieldCellSchema = z.number().int().nonnegative();

// --- VOXEL PROJECTION (docs/23-voxel-projection.md) ---
export const VoxelAnomalySchema = z.object({
  id: z.number().int().nonnegative(),
  cellId: z.number().int().nonnegative(),
  depthRange: z.tuple([z.number(), z.number()]),
  kind: z.enum(["PORTAL", "RIFT", "RUIN"]),
  seedTag: z.number().int()
});
export type VoxelAnomaly = z.infer<typeof VoxelAnomalySchema>;
