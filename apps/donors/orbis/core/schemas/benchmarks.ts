import { z } from 'zod';

export const SpecModeSchema = z.enum(['strict_science', 'gameplay_accelerated']);
export type SpecMode = z.infer<typeof SpecModeSchema>;

export const ComparatorSchema = z.enum(['>', '<', '>=', '<=', '==', 'stabilizes_within']);
export type Comparator = z.infer<typeof ComparatorSchema>;

export const BenchmarkConditionSchema = z.object({
  metric: z.string(),
  operator: ComparatorSchema,
  target_value: z.number(),
  fail_code: z.string(),
  tolerance: z.number().optional(),
  window_ticks: z.number().int().nonnegative().optional()
});

export const BenchmarkScenarioSchema = z.object({
  metadata: z.object({
    id: z.string().regex(/^[a-z0-9_]+$/),
    name: z.string(),
    description: z.string(),
    spec_mode: SpecModeSchema,
    version: z.string()
  }),
  input_preset: z.record(z.string(), z.union([z.number(), z.boolean()])),
  contracts: z.object({
    time_limit_ticks: z.number().int().nonnegative(),
    success_conditions: z.array(BenchmarkConditionSchema).nonempty(),
    fail_conditions: z.array(BenchmarkConditionSchema).optional()
  })
});
export type BenchmarkScenario = z.infer<typeof BenchmarkScenarioSchema>;