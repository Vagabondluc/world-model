import { z } from 'zod';

// --- CARBON CYCLE (docs/04-carbon-cycle.md) ---
export const CarbonUnit01Schema = z.number().min(0).max(1);
export const CO2QSchema = z.number().int().min(0).max(65535);

export const CarbonStateSchema = z.object({
  co2Q: CO2QSchema,
  lastEquilibriumHash: z.number().int().optional()
});
export type CarbonState = z.infer<typeof CarbonStateSchema>;