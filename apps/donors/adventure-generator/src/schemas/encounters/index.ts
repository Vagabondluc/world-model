import { z } from 'zod';

export const CombatEncounterBalancerConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type CombatEncounterBalancerConfig = z.infer<typeof CombatEncounterBalancerConfigSchema>;

export const CombatEncounterBalancerResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type CombatEncounterBalancerResult = z.infer<typeof CombatEncounterBalancerResultSchema>;

export const CombatEncounterV2ConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type CombatEncounterV2Config = z.infer<typeof CombatEncounterV2ConfigSchema>;

export const CombatEncounterV2ResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type CombatEncounterV2Result = z.infer<typeof CombatEncounterV2ResultSchema>;

export const CombatEncounterConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type CombatEncounterConfig = z.infer<typeof CombatEncounterConfigSchema>;

export const CombatEncounterResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type CombatEncounterResult = z.infer<typeof CombatEncounterResultSchema>;

export const EncounterdesignOlderV1ConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type EncounterdesignOlderV1Config = z.infer<typeof EncounterdesignOlderV1ConfigSchema>;

export const EncounterdesignOlderV1ResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type EncounterdesignOlderV1Result = z.infer<typeof EncounterdesignOlderV1ResultSchema>;

export const EncounterdesignV1ConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type EncounterdesignV1Config = z.infer<typeof EncounterdesignV1ConfigSchema>;

export const EncounterdesignV1ResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type EncounterdesignV1Result = z.infer<typeof EncounterdesignV1ResultSchema>;

export const EncounterdesignV1DeprecatedConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type EncounterdesignV1DeprecatedConfig = z.infer<typeof EncounterdesignV1DeprecatedConfigSchema>;

export const EncounterdesignV1DeprecatedResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type EncounterdesignV1DeprecatedResult = z.infer<typeof EncounterdesignV1DeprecatedResultSchema>;

export const EncounterGenricBetaConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type EncounterGenricBetaConfig = z.infer<typeof EncounterGenricBetaConfigSchema>;

export const EncounterGenricBetaResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type EncounterGenricBetaResult = z.infer<typeof EncounterGenricBetaResultSchema>;

export const RpgadventureScenecraftingV1ConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type RpgadventureScenecraftingV1Config = z.infer<typeof RpgadventureScenecraftingV1ConfigSchema>;

export const RpgadventureScenecraftingV1ResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type RpgadventureScenecraftingV1Result = z.infer<typeof RpgadventureScenecraftingV1ResultSchema>;

export const SocialEventConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type SocialEventConfig = z.infer<typeof SocialEventConfigSchema>;

export const SocialEventResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type SocialEventResult = z.infer<typeof SocialEventResultSchema>;

export const TrapPrepConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type TrapPrepConfig = z.infer<typeof TrapPrepConfigSchema>;

export const TrapPrepResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type TrapPrepResult = z.infer<typeof TrapPrepResultSchema>;

export const UrbanCrawlConfigSchema = z.object({
  title: z.string().describe('The title of the encounter'),
  level: z.number().int().default(1),
});
export type UrbanCrawlConfig = z.infer<typeof UrbanCrawlConfigSchema>;

export const UrbanCrawlResultSchema = z.object({
  description: z.string().describe('Sensory description'),
});
export type UrbanCrawlResult = z.infer<typeof UrbanCrawlResultSchema>;
