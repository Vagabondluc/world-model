// =============================================================================
// MythosForge - Validation Registry & Functions
// =============================================================================

import { z } from 'zod';
import { CATEGORY_TEMPLATES, buildCustomTemplate, type CustomCategoryDef } from './types';
import {
  cosmosSchema, planeSchema, deitySchema, mythSchema,
  biomeSchema, regionSchema, settlementSchema, citySchema,
  landmarkSchema, dungeonSchema, structureSchema,
} from './validation/schemas-geo';
import {
  factionSchema, guildSchema, religionSchema, nobleHouseSchema,
  historicalEventSchema, eraSchema, cultureSchema,
  speciesSchema, raceSchema, creatureSchema, faunaSchema,
  npcSchema, characterSchema, historicalFigureSchema,
  artifactSchema, itemSchema, resourceSchema, materialSchema,
  technologySchema, magicSystemSchema, spellSchema, ruleSchema,
  campaignSchema, adventureSchema, questSchema, encounterSchema,
  sceneSchema, loreNoteSchema, calendarSchema, sessionNoteSchema,
} from './validation/schemas-entities';

// ---------------------------------------------------------------------------
// Schema Registry
// ---------------------------------------------------------------------------

export const CATEGORY_SCHEMAS: Record<string, z.ZodTypeAny> = {
  // Macro & Cosmos
  Cosmos: cosmosSchema,
  Plane: planeSchema,
  Deity: deitySchema,
  Myth: mythSchema,
  // Geography
  Region: regionSchema,
  Biome: biomeSchema,
  Settlement: settlementSchema,
  City: citySchema,
  Landmark: landmarkSchema,
  Dungeon: dungeonSchema,
  Structure: structureSchema,
  // Society & History
  Faction: factionSchema,
  Guild: guildSchema,
  Religion: religionSchema,
  'Noble House': nobleHouseSchema,
  'Historical Event': historicalEventSchema,
  Era: eraSchema,
  Culture: cultureSchema,
  // Biology & Entities
  Species: speciesSchema,
  Race: raceSchema,
  Creature: creatureSchema,
  Fauna: faunaSchema,
  NPC: npcSchema,
  Character: characterSchema,
  'Historical Figure': historicalFigureSchema,
  // Items & Mechanics
  Artifact: artifactSchema,
  Item: itemSchema,
  Resource: resourceSchema,
  Material: materialSchema,
  Technology: technologySchema,
  'Magic System': magicSystemSchema,
  Spell: spellSchema,
  Rule: ruleSchema,
  // Narrative
  Campaign: campaignSchema,
  Adventure: adventureSchema,
  Quest: questSchema,
  Encounter: encounterSchema,
  Scene: sceneSchema,
  'Lore Note': loreNoteSchema,
  Calendar: calendarSchema,
  'Session Note': sessionNoteSchema,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function schemaForTemplateValue(value: unknown): z.ZodTypeAny {
  if (typeof value === 'string') return z.string().optional().default(value);
  if (typeof value === 'number') return z.number().optional().default(value);
  if (typeof value === 'boolean') return z.boolean().optional().default(value);

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'number')) {
      return z.array(z.number()).optional().default(value as number[]);
    }
    if (value.every((item) => typeof item === 'boolean')) {
      return z.array(z.boolean()).optional().default(value as boolean[]);
    }
    if (value.every((item) => typeof item === 'string')) {
      return z.array(z.string()).optional().default(value as string[]);
    }
    return z.array(z.any()).optional().default(value as unknown[]);
  }

  if (isPlainObject(value)) {
    return z.record(z.string(), z.unknown()).optional().default(value as Record<string, unknown>);
  }

  return z.any().optional().default(value as never);
}

/** Build a permissive Zod schema from a template object. */
export function buildSchemaFromTemplate(template: Record<string, unknown>): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [key, value] of Object.entries(template)) {
    shape[key] = schemaForTemplateValue(value);
  }
  return z.object(shape).passthrough();
}

function resolveCategoryTemplate(
  category: string,
  customCategories: CustomCategoryDef[],
  seen = new Set<string>(),
): Record<string, unknown> | undefined {
  if (seen.has(category)) return CATEGORY_TEMPLATES[category];
  seen.add(category);

  const customCategory = customCategories.find((cat) => cat.name === category);
  if (!customCategory) return undefined;

  const baseTemplate = customCategory.baseCategory
    ? customCategory.baseCategory === category
      ? CATEGORY_TEMPLATES[category]
      : resolveCategoryTemplate(customCategory.baseCategory, customCategories, seen)
    : undefined;

  return buildCustomTemplate(customCategory, baseTemplate ?? {});
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export type ValidationResult<T = Record<string, unknown>> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

/**
 * Check entity JSON attributes against the schema for the given category.
 * If no schema exists for the category, returns the attributes unchanged.
 */
export function validateEntityAttributes(
  category: string,
  attributes: Record<string, unknown>,
  customCategories: CustomCategoryDef[] = [],
): ValidationResult {
  const customCategory = customCategories.find((cat) => cat.name === category);
  if (customCategory) {
    const customTemplate = resolveCategoryTemplate(category, customCategories);
    if (customTemplate) {
      const result = buildSchemaFromTemplate(customTemplate).safeParse(attributes);
      if (result.success) {
        return { success: true, data: result.data as Record<string, unknown> };
      }
      const errors = (result.error as z.ZodError).issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      );
      return { success: false, errors };
    }
  }

  const schema = CATEGORY_SCHEMAS[category];
  if (!schema) {
    const builtInTemplate = CATEGORY_TEMPLATES[category];
    if (!builtInTemplate) {
      return { success: true, data: attributes };
    }
    const result = buildSchemaFromTemplate(builtInTemplate).safeParse(attributes);
    if (result.success) {
      return { success: true, data: result.data as Record<string, unknown> };
    }
    const errors = (result.error as z.ZodError).issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`,
    );
    return { success: false, errors };
  }
  const result = schema.safeParse(attributes);
  if (result.success) {
    return { success: true, data: result.data as Record<string, unknown> };
  }
  const errors = (result.error as z.ZodError).issues.map(
    (issue) => `${issue.path.join('.')}: ${issue.message}`,
  );
  return { success: false, errors };
}
