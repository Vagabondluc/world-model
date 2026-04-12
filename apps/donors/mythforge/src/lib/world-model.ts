import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

import type { Entity, Relationship, CustomCategoryDef, DmScreen } from '@/lib/types';

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

export type SourceSystem =
  | 'Mythforge'
  | 'Orbis'
  | 'AdventureGenerator'
  | 'Neutral'
  | { External: string };

export type OwnerRef =
  | { World: string }
  | { Entity: string }
  | { Asset: string }
  | { Workflow: string };

export interface HumanMetadata {
  label: string;
  summary?: string | null;
  tags: string[];
}

export interface SchemaBindingRecord {
  schema_id: string;
  schema_class: 'NativeSchema' | 'ProjectSchema' | 'SimulationSchema' | 'WorkflowSchema';
  external_schema_ref: {
    source_system: SourceSystem;
    source_uri: string;
    validation_contract_ref?: string | null;
    migration_contract_ref?: string | null;
  };
  version: string;
  activation_event_id: string;
  migration_lineage: {
    previous_schema_version?: string | null;
    migration_ref?: string | null;
  };
}

export interface AppendOnlyEventLedger {
  event_ids: string[];
}

export interface LocationAttachment {
  map_anchor: string;
  hex_or_cell_ref?: string | null;
  coordinate_ref?: string | null;
  spatial_scope: string;
  layer_membership: string[];
}

export interface EventPayloadRef {
  inline_payload?: JsonValue | null;
  payload_ref?: string | null;
}

export interface EventCausation {
  causation_id?: string | null;
  correlation_id?: string | null;
  trace_id?: string | null;
}

export interface EventEnvelope {
  event_id: string;
  owner: OwnerRef;
  event_type: string;
  occurred_at: string;
  source_system: SourceSystem;
  payload: EventPayloadRef;
  causation: EventCausation;
}

export interface ProjectionRecord {
  projection_id: string;
  owner: OwnerRef;
  projection_version: string;
  derived_state: JsonValue;
  source_event_range: {
    start_event_id: string;
    end_event_id: string;
  };
  schema_binding_version?: string | null;
}

export interface MigrationRecord {
  migration_id: string;
  owner: OwnerRef;
  from_schema_version: string;
  to_schema_version: string;
  triggered_by_event_id: string;
  notes?: string | null;
}

export interface RelationRecord {
  source_entity_id: string;
  target_entity_id: string;
  relation_type: string | { Custom: string };
  effective_from?: string | null;
  effective_to?: string | null;
  provenance: {
    source_system: SourceSystem;
    note?: string | null;
  };
}

export interface WorldRecord {
  world_id: string;
  metadata: HumanMetadata;
  payload: JsonValue;
  root_event_ledger: AppendOnlyEventLedger;
  root_schema_binding?: SchemaBindingRecord | null;
  workflow_registry_references: string[];
  simulation_attachment?: JsonValue | null;
  asset_attachments: string[];
  top_level_entity_index: string[];
}

export interface EntityRecord {
  entity_id: string;
  world_id: string;
  entity_type: string;
  metadata: HumanMetadata;
  payload: JsonValue;
  schema_binding?: SchemaBindingRecord | null;
  relation_references: RelationRecord[];
  location_attachment?: LocationAttachment | null;
  asset_attachments: string[];
  workflow_attachment?: JsonValue | null;
  event_history: AppendOnlyEventLedger;
  latest_projection_reference?: string | null;
}

export interface AssetRecord {
  asset_id: string;
  owner: OwnerRef;
  asset_kind: string;
  source_ref: string;
  metadata: HumanMetadata;
  payload: JsonValue;
}

export interface WorkflowAttachment {
  workflow_id: string;
  activity_type: string;
  status: 'Idle' | 'Running' | 'Paused' | 'Completed' | 'Failed';
  step_state: Array<{ step_key: string; state: JsonValue }>;
  checkpoints: Array<{ checkpoint_key: string; reached_at: string }>;
  progress_ratio: number;
  output_references: OwnerRef[];
  resumable: boolean;
}

export interface WorkflowRecord {
  workflow_id: string;
  world_id: string;
  metadata: HumanMetadata;
  payload: JsonValue;
  schema_binding?: SchemaBindingRecord | null;
  attachment: WorkflowAttachment;
  asset_attachments: string[];
  event_history: AppendOnlyEventLedger;
}

export interface CanonicalBundle {
  world: WorldRecord | null;
  entities: Record<string, EntityRecord>;
  assets: Record<string, AssetRecord>;
  workflows: Record<string, WorkflowRecord>;
  relations: RelationRecord[];
  events: EventEnvelope[];
  projections: Record<string, ProjectionRecord>;
  migrations: MigrationRecord[];
}

export interface WorldCommandRequest {
  command_id: string;
  source_system: SourceSystem;
  issued_at: string;
  bundle: CanonicalBundle;
  command: {
    kind: string;
    [key: string]: unknown;
  };
}

export interface WorldCommandResponse {
  command_id: string;
  status: 'Applied' | 'Rejected';
  bundle: CanonicalBundle;
  event_deltas: EventEnvelope[];
  projection_deltas: ProjectionRecord[];
  migration_deltas: MigrationRecord[];
  warnings: string[];
  issues: Array<{ code: string; message: string; path?: string | null }>;
}

export interface WorldModelSyncResult {
  request: WorldCommandRequest;
  response: WorldCommandResponse;
}

const WORLD_MODEL_WORKSPACE_ENV = 'WORLD_MODEL_WORKSPACE';

function resolveWorldModelWorkspaceRoot(): string {
  const envRoot = process.env[WORLD_MODEL_WORKSPACE_ENV];
  if (envRoot) return envRoot;
  return path.resolve(process.cwd(), '..', 'world-model');
}

function readJsonValue(input: string): unknown {
  return JSON.parse(input) as unknown;
}

export function runWorldModelDriver(request: WorldCommandRequest): WorldCommandResponse {
  const workspaceRoot = resolveWorldModelWorkspaceRoot();
  const result = spawnSync(
    'cargo',
    ['run', '--quiet', '--manifest-path', path.join(workspaceRoot, 'Cargo.toml'), '-p', 'world-model-driver', '--', 'apply'],
    {
      cwd: workspaceRoot,
      encoding: 'utf8',
      input: JSON.stringify(request),
      maxBuffer: 20 * 1024 * 1024,
    }
  );

  if (result.status !== 0) {
    const stderr = result.stderr?.toString().trim();
    throw new Error(`world-model-driver failed: ${stderr || result.error?.message || 'unknown error'}`);
  }

  return readJsonValue(result.stdout.toString()) as WorldCommandResponse;
}

export function entityCategoryBinding(category: string, customCategory?: CustomCategoryDef): SchemaBindingRecord {
  const categoryId = customCategory?.id ?? category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    schema_id: `schema-${categoryId}`,
    schema_class: 'ProjectSchema',
    external_schema_ref: {
      source_system: 'Mythforge',
      source_uri: customCategory ? `mythforge://custom-category/${customCategory.id}` : `mythforge://category/${categoryId}`,
      validation_contract_ref: customCategory ? `${customCategory.name}.schema.json` : `${categoryId}.schema.json`,
      migration_contract_ref: null,
    },
    version: '1.0.0',
    activation_event_id: `evt-category-${categoryId}`,
    migration_lineage: {
      previous_schema_version: null,
      migration_ref: null,
    },
  };
}

export function entityToCanonicalRecord(entity: Entity, customCategories: CustomCategoryDef[] = []): EntityRecord {
  const matchingCategory = customCategories.find((category) => category.name === entity.category);
  return {
    entity_id: entity.id,
    world_id: 'mythforge-world',
    entity_type: entity.category,
    metadata: {
      label: entity.title,
      summary: entity.markdown_content ? entity.markdown_content.slice(0, 240) : null,
      tags: [...entity.tags],
    },
    payload: {
      uuid_short: entity.uuid_short,
      markdown_content: entity.markdown_content,
      json_attributes: entity.json_attributes,
      tags: entity.tags,
      isPinned: entity.isPinned,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    },
    schema_binding: entityCategoryBinding(entity.category, matchingCategory),
    relation_references: [],
    location_attachment: entity.category === 'Settlement' || entity.category === 'City' || entity.category === 'Region' || entity.category === 'Dungeon'
      ? {
          map_anchor: 'mythforge-map',
          hex_or_cell_ref: null,
          coordinate_ref: null,
          spatial_scope: 'entity',
          layer_membership: [entity.category.toLowerCase()],
        }
      : null,
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

export function relationshipToCanonicalRecord(relationship: Relationship): RelationRecord {
  return {
    source_entity_id: relationship.parent_id,
    target_entity_id: relationship.child_id,
    relation_type: relationship.relationship_type,
    provenance: {
      source_system: 'Mythforge',
      note: 'Hydrated from local world store',
    },
  };
}

export function buildMythforgeCanonicalBundle(state: MythforgeWorldStateOverlay): CanonicalBundle {
  const customCategories = state.customCategories ?? [];
  const entities = Object.fromEntries(
    state.entities.map((entity) => [entity.id, entityToCanonicalRecord(entity, customCategories)])
  );

  const relations = state.relationships.map(relationshipToCanonicalRecord);

  const world: WorldRecord = {
    world_id: 'mythforge-world',
    metadata: {
      label: 'Mythforge World',
      summary: 'Canonical bundle exported from Mythforge local store',
      tags: ['mythforge', 'world'],
    },
    payload: {
      customCategories,
      dmScreens: state.dmScreens,
      pinnedEntityIds: state.pinnedEntityIds,
      aiMode: state.aiMode,
      viewMode: state.viewMode,
    },
    root_event_ledger: { event_ids: [] },
    root_schema_binding: null,
    workflow_registry_references: state.dmScreens.map((screen) => screen.id),
    simulation_attachment: null,
    asset_attachments: [],
    top_level_entity_index: state.entities.map((entity) => entity.id),
  };

  return {
    world,
    entities,
    assets: {},
    workflows: {},
    relations,
    events: [],
    projections: {},
    migrations: [],
  };
}

export function buildMythforgeCreateWorldRequest(state: MythforgeWorldStateOverlay): WorldCommandRequest {
  const bundle = buildMythforgeCanonicalBundle(state);
  return {
    command_id: randomUUID(),
    source_system: 'Mythforge',
    issued_at: new Date().toISOString(),
    bundle,
    command: {
      kind: 'create_world',
      world: bundle.world,
    },
  };
}

export function buildMythforgeUpsertEntityRequest(entity: Entity, state: MythforgeWorldStateOverlay): WorldCommandRequest {
  return {
    command_id: randomUUID(),
    source_system: 'Mythforge',
    issued_at: new Date().toISOString(),
    bundle: buildMythforgeCanonicalBundle(state),
    command: {
      kind: 'upsert_entity',
      entity: entityToCanonicalRecord(entity, state.customCategories),
    },
  };
}

export function buildMythforgeDeleteEntityRequest(entityId: string, state: MythforgeWorldStateOverlay): WorldCommandRequest {
  return {
    command_id: randomUUID(),
    source_system: 'Mythforge',
    issued_at: new Date().toISOString(),
    bundle: buildMythforgeCanonicalBundle(state),
    command: {
      kind: 'delete_entity',
      entity_id: entityId,
    },
  };
}

export function hydrateMythforgeWorldState(response: WorldCommandResponse, currentState: MythforgeWorldStateOverlay): Partial<MythforgeWorldStateOverlay> {
  const hydratedEntities = Object.values(response.bundle.entities).map((entity) => {
    const payload = (entity.payload as Record<string, unknown> | null | undefined) ?? {};
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
    };
  }) as Entity[];

  const relationships = response.bundle.relations.map((relation) => ({
    id: `${relation.source_entity_id}:${relation.target_entity_id}`,
    parent_id: relation.source_entity_id,
    child_id: relation.target_entity_id,
    relationship_type: typeof relation.relation_type === 'string' ? relation.relation_type : relation.relation_type.Custom,
  })) as Relationship[];

  const pinnedEntityIds = hydratedEntities.filter((entity) => entity.isPinned).map((entity) => entity.id);

  return {
    entities: hydratedEntities,
    relationships,
    pinnedEntityIds,
    customCategories: currentState.customCategories,
  };
}

export function syncMythforgeEntity(entity: Entity, state: MythforgeWorldStateOverlay): WorldModelSyncResult {
  const request = buildMythforgeUpsertEntityRequest(entity, state);
  const response = runWorldModelDriver(request);
  return { request, response };
}
