import {
  CATEGORY_GROUPS,
  CATEGORY_TEMPLATES,
  RELATIONSHIP_TYPES,
  buildCustomTemplate,
  type AIMode,
  type CustomCategoryDef,
  type Entity,
} from '@/lib/types';

export interface AiChatEntityContext {
  entityId: string;
  entityTitle: string;
  entityCategory: string;
  entityMarkdown: string;
  entityAttributes: Record<string, unknown>;
}

export interface AiChatWorldRelationship {
  id: string;
  parent_id: string;
  child_id: string;
  relationship_type: string;
}

export interface AiChatWorldContext {
  entities: Array<Pick<Entity, 'id' | 'title' | 'category' | 'uuid_short'> & {
    markdown_content?: string;
    json_attributes?: Record<string, unknown>;
    tags?: string[];
  }>;
  relationships?: AiChatWorldRelationship[];
  customCategories?: CustomCategoryDef[];
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiRuntimeCapabilities {
  localOllama: boolean;
  httpAi: boolean;
  openui: boolean;
  piMono: boolean;
}

export interface AiWorldEntitySummary {
  id: string;
  uuidShort: string;
  title: string;
  category: string;
  tags: string[];
  markdownPreview: string;
  attributes: Record<string, unknown>;
}

export interface AiWorldRelationshipSummary {
  id: string;
  parentId: string;
  parentTitle: string;
  childId: string;
  childTitle: string;
  relationshipType: string;
}

export interface SchemaFieldSummary {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'unknown';
  required: boolean;
  optional: boolean;
  defaultValue: unknown;
  enumValues?: string[];
  observedRange?: { min: number; max: number };
  itemType?: 'string' | 'number' | 'boolean' | 'object' | 'unknown';
}

export interface SchemaCategorySummary {
  category: string;
  source: 'builtin' | 'custom';
  group?: string;
  baseCategory?: string;
  template: Record<string, unknown>;
  fields: SchemaFieldSummary[];
  notes: string[];
}

export interface AiOutputContract {
  allowedBlocks: string[];
  suppressionBlocks: string[];
}

export interface AiContextPack {
  mode: AIMode;
  personaLabel: string;
  runtime: AiRuntimeCapabilities;
  activeEntity?: AiWorldEntitySummary;
  world: {
    entityCount: number;
    relationshipCount: number;
    entities: AiWorldEntitySummary[];
    relationships: AiWorldRelationshipSummary[];
    categoryGroups: Record<string, string[]>;
    relationshipTypes: readonly string[];
  };
  schema: {
    categories: SchemaCategorySummary[];
    categoryNames: string[];
  };
  outputContract: AiOutputContract;
}

export interface AiContextPackInput {
  mode: AIMode;
  context?: AiChatEntityContext;
  worldContext?: AiChatWorldContext;
  runtime?: Partial<AiRuntimeCapabilities>;
}

const DEFAULT_RUNTIME: AiRuntimeCapabilities = {
  localOllama: false,
  httpAi: true,
  openui: true,
  piMono: false,
};

const MODE_LABELS: Record<AIMode, string> = {
  architect: 'The Architect',
  lorekeeper: 'The Lorekeeper',
  scholar: 'The Scholar',
  roleplayer: 'The Roleplayer',
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stripMarkdownPreview(markdown: string): string {
  return markdown
    .replace(/^#+\s+.*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .trim();
}

function getPreviewLine(markdown: string): string {
  const cleaned = stripMarkdownPreview(markdown);
  if (!cleaned) return '';
  const line = cleaned
    .split('\n')
    .map((item) => item.trim())
    .find(Boolean);
  return line ? line.slice(0, 180) : '';
}

function inferValueType(value: unknown): SchemaFieldSummary['type'] {
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  if (isPlainObject(value)) return 'object';
  return 'unknown';
}

function inferArrayItemType(value: unknown): SchemaFieldSummary['itemType'] {
  if (!Array.isArray(value) || value.length === 0) return 'unknown';
  const types = new Set(value.map((item) => inferValueType(item)));
  if (types.size !== 1) return 'unknown';
  const [singleType] = [...types];
  return singleType === 'array' ? 'unknown' : singleType;
}

type FieldStats = {
  values: unknown[];
  types: Set<SchemaFieldSummary['type']>;
  stringValues: Set<string>;
  numberValues: number[];
  booleanValues: Set<boolean>;
};

function buildFieldStats(templates: Record<string, Record<string, unknown>>): Record<string, FieldStats> {
  const stats: Record<string, FieldStats> = {};
  for (const template of Object.values(templates)) {
    for (const [fieldName, value] of Object.entries(template)) {
      if (!stats[fieldName]) {
        stats[fieldName] = {
          values: [],
          types: new Set(),
          stringValues: new Set(),
          numberValues: [],
          booleanValues: new Set(),
        };
      }
      const stat = stats[fieldName];
      stat.values.push(value);
      const type = inferValueType(value);
      stat.types.add(type);
      if (typeof value === 'string') stat.stringValues.add(value);
      if (typeof value === 'number' && Number.isFinite(value)) stat.numberValues.push(value);
      if (typeof value === 'boolean') stat.booleanValues.add(value);
    }
  }
  return stats;
}

function resolveCustomTemplate(
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
      : resolveCustomTemplate(customCategory.baseCategory, customCategories, seen)
    : undefined;

  return buildCustomTemplate(customCategory, baseTemplate ?? {});
}

function buildTemplateMap(customCategories: CustomCategoryDef[], _mode: AIMode): Record<string, Record<string, unknown>> {
  const allBuiltIns = Object.entries(CATEGORY_TEMPLATES).map(([category, template]) => [category, { ...template }] as const);
  const customTemplates = customCategories.map((def) => {
    const template = resolveCustomTemplate(def.name, customCategories) ?? buildCustomTemplate(def);
    return [def.name, template] as const;
  });

  return Object.fromEntries([...allBuiltIns, ...customTemplates]);
}

function selectRelevantCategories(
  mode: AIMode,
  context: AiChatEntityContext | undefined,
  worldContext: AiChatWorldContext | undefined,
): string[] {
  const worldCategories = Array.from(new Set((worldContext?.entities ?? []).map((entity) => entity.category).filter(Boolean)));
  const activeCategory = context?.entityCategory ? [context.entityCategory] : [];
  const customCategoryNames = (worldContext?.customCategories ?? []).map((category) => category.name);

  if (mode === 'roleplayer') {
    const relatedEntityIds = new Set<string>();
    if (context?.entityId) relatedEntityIds.add(context.entityId);

    for (const rel of worldContext?.relationships ?? []) {
      if (rel.parent_id === context?.entityId) relatedEntityIds.add(rel.child_id);
      if (rel.child_id === context?.entityId) relatedEntityIds.add(rel.parent_id);
    }

    const relatedCategories = (worldContext?.entities ?? [])
      .filter((entity) => relatedEntityIds.has(entity.id))
      .map((entity) => entity.category);

    return Array.from(new Set([...activeCategory, ...relatedCategories])).filter(Boolean);
  }

  return Array.from(new Set([
    ...activeCategory,
    ...worldCategories,
    ...customCategoryNames,
    ...Object.keys(CATEGORY_TEMPLATES),
  ]));
}

function summarizeEntity(
  entity: AiChatWorldContext['entities'][number],
): AiWorldEntitySummary {
  return {
    id: entity.id,
    uuidShort: entity.uuid_short,
    title: entity.title,
    category: entity.category,
    tags: entity.tags ?? [],
    markdownPreview: getPreviewLine(entity.markdown_content ?? ''),
    attributes: entity.json_attributes ?? {},
  };
}

function summarizeRelationship(
  relationship: AiChatWorldRelationship,
  entities: AiChatWorldContext['entities'],
): AiWorldRelationshipSummary {
  const parentTitle = entities.find((entity) => entity.id === relationship.parent_id)?.title ?? relationship.parent_id;
  const childTitle = entities.find((entity) => entity.id === relationship.child_id)?.title ?? relationship.child_id;
  return {
    id: relationship.id,
    parentId: relationship.parent_id,
    parentTitle,
    childId: relationship.child_id,
    childTitle,
    relationshipType: relationship.relationship_type,
  };
}

function selectWorldEntities(
  mode: AIMode,
  context: AiChatEntityContext | undefined,
  worldContext: AiChatWorldContext | undefined,
): AiChatWorldContext['entities'] {
  const entities = worldContext?.entities ?? [];
  if (mode !== 'roleplayer') return entities;

  if (!context?.entityId) return entities.slice(0, 8);

  const relatedIds = new Set<string>([context.entityId]);
  for (const rel of worldContext?.relationships ?? []) {
    if (rel.parent_id === context.entityId) relatedIds.add(rel.child_id);
    if (rel.child_id === context.entityId) relatedIds.add(rel.parent_id);
  }

  return entities.filter((entity) => relatedIds.has(entity.id)).slice(0, 8);
}

function buildCategoryFieldSummary(
  fieldName: string,
  value: unknown,
  stats: FieldStats | undefined,
): SchemaFieldSummary {
  const type = inferValueType(value);
  const summary: SchemaFieldSummary = {
    name: fieldName,
    type,
    required: false,
    optional: true,
    defaultValue: value,
  };

  if (type === 'array') {
    summary.itemType = inferArrayItemType(value);
  }

  if (stats) {
    if (type === 'string' && stats.stringValues.size > 1 && stats.stringValues.size <= 8) {
      summary.enumValues = Array.from(stats.stringValues).sort();
    }
    if (type === 'number' && stats.numberValues.length > 0) {
      summary.observedRange = {
        min: Math.min(...stats.numberValues),
        max: Math.max(...stats.numberValues),
      };
    }
  }

  return summary;
}

function buildCategorySummaries(
  mode: AIMode,
  customCategories: CustomCategoryDef[],
  selectedCategories: string[],
): SchemaCategorySummary[] {
  const templateMap = buildTemplateMap(customCategories, mode);
  const fieldStats = buildFieldStats(
    Object.fromEntries(
      Object.entries(templateMap).filter(([category]) => selectedCategories.includes(category)),
    ),
  );

  const summaries: SchemaCategorySummary[] = [];
  for (const category of selectedCategories) {
    const custom = customCategories.find((def) => def.name === category);
    const template = custom
      ? resolveCustomTemplate(category, customCategories) ?? templateMap[category]
      : templateMap[category];

    if (!template) continue;

    const group = Object.entries(CATEGORY_GROUPS).find(([, categories]) => categories.includes(category))?.[0]
      ?? custom?.group;

    const fields = Object.entries(template).map(([fieldName, value]) => buildCategoryFieldSummary(fieldName, value, fieldStats[fieldName]));

    const notes = custom
      ? [
          `Custom category derived from ${custom.baseCategory ?? 'no base category'}.`,
          'Attributes are flattened into json_attributes for AI generation.',
        ]
      : [
          'Built-in category template derived from the runtime schema registry.',
          'Attributes remain flat key/value pairs for AI generation.',
        ];

    summaries.push({
      category,
      source: custom ? 'custom' : 'builtin',
      group,
      baseCategory: custom?.baseCategory,
      template,
      fields,
      notes,
    });
  }

  return summaries;
}

function buildOutputContract(mode: AIMode): AiOutputContract {
  switch (mode) {
    case 'architect':
      return {
        allowedBlocks: ['schema_confirmation', 'category_suggestion', 'graph_analysis', 'relationship_suggestion'],
        suppressionBlocks: ['draft_card'],
      };
    case 'lorekeeper':
      return {
        allowedBlocks: ['draft_card', 'relationship_suggestion', 'schema_confirmation'],
        suppressionBlocks: ['consistency_issue', 'category_suggestion', 'graph_analysis'],
      };
    case 'scholar':
      return {
        allowedBlocks: ['consistency_issue', 'relationship_suggestion', 'graph_analysis', 'schema_confirmation'],
        suppressionBlocks: ['draft_card'],
      };
    case 'roleplayer':
    default:
      return {
        allowedBlocks: ['entity_reference', 'pin_button'],
        suppressionBlocks: ['draft_card', 'relationship_suggestion', 'schema_confirmation', 'consistency_issue', 'category_suggestion', 'graph_analysis'],
      };
  }
}

function buildRelevantEntities(
  mode: AIMode,
  context: AiChatEntityContext | undefined,
  worldContext: AiChatWorldContext | undefined,
): AiWorldEntitySummary[] {
  return selectWorldEntities(mode, context, worldContext).map((entity) => summarizeEntity(entity));
}

function buildRelevantRelationships(
  mode: AIMode,
  context: AiChatEntityContext | undefined,
  worldContext: AiChatWorldContext | undefined,
): AiWorldRelationshipSummary[] {
  const relationships = worldContext?.relationships ?? [];
  if (relationships.length === 0) return [];
  const entityList = worldContext?.entities ?? [];

  if (mode !== 'roleplayer') {
    return relationships.map((relationship) => summarizeRelationship(relationship, entityList));
  }

  const activeId = context?.entityId;
  if (!activeId) {
    return relationships.slice(0, 8).map((relationship) => summarizeRelationship(relationship, entityList));
  }

  const selectedRelationships = relationships.filter((relationship) => relationship.parent_id === activeId || relationship.child_id === activeId);
  return selectedRelationships.slice(0, 12).map((relationship) => summarizeRelationship(relationship, entityList));
}

export function buildAiContextPack(input: AiContextPackInput): AiContextPack {
  const runtime = { ...DEFAULT_RUNTIME, ...(input.runtime ?? {}) };
  const worldContext = input.worldContext;
  const customCategories = worldContext?.customCategories ?? [];
  const selectedCategories = selectRelevantCategories(input.mode, input.context, worldContext);
  const allEntities = buildRelevantEntities(input.mode, input.context, worldContext);
  const allRelationships = buildRelevantRelationships(input.mode, input.context, worldContext);
  const activeEntity = input.context
    ? {
        id: input.context.entityId,
        uuidShort: input.context.entityId,
        title: input.context.entityTitle,
        category: input.context.entityCategory,
        tags: [],
        markdownPreview: getPreviewLine(input.context.entityMarkdown),
        attributes: input.context.entityAttributes,
      }
    : undefined;

  return {
    mode: input.mode,
    personaLabel: MODE_LABELS[input.mode],
    runtime,
    activeEntity,
    world: {
      entityCount: worldContext?.entities.length ?? 0,
      relationshipCount: worldContext?.relationships?.length ?? 0,
      entities: allEntities,
      relationships: allRelationships,
      categoryGroups: buildCategoryGroups(customCategories),
      relationshipTypes: RELATIONSHIP_TYPES,
    },
    schema: {
      categories: buildCategorySummaries(input.mode, customCategories, selectedCategories),
      categoryNames: selectedCategories,
    },
    outputContract: buildOutputContract(input.mode),
  };
}

function buildCategoryGroups(customCategories: CustomCategoryDef[]): Record<string, string[]> {
  const merged: Record<string, string[]> = {
    ...CATEGORY_GROUPS,
  };

  for (const customCategory of customCategories) {
    const group = customCategory.group || 'Custom';
    if (!merged[group]) merged[group] = [];
    if (!merged[group].includes(customCategory.name)) {
      merged[group] = [...merged[group], customCategory.name];
    }
  }

  return merged;
}

function formatWorldEntity(entity: AiWorldEntitySummary): string {
  const attrs = Object.keys(entity.attributes).length > 0 ? ` — ${JSON.stringify(entity.attributes)}` : '';
  const tags = entity.tags.length > 0 ? ` [${entity.tags.join(', ')}]` : '';
  const preview = entity.markdownPreview ? `\n  "${entity.markdownPreview}"` : '';
  return `- **${entity.title}** (${entity.category}, ${entity.uuidShort})${attrs}${tags}${preview}`;
}

function formatSchemaField(field: SchemaFieldSummary): string {
  const bits = [
    `${field.name}: ${field.type}`,
    field.required ? 'required' : 'optional',
  ];

  if (field.defaultValue !== undefined) {
    bits.push(`default=${JSON.stringify(field.defaultValue)}`);
  }
  if (field.enumValues && field.enumValues.length > 0) {
    bits.push(`enum=[${field.enumValues.join(', ')}]`);
  }
  if (field.observedRange) {
    bits.push(`range=${field.observedRange.min}..${field.observedRange.max}`);
  }
  if (field.itemType) {
    bits.push(`items=${field.itemType}`);
  }
  return `- ${bits.join(' | ')}`;
}

function formatSchemaCategory(category: SchemaCategorySummary): string {
  const lines = [
    `- ${category.category}${category.group ? ` (${category.group})` : ''}${category.source === 'custom' ? ' [custom]' : ''}`,
    ...category.notes.map((note) => `  • ${note}`),
    ...category.fields.map((field) => `  ${formatSchemaField(field)}`),
  ];
  return lines.join('\n');
}

export function formatAiContextPack(pack: AiContextPack): string {
  const lines: string[] = [];

  lines.push('[AI CONTEXT PACK v1]');
  lines.push(`Persona: ${pack.personaLabel}`);
  lines.push(`Mode: ${pack.mode}`);
  lines.push(`Runtime capabilities: localOllama=${pack.runtime.localOllama}, httpAi=${pack.runtime.httpAi}, openui=${pack.runtime.openui}, piMono=${pack.runtime.piMono}`);

  if (pack.activeEntity) {
    lines.push('');
    lines.push('[ACTIVE ENTITY]');
    lines.push(`Currently viewing: "${pack.activeEntity.title}" (${pack.activeEntity.category}, ID: ${pack.activeEntity.id})`);
    lines.push(`Attributes: ${JSON.stringify(pack.activeEntity.attributes)}`);
    if (pack.activeEntity.markdownPreview) {
      lines.push(`Lore preview: "${pack.activeEntity.markdownPreview}"`);
    }
  }

  lines.push('');
  lines.push(`[WORLD DATABASE — ${pack.world.entityCount} entities / ${pack.world.relationshipCount} relationships]`);
  if (pack.world.entities.length > 0) {
    lines.push(pack.world.entities.map((entity) => formatWorldEntity(entity)).join('\n'));
  } else {
    lines.push('No entities in the world database.');
  }

  if (pack.world.relationships.length > 0) {
    lines.push('');
    lines.push('[RELATIONSHIPS]');
    lines.push(pack.world.relationships.map((relationship) => `- ${relationship.parentTitle} --[${relationship.relationshipType}]--> ${relationship.childTitle}`).join('\n'));
  }

  lines.push('');
  lines.push('[CATEGORY GROUPS]');
  lines.push(Object.entries(pack.world.categoryGroups).map(([group, categories]) => `- ${group}: ${categories.join(', ')}`).join('\n'));

  lines.push('');
  lines.push('[SCHEMA CATALOG]');
  lines.push(pack.schema.categories.map((category) => formatSchemaCategory(category)).join('\n'));

  lines.push('');
  lines.push('[OUTPUT CONTRACT]');
  lines.push(`Allowed structured blocks: ${pack.outputContract.allowedBlocks.join(', ') || 'none'}`);
  lines.push(`Suppressed blocks: ${pack.outputContract.suppressionBlocks.join(', ') || 'none'}`);

  return lines.join('\n');
}

export function buildAiContextPrompt(input: AiContextPackInput): string {
  return formatAiContextPack(buildAiContextPack(input));
}
