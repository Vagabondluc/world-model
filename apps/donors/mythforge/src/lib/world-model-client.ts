import type { CustomCategoryDef, DmScreen, Entity, Relationship } from '@/lib/types';

type JsonValue = unknown;

export interface MythforgeWorldStateOverlay {
  entities: Entity[];
  relationships: Relationship[];
  customCategories: CustomCategoryDef[];
  dmScreens: DmScreen[];
  pinnedEntityIds: string[];
  aiMode: string;
  viewMode: string;
}

export interface MythforgeCanonicalEntityRecord {
  entity_id: string;
  entity_type: string;
  metadata: {
    label: string;
    tags: string[];
  };
  payload?: {
    uuid_short?: string;
    markdown_content?: string;
    json_attributes?: Record<string, unknown>;
    tags?: string[];
    isPinned?: boolean;
    created_at?: number;
    updated_at?: number;
  };
}

export interface MythforgeCanonicalWorldPayload {
  customCategories?: CustomCategoryDef[];
  dmScreens?: DmScreen[];
  pinnedEntityIds?: string[];
  aiMode?: string;
  viewMode?: string;
}

export interface MythforgeCanonicalResponse {
  command_id: string;
  status: 'Applied' | 'Rejected';
  bundle: {
    world: {
      payload?: MythforgeCanonicalWorldPayload | null;
    } | null;
    entities: Record<string, MythforgeCanonicalEntityRecord>;
    relations: Array<{
      source_entity_id: string;
      target_entity_id: string;
      relation_type: string | { Custom: string };
    }>;
  };
  event_deltas: Array<Record<string, JsonValue>>;
  projection_deltas: Array<Record<string, JsonValue>>;
  migration_deltas: Array<Record<string, JsonValue>>;
  warnings: string[];
  issues: Array<{ code: string; message: string; path?: string | null }>;
}

export function isCanonicalWorldModelResponse(value: unknown): value is MythforgeCanonicalResponse {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<MythforgeCanonicalResponse> & {
    command_id?: unknown;
    status?: unknown;
    bundle?: unknown;
  };
  return typeof candidate.command_id === 'string' && typeof candidate.status === 'string' && !!candidate.bundle;
}

function buildWorldStatePayload(state: MythforgeWorldStateOverlay) {
  return {
    entities: state.entities.map((entity) => ({
      id: entity.id,
      uuid_short: entity.uuid_short,
      title: entity.title,
      category: entity.category,
      markdown_content: entity.markdown_content,
      json_attributes: entity.json_attributes,
      tags: entity.tags,
      isPinned: entity.isPinned,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    })),
    relationships: state.relationships.map((relationship) => ({
      id: relationship.id,
      parent_id: relationship.parent_id,
      child_id: relationship.child_id,
      relationship_type: relationship.relationship_type,
    })),
    customCategories: state.customCategories,
    dmScreens: state.dmScreens,
    pinnedEntityIds: state.pinnedEntityIds,
    aiMode: state.aiMode,
    viewMode: state.viewMode,
  };
}

export async function syncMythforgeWorldModel(state: MythforgeWorldStateOverlay): Promise<MythforgeCanonicalResponse> {
  const response = await fetch('/api/world-model', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildWorldStatePayload(state)),
  });

  if (!response.ok) {
    throw new Error(`Mythforge world-model sync failed: ${response.status}`);
  }

  const payload = await response.json() as unknown;
  if (!isCanonicalWorldModelResponse(payload)) {
    throw new Error('Mythforge world-model sync returned an invalid canonical response.');
  }

  return payload;
}

export function hydrateMythforgeWorldState(
  response: MythforgeCanonicalResponse,
  currentState: MythforgeWorldStateOverlay,
): Partial<MythforgeWorldStateOverlay> {
  const worldPayload = response.bundle.world?.payload ?? {};
  const hydratedEntities = Object.values(response.bundle.entities).map((entity) => {
    const payload = (entity.payload ?? {}) as Record<string, unknown>;
    return {
      id: entity.entity_id,
      uuid_short: String(payload.uuid_short ?? entity.entity_id.slice(0, 8)),
      title: entity.metadata.label,
      category: entity.entity_type,
      markdown_content: String(payload.markdown_content ?? ''),
      json_attributes: (payload.json_attributes as Record<string, unknown>) ?? {},
      tags: entity.metadata.tags,
      isPinned: Boolean(payload.isPinned ?? false),
      created_at: Number(payload.created_at ?? Date.now()),
      updated_at: Number(payload.updated_at ?? Date.now()),
    } satisfies Entity;
  });

  const relationships = response.bundle.relations.map((relation) => ({
    id: `${relation.source_entity_id}:${relation.target_entity_id}`,
    parent_id: relation.source_entity_id,
    child_id: relation.target_entity_id,
    relationship_type: typeof relation.relation_type === 'string'
      ? relation.relation_type
      : relation.relation_type.Custom,
  })) satisfies Relationship[];

  const pinnedEntityIds = hydratedEntities.filter((entity) => entity.isPinned).map((entity) => entity.id);

  return {
    entities: hydratedEntities,
    relationships,
    pinnedEntityIds,
    customCategories: worldPayload.customCategories ?? currentState.customCategories,
    dmScreens: worldPayload.dmScreens ?? currentState.dmScreens,
    aiMode: worldPayload.aiMode ?? currentState.aiMode,
    viewMode: worldPayload.viewMode ?? currentState.viewMode,
  };
}

export async function saveMythforgeCanonicalBundle(state: MythforgeWorldStateOverlay): Promise<MythforgeCanonicalResponse> {
  return syncMythforgeWorldModel(state);
}

