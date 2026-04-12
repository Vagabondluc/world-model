import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

import type { CampaignStateExport } from '../types/campaign';
import type { CompendiumStateExport } from '../types/compendium';
import type { AdventureDataStateExport, GeneratorStateCleaned, GenerationHistory } from '../types/generator';
import type { LocationStateExport, ManagedLocation, Region, WorldMap, HexCoordinate } from '../types/location';
import type { GeneratedAdventure } from '../schemas/adventure';
import type { Delve, DelveConcept } from '../types/delve';
import type { GeneratedTrap } from '../types/trap';
import type { NpcPersona } from '../types/npc';
import type { EncounterTactic } from '../types/encounter';

type JsonValue = unknown;

interface HumanMetadata {
  label: string;
  summary?: string | null;
  tags: string[];
}

interface AppendOnlyEventLedger {
  event_ids: string[];
}

interface EventPayloadRef {
  inline_payload?: JsonValue | null;
  payload_ref?: string | null;
}

interface EventCausation {
  causation_id?: string | null;
  correlation_id?: string | null;
  trace_id?: string | null;
}

interface EventEnvelope {
  event_id: string;
  owner: { World: string } | { Entity: string } | { Asset: string } | { Workflow: string };
  event_type: string;
  occurred_at: string;
  source_system: 'AdventureGenerator';
  payload: EventPayloadRef;
  causation: EventCausation;
}

interface ProjectionRecord {
  projection_id: string;
  owner: { World: string } | { Entity: string } | { Asset: string } | { Workflow: string };
  projection_version: string;
  derived_state: JsonValue;
  source_event_range: { start_event_id: string; end_event_id: string };
  schema_binding_version?: string | null;
}

interface WorldRecord {
  world_id: string;
  metadata: HumanMetadata;
  payload: JsonValue;
  root_event_ledger: AppendOnlyEventLedger;
  root_schema_binding?: JsonValue | null;
  workflow_registry_references: string[];
  simulation_attachment?: JsonValue | null;
  asset_attachments: string[];
  top_level_entity_index: string[];
}

interface EntityRecord {
  entity_id: string;
  world_id: string;
  entity_type: string;
  metadata: HumanMetadata;
  payload: JsonValue;
  schema_binding?: JsonValue | null;
  relation_references: JsonValue[];
  location_attachment?: JsonValue | null;
  asset_attachments: string[];
  workflow_attachment?: JsonValue | null;
  event_history: AppendOnlyEventLedger;
  latest_projection_reference?: string | null;
}

interface WorkflowRecord {
  workflow_id: string;
  world_id: string;
  metadata: HumanMetadata;
  payload: JsonValue;
  schema_binding?: JsonValue | null;
  attachment: JsonValue;
  asset_attachments: string[];
  event_history: AppendOnlyEventLedger;
}

interface CanonicalBundle {
  world: WorldRecord | null;
  entities: Record<string, EntityRecord>;
  assets: Record<string, JsonValue>;
  workflows: Record<string, WorkflowRecord>;
  relations: JsonValue[];
  events: EventEnvelope[];
  projections: Record<string, ProjectionRecord>;
  migrations: JsonValue[];
}

interface WorldCommandRequest {
  command_id: string;
  source_system: 'AdventureGenerator';
  issued_at: string;
  bundle: CanonicalBundle;
  command: {
    kind: string;
    [key: string]: unknown;
  };
}

interface WorldCommandResponse {
  command_id: string;
  status: 'Applied' | 'Rejected';
  bundle: CanonicalBundle;
  event_deltas: EventEnvelope[];
  projection_deltas: ProjectionRecord[];
  migration_deltas: JsonValue[];
  warnings: string[];
  issues: Array<{ code: string; message: string; path?: string | null }>;
}

export interface AdventureWorkflowStateSnapshot {
  step: 'initial' | 'hooks' | 'outline' | 'delve';
  loading?: {
    hooks: boolean;
    refining: boolean;
    outline: boolean;
    details: { type: string; id: string } | null;
    statblock: string | null;
  };
  error?: string | null;
  detailingEntity?: { type: 'scene' | 'location' | 'npc' | 'faction'; id: string } | null;
}

export interface AdventureSessionSnapshot {
  campaignState: CampaignStateExport;
  locationState: LocationStateExport;
  compendiumState: CompendiumStateExport;
  generatorState: AdventureDataStateExport & Partial<GeneratorStateCleaned>;
  workflowState?: AdventureWorkflowStateSnapshot;
}

const WORLD_MODEL_WORKSPACE_ENV = 'WORLD_MODEL_WORKSPACE';

function resolveWorldModelWorkspaceRoot(): string {
  const envRoot = process.env[WORLD_MODEL_WORKSPACE_ENV];
  if (envRoot) return envRoot;

  const canonicalFallback = 'D:\\coding\\AI\\Chat-Gpt-Agent\\world-model';
  if (fs.existsSync(canonicalFallback)) return canonicalFallback;

  throw new Error(
    `Missing ${WORLD_MODEL_WORKSPACE_ENV}. Set it to the world-model workspace root or place the workspace at ${canonicalFallback}.`
  );
}

function runWorldModelDriver(request: WorldCommandRequest): WorldCommandResponse {
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
    throw new Error(`world-model-driver failed: ${result.stderr || result.error?.message || 'unknown error'}`);
  }

  return JSON.parse(result.stdout.toString()) as WorldCommandResponse;
}

function jsonSafe<T>(value: T): JsonValue {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map((entry) => jsonSafe(entry)) as JsonValue;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, jsonSafe(entry)])
    ) as JsonValue;
  }
  return value as JsonValue;
}

function hexToRef(hex: HexCoordinate): string {
  return [hex.q, hex.r, hex.s ?? -hex.q - hex.r].join(',');
}

function humanMetadata(label: string, summary?: string | null, tags: string[] = []): HumanMetadata {
  return { label, summary: summary ?? null, tags };
}

function normalizeKind(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function stableId(prefix: string, value: unknown): string {
  return `${prefix}-${Buffer.from(JSON.stringify(jsonSafe(value)), 'utf8').toString('hex').slice(0, 16)}`;
}

function locationToEntity(location: ManagedLocation, worldId: string): EntityRecord {
  return {
    entity_id: location.id,
    world_id: worldId,
    entity_type: 'location',
    metadata: humanMetadata(location.name, location.description, [
      normalizeKind(location.type),
      location.biome,
      ...(location.customTags ?? []),
    ]),
    payload: jsonSafe({
      ...location,
      hexCoordinate: location.hexCoordinate,
    }),
    schema_binding: null,
    relation_references: [],
    location_attachment: {
      map_anchor: location.associatedMapId ?? location.mapId,
      hex_or_cell_ref: hexToRef(location.hexCoordinate),
      coordinate_ref: hexToRef(location.hexCoordinate),
      spatial_scope: location.associatedMapId ? 'submap' : 'hex',
      layer_membership: [location.mapId, ...(location.layerAssociation?.associatedMapId ? [location.layerAssociation.associatedMapId] : [])],
    },
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function regionToEntity(region: Region, worldId: string): EntityRecord {
  return {
    entity_id: region.id,
    world_id: worldId,
    entity_type: 'region',
    metadata: humanMetadata(region.name, region.description, [
      normalizeKind(region.dominantBiome),
      normalizeKind(region.politicalControl),
      ...(region.keyFeatures ?? []),
    ]),
    payload: jsonSafe(region),
    schema_binding: null,
    relation_references: [],
    location_attachment: {
      map_anchor: region.mapId,
      hex_or_cell_ref: null,
      coordinate_ref: null,
      spatial_scope: 'region',
      layer_membership: [region.mapId],
    },
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function mapToAsset(map: WorldMap, worldId: string): JsonValue {
  return {
    asset_id: `map-${map.id}`,
    owner: { World: worldId },
    asset_kind: 'world-map',
    source_ref: `map:${map.id}`,
    metadata: humanMetadata(map.name, map.description, ['map', 'world-map']),
    payload: jsonSafe(map),
  };
}

function layerToAsset(layer: { id: string; mapId: string; name: string; type: string; visible: boolean; opacity: number; data: JsonValue; theme: JsonValue }, worldId: string): JsonValue {
  return {
    asset_id: `layer-${layer.id}`,
    owner: { World: worldId },
    asset_kind: 'map-layer',
    source_ref: `layer:${layer.id}`,
    metadata: humanMetadata(layer.name, `Layer ${layer.type} for map ${layer.mapId}`, ['layer', normalizeKind(layer.type)]),
    payload: jsonSafe(layer),
  };
}

function adventureHookToEntity(adventure: GeneratedAdventure, worldId: string, index: number): EntityRecord {
  const label = adventure.type === 'simple' ? adventure.premise : adventure.title;
  const id = stableId(`adventure-hook-${index}`, adventure);
  return {
    entity_id: id,
    world_id: worldId,
    entity_type: 'adventure-hook',
    metadata: humanMetadata(label, adventure.type === 'simple' ? adventure.stakes : adventure.hook, ['adventure', 'hook', adventure.type]),
    payload: jsonSafe(adventure),
    schema_binding: null,
    relation_references: [],
    location_attachment: null,
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function delveToEntity(delve: Delve, worldId: string): EntityRecord {
  return {
    entity_id: delve.id,
    world_id: worldId,
    entity_type: 'delve',
    metadata: humanMetadata(delve.title, `Delve theme ${delve.theme}`, ['delve', delve.theme]),
    payload: jsonSafe(delve),
    schema_binding: null,
    relation_references: [],
    location_attachment: null,
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function delveConceptToEntity(concept: DelveConcept, worldId: string, index: number): EntityRecord {
  return {
    entity_id: concept.id || stableId(`delve-concept-${index}`, concept),
    world_id: worldId,
    entity_type: 'delve-concept',
    metadata: humanMetadata(concept.title, concept.description, [normalizeKind(concept.theme), ...(concept.tags ?? [])]),
    payload: jsonSafe(concept),
    schema_binding: null,
    relation_references: [],
    location_attachment: null,
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function trapToEntity(trap: GeneratedTrap, worldId: string, index: number): EntityRecord {
  const id = stableId(`trap-${index}`, trap);
  return {
    entity_id: id,
    world_id: worldId,
    entity_type: 'trap',
    metadata: humanMetadata(trap.name, trap.description, ['trap', trap.type, trap.tier]),
    payload: jsonSafe(trap),
    schema_binding: null,
    relation_references: [],
    location_attachment: null,
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function npcPersonaToEntity(persona: NpcPersona, worldId: string, index: number): EntityRecord {
  const id = stableId(`npc-persona-${index}`, persona);
  return {
    entity_id: id,
    world_id: worldId,
    entity_type: 'npc-persona',
    metadata: humanMetadata(persona.name, persona.backstory, [normalizeKind(persona.race), normalizeKind(persona.role)]),
    payload: jsonSafe(persona),
    schema_binding: null,
    relation_references: [],
    location_attachment: null,
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function encounterDesignToEntity(design: EncounterTactic, worldId: string, index: number): EntityRecord {
  const id = stableId(`encounter-design-${index}`, design);
  return {
    entity_id: id,
    world_id: worldId,
    entity_type: 'encounter-design',
    metadata: humanMetadata(design.name, design.behavior, [normalizeKind(design.role), normalizeKind(design.priority)]),
    payload: jsonSafe(design),
    schema_binding: null,
    relation_references: [],
    location_attachment: null,
    asset_attachments: [],
    workflow_attachment: null,
    event_history: { event_ids: [] },
    latest_projection_reference: null,
  };
}

function generationHistoryToEvents(history: GenerationHistory[] = [], workflowId = 'adventure-workflow'): EventEnvelope[] {
  return history.map((entry, index) => ({
    event_id: `evt-history-${index}`,
    owner: { Workflow: workflowId },
    event_type: `generation.history.${entry.type}`,
    occurred_at: new Date(entry.timestamp).toISOString(),
    source_system: 'AdventureGenerator',
    payload: {
      inline_payload: jsonSafe(entry),
      payload_ref: null,
    },
    causation: {
      causation_id: entry.id,
      correlation_id: entry.id,
      trace_id: entry.id,
    },
  }));
}

function relationForLocationRegion(locationId: string, regionId: string): JsonValue {
  return {
    source_entity_id: locationId,
    target_entity_id: regionId,
    relation_type: 'LocatedIn',
    effective_from: null,
    effective_to: null,
    provenance: {
      source_system: 'AdventureGenerator',
      note: 'Linked from location regionId field',
    },
  };
}

function resolveAdventureWorldId(session: AdventureSessionSnapshot): string {
  return session.campaignState.config.worldName?.trim()
    || session.locationState.activeMapId
    || 'adventure-world';
}

function buildAdventureWorldRecord(session: AdventureSessionSnapshot, worldId: string): WorldRecord {
  return {
    world_id: worldId,
    metadata: humanMetadata(session.campaignState.config.worldName?.trim() || 'Adventure Generator', 'Guided adventure/world building bundle', [
      'adventure',
      'locations',
      'workflow',
    ]),
    payload: jsonSafe({
      campaignState: session.campaignState,
      locationState: session.locationState,
      compendiumState: session.compendiumState,
      generatorState: session.generatorState,
      workflowState: session.workflowState ?? null,
    }),
    root_event_ledger: { event_ids: [] },
    root_schema_binding: null,
    workflow_registry_references: ['adventure-workflow'],
    simulation_attachment: null,
    asset_attachments: [],
    top_level_entity_index: [],
  };
}

function buildAdventureAssetRecords(session: AdventureSessionSnapshot, worldId: string): JsonValue[] {
  const mapAssets = Object.values(session.locationState.maps).map((map) => mapToAsset(map, worldId));
  const layerAssets = Object.values(session.locationState.layers).map((layer) => layerToAsset(layer, worldId));
  return [...mapAssets, ...layerAssets];
}

function buildAdventureEntityRecords(session: AdventureSessionSnapshot, worldId: string): EntityRecord[] {
  const locationEntities = Object.values(session.locationState.locations).map((location) => locationToEntity(location, worldId));
  const regionEntities = Object.values(session.locationState.regions).map((region) => regionToEntity(region, worldId));
  const adventureEntities = (session.generatorState.adventures ?? []).map((adventure, index) => adventureHookToEntity(adventure, worldId, index));
  const delveEntities = session.generatorState.activeDelve ? [delveToEntity(session.generatorState.activeDelve, worldId)] : [];
  const conceptEntities = (session.generatorState.currentConcepts ?? []).map((concept, index) => delveConceptToEntity(concept, worldId, index));
  const trapEntities = (session.generatorState.activeTraps ?? []).map((trap, index) => trapToEntity(trap, worldId, index));
  const personaEntities = (session.generatorState.npcPersonas ?? []).map((persona, index) => npcPersonaToEntity(persona, worldId, index));
  const encounterEntities = (session.generatorState.encounterDesigns ?? []).map((design, index) => encounterDesignToEntity(design, worldId, index));
  return [
    ...locationEntities,
    ...regionEntities,
    ...adventureEntities,
    ...delveEntities,
    ...conceptEntities,
    ...trapEntities,
    ...personaEntities,
    ...encounterEntities,
  ];
}

function buildAdventureRelations(session: AdventureSessionSnapshot, worldId: string): JsonValue[] {
  const relations: JsonValue[] = [];
  for (const location of Object.values(session.locationState.locations)) {
    if (location.regionId) {
      relations.push(relationForLocationRegion(location.id, location.regionId));
    }
    for (const connectedLocationId of location.connectedLocations ?? []) {
      relations.push({
        source_entity_id: location.id,
        target_entity_id: connectedLocationId,
        relation_type: 'References',
        effective_from: null,
        effective_to: null,
        provenance: {
          source_system: 'AdventureGenerator',
          note: 'Linked from location connection list',
        },
      });
    }
  }
  return relations;
}

function buildAdventureWorkflowRecord(session: AdventureSessionSnapshot, worldId: string): WorkflowRecord {
  const workflowId = 'adventure-workflow';
  const workflowAttachment = {
    workflow_id: workflowId,
    activity_type: 'adventure-generation',
    status: session.workflowState?.error ? 'Failed' : (session.workflowState?.loading ? 'Running' : 'Idle'),
    step_state: [
      {
        step_key: 'workflow',
        state: jsonSafe(session.workflowState ?? null),
      },
      {
        step_key: 'generator',
        state: jsonSafe(session.generatorState),
      },
      {
        step_key: 'location-summary',
        state: jsonSafe({
          activeMapId: session.locationState.activeMapId,
          mapCount: Object.keys(session.locationState.maps).length,
          locationCount: Object.keys(session.locationState.locations).length,
          regionCount: Object.keys(session.locationState.regions).length,
        }),
      },
    ],
    checkpoints: [
      {
        checkpoint_key: 'session-snapshot',
        reached_at: new Date().toISOString(),
      },
    ],
    progress_ratio: session.workflowState?.error ? 0 : (session.workflowState?.loading ? 0.5 : 1),
    output_references: [],
    resumable: true,
  };

  return {
    workflow_id: workflowId,
    world_id: worldId,
    metadata: humanMetadata('Adventure Generator', 'Workflow state for generated adventure output', [
      'workflow',
      'adventure',
    ]),
    payload: jsonSafe({
      campaignState: session.campaignState,
      locationState: session.locationState,
      compendiumState: session.compendiumState,
      generatorState: session.generatorState,
      workflowState: session.workflowState ?? null,
    }),
    schema_binding: null,
    attachment: workflowAttachment,
    asset_attachments: [],
    event_history: { event_ids: [] },
  };
}

function buildAdventureBundle(session: AdventureSessionSnapshot): CanonicalBundle {
  const worldId = resolveAdventureWorldId(session);
  const world = buildAdventureWorldRecord(session, worldId);
  const entities = Object.fromEntries(
    buildAdventureEntityRecords(session, worldId).map((entity) => [entity.entity_id, entity])
  );
  const assets = Object.fromEntries(
    buildAdventureAssetRecords(session, worldId).map((asset: any) => [asset.asset_id, asset])
  );
  const workflowRecord = buildAdventureWorkflowRecord(session, worldId);
  const relations = buildAdventureRelations(session, worldId);
  const events = generationHistoryToEvents(session.generatorState.generationHistory ?? [], workflowRecord.workflow_id);

  world.workflow_registry_references = [workflowRecord.workflow_id];
  world.asset_attachments = Object.keys(assets).slice();
  world.top_level_entity_index = Object.keys(entities).slice();

  return {
    world,
    entities,
    assets,
    workflows: { [workflowRecord.workflow_id]: workflowRecord },
    relations,
    events,
    projections: {},
    migrations: [],
  };
}

function buildRequestFromBundle(bundle: CanonicalBundle, command: WorldCommandRequest['command']): WorldCommandRequest {
  return {
    command_id: randomUUID(),
    source_system: 'AdventureGenerator',
    issued_at: new Date().toISOString(),
    bundle,
    command,
  };
}

export function buildAdventureCreateWorldRequest(session: AdventureSessionSnapshot): WorldCommandRequest {
  const bundle = buildAdventureBundle(session);
  return buildRequestFromBundle(bundle, {
    kind: 'create_world',
    world: bundle.world,
  });
}

export function buildAdventureAttachWorkflowRequest(session: AdventureSessionSnapshot): WorldCommandRequest {
  const bundle = buildAdventureBundle(session);
  return buildRequestFromBundle(bundle, {
    kind: 'attach_workflow',
    workflow: bundle.workflows['adventure-workflow'],
  });
}

export function buildAdventureUpsertEntityRequest(
  session: AdventureSessionSnapshot,
  entityId: string
): WorldCommandRequest {
  const bundle = buildAdventureBundle(session);
  const entity = bundle.entities[entityId];
  if (!entity) {
    throw new Error(`Unknown canonical entity: ${entityId}`);
  }
  return buildRequestFromBundle(bundle, {
    kind: 'upsert_entity',
    entity,
  });
}

export function buildAdventureAttachAssetRequest(
  session: AdventureSessionSnapshot,
  assetId: string
): WorldCommandRequest {
  const bundle = buildAdventureBundle(session);
  const asset = bundle.assets[assetId];
  if (!asset) {
    throw new Error(`Unknown canonical asset: ${assetId}`);
  }
  return buildRequestFromBundle(bundle, {
    kind: 'attach_asset',
    asset,
  });
}

export function buildAdventureAddRelationRequest(
  session: AdventureSessionSnapshot,
  relationIndex: number
): WorldCommandRequest {
  const bundle = buildAdventureBundle(session);
  const relation = bundle.relations[relationIndex];
  if (!relation) {
    throw new Error(`Unknown canonical relation at index ${relationIndex}`);
  }
  return buildRequestFromBundle(bundle, {
    kind: 'add_relation',
    relation,
  });
}

export function buildAdventureAppendEventRequest(
  session: AdventureSessionSnapshot,
  eventIndex: number
): WorldCommandRequest {
  const bundle = buildAdventureBundle(session);
  const event = bundle.events[eventIndex];
  if (!event) {
    throw new Error(`Unknown canonical event at index ${eventIndex}`);
  }
  return buildRequestFromBundle(bundle, {
    kind: 'append_event',
    event,
  });
}

export function syncAdventureWorldModel(
  session: AdventureSessionSnapshot
): WorldCommandResponse {
  let response = runWorldModelDriver(buildAdventureCreateWorldRequest(session));

  response = runWorldModelDriver({
    ...buildAdventureAttachWorkflowRequest(session),
    bundle: response.bundle,
  });

  const bundle = buildAdventureBundle(session);

  for (const assetId of Object.keys(bundle.assets)) {
    response = runWorldModelDriver({
      ...buildAdventureAttachAssetRequest(session, assetId),
      bundle: response.bundle,
    });
  }

  for (const entityId of Object.keys(bundle.entities)) {
    response = runWorldModelDriver({
      ...buildAdventureUpsertEntityRequest(session, entityId),
      bundle: response.bundle,
    });
  }

  for (let relationIndex = 0; relationIndex < bundle.relations.length; relationIndex += 1) {
    response = runWorldModelDriver({
      ...buildAdventureAddRelationRequest(session, relationIndex),
      bundle: response.bundle,
    });
  }

  for (let eventIndex = 0; eventIndex < bundle.events.length; eventIndex += 1) {
    response = runWorldModelDriver({
      ...buildAdventureAppendEventRequest(session, eventIndex),
      bundle: response.bundle,
    });
  }

  return response;
}

export function hydrateAdventureWorldState(
  response: WorldCommandResponse,
  currentAdventureState: AdventureDataStateExport & Partial<GeneratorStateCleaned>,
  currentLocationState: LocationStateExport
): {
  adventureState: Partial<AdventureDataStateExport & Partial<GeneratorStateCleaned>>;
  locationState: Partial<LocationStateExport>;
} {
  const payload = (response.bundle.world?.payload as Record<string, unknown> | undefined) ?? {};
  const session = payload as Partial<AdventureSessionSnapshot>;
  const currentGeneratorState = currentAdventureState as Partial<GeneratorStateCleaned>;

  const locations = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'location')
    .map((entity) => entity.payload as ManagedLocation);
  const regions = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'region')
    .map((entity) => entity.payload as Region);
  const adventures = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'adventure-hook')
    .map((entity) => entity.payload as GeneratedAdventure);
  const delve = Object.values(response.bundle.entities)
    .find((entity) => entity.entity_type === 'delve')?.payload as Delve | undefined;
  const traps = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'trap')
    .map((entity) => entity.payload as GeneratedTrap);
  const personas = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'npc-persona')
    .map((entity) => entity.payload as NpcPersona);
  const encounterDesigns = Object.values(response.bundle.entities)
    .filter((entity) => entity.entity_type === 'encounter-design')
    .map((entity) => entity.payload as EncounterTactic);
  const maps = Object.values(response.bundle.assets)
    .filter((asset: any) => asset.asset_kind === 'world-map')
    .reduce<Record<string, WorldMap>>((acc, asset: any) => {
      const map = asset.payload as WorldMap;
      acc[map.id] = map;
      return acc;
    }, {});
  const layers = Object.values(response.bundle.assets)
    .filter((asset: any) => asset.asset_kind === 'map-layer')
    .reduce<Record<string, any>>((acc, asset: any) => {
      const layer = asset.payload as any;
      acc[layer.id] = layer;
      return acc;
    }, {});
  const activeMapId = session.locationState?.activeMapId ?? currentLocationState.activeMapId ?? response.bundle.world?.world_id ?? null;
  const generationHistory = response.bundle.events
    .filter((event) => event.event_type.startsWith('generation.history.'))
    .map((event) => event.payload.inline_payload as GenerationHistory)
    .filter(Boolean);

  return {
    adventureState: {
      adventures: adventures.length > 0 ? adventures : currentAdventureState.adventures,
      selectedHook: session.generatorState?.selectedHook ?? currentAdventureState.selectedHook,
      currentAdventureCompendiumIds: session.generatorState?.currentAdventureCompendiumIds ?? currentAdventureState.currentAdventureCompendiumIds,
      activeDelve: delve ?? currentAdventureState.activeDelve,
      delveView: session.generatorState?.delveView ?? currentAdventureState.delveView,
      currentConcepts: session.generatorState?.currentConcepts ?? currentAdventureState.currentConcepts,
      activeRoomId: session.generatorState?.activeRoomId ?? currentAdventureState.activeRoomId,
      activeTraps: traps.length > 0 ? traps : currentAdventureState.activeTraps,
      npcPersonas: personas.length > 0 ? personas : currentAdventureState.npcPersonas,
      encounterDesigns: encounterDesigns.length > 0 ? encounterDesigns : currentAdventureState.encounterDesigns,
      matrix: session.generatorState?.matrix ?? currentAdventureState.matrix,
      context: session.generatorState?.context ?? '',
      generationMethod: session.generatorState?.generationMethod ?? 'arcane',
      combinationMethod: session.generatorState?.combinationMethod ?? '',
      primaryPlot: session.generatorState?.primaryPlot ?? '',
      primaryTwist: session.generatorState?.primaryTwist ?? '',
      secondaryPlot: session.generatorState?.secondaryPlot ?? '',
      secondaryTwist: session.generatorState?.secondaryTwist ?? '',
      sceneCount: session.generatorState?.sceneCount ?? 0,
      sceneTypes:
        session.generatorState?.sceneTypes ??
        currentGeneratorState.sceneTypes ??
        {
          Exploration: false,
          Combat: false,
          'NPC Interaction': false,
          Dungeon: false,
        },
      generationHistory: generationHistory.length > 0 ? generationHistory : currentGeneratorState.generationHistory ?? [],
      searchQuery: session.generatorState?.searchQuery ?? '',
      filterLocationId: session.generatorState?.filterLocationId ?? '',
      filterFactionId: session.generatorState?.filterFactionId ?? '',
    },
    locationState: {
      maps,
      activeMapId,
      locations: Object.fromEntries(locations.map((location) => [location.id, location])),
      regions: Object.fromEntries(regions.map((region) => [region.id, region])),
      layers,
      viewSettings: (session.locationState?.viewSettings ?? currentLocationState.viewSettings) as LocationStateExport['viewSettings'],
    },
  };
}
