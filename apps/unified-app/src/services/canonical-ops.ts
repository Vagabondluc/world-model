import { SAMPLE_BUNDLE } from "@/services/canonical-fixtures";
import type {
  AppendOnlyEventLedger,
  AssetRecord,
  CanonicalBundle,
  EntityRecord,
  EventEnvelope,
  HumanMetadata,
  LocationAttachment,
  OwnerRef,
  RelationRecord,
  SchemaBindingRecord,
  WorkflowAttachment,
  WorldRecord
} from "@/domain/canonical";

export interface MetadataDraft {
  label: string;
  summary: string;
  tags: string;
}

export interface WorldDraft extends MetadataDraft {
  worldId: string;
  description: string;
}

export interface EntityDraft extends MetadataDraft {
  entityId: string;
  entityType: string;
  worldId: string;
  description: string;
  mapAnchor: string;
  spatialScope: string;
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

function cloneBundle(bundle: CanonicalBundle): CanonicalBundle {
  return structuredClone(bundle);
}

function splitTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function makeEventId(prefix: string, seed: string, totalEvents: number): string {
  return `${prefix}:${slugify(seed)}:${totalEvents + 1}`;
}

function makeEvent(owner: OwnerRef, eventId: string, eventType: string, payload: unknown): EventEnvelope {
  return {
    event_id: eventId,
    event_type: eventType,
    occurred_at: new Date().toISOString(),
    owner,
    payload: { inline_payload: payload, payload_ref: null },
    source_system: "UnifiedApp",
    causation: {
      causation_id: null,
      correlation_id: null,
      trace_id: null
    }
  };
}

function sampleWorldTemplate(): WorldRecord {
  if (!SAMPLE_BUNDLE.world) {
    throw new Error("sample world template is missing");
  }
  return structuredClone(SAMPLE_BUNDLE.world);
}

function sampleEntityTemplate(): EntityRecord {
  const entity = Object.values(SAMPLE_BUNDLE.entities)[0];
  if (!entity) {
    throw new Error("sample entity template is missing");
  }
  return structuredClone(entity);
}

export function createWorldBundle(bundle: CanonicalBundle, draft: WorldDraft): CanonicalBundle {
  const next = cloneBundle(bundle);
  const world = sampleWorldTemplate();
  const eventId = makeEventId("event", draft.label, next.events.length);
  world.world_id = draft.worldId;
  world.metadata = {
    label: draft.label,
    summary: draft.summary || null,
    tags: splitTags(draft.tags)
  };
  world.payload = { description: draft.description };
  world.root_event_ledger = {
    event_ids: [...world.root_event_ledger.event_ids, eventId]
  };
  next.world = world;
  next.events.push(makeEvent({ World: world.world_id }, eventId, "WorldCreated", draft));
  return next;
}

export function createEntityBundle(bundle: CanonicalBundle, draft: EntityDraft): CanonicalBundle {
  const next = cloneBundle(bundle);
  const world = next.world ?? sampleWorldTemplate();
  const entity = sampleEntityTemplate();
  const eventId = makeEventId("event", draft.entityId, next.events.length);
  entity.entity_id = draft.entityId;
  entity.entity_type = draft.entityType;
  entity.world_id = draft.worldId;
  entity.metadata = {
    label: draft.label,
    summary: draft.summary || null,
    tags: splitTags(draft.tags)
  };
  entity.payload = { description: draft.description };
  entity.location_attachment = {
    layer_membership: ["surface"],
    map_anchor: draft.mapAnchor,
    spatial_scope: draft.spatialScope
  } satisfies LocationAttachment;
  entity.event_history = {
    event_ids: [...entity.event_history.event_ids, eventId]
  } satisfies AppendOnlyEventLedger;
  const nextWorld = next.world ?? world;
  if (!nextWorld) {
    throw new Error("sample world template is missing");
  }
  next.world = nextWorld;
  nextWorld.top_level_entity_index = Array.from(new Set([...nextWorld.top_level_entity_index, entity.entity_id]));
  next.events.push(makeEvent({ Entity: entity.entity_id }, eventId, "EntityCreated", draft));
  next.entities[entity.entity_id] = entity;
  return next;
}

export function updateWorldMetadata(bundle: CanonicalBundle, draft: MetadataDraft): CanonicalBundle {
  if (!bundle.world) {
    return bundle;
  }
  const next = cloneBundle(bundle);
  const world = next.world;
  if (!world) {
    return bundle;
  }
  world.metadata = {
    label: draft.label,
    summary: draft.summary || null,
    tags: splitTags(draft.tags)
  };
  return next;
}

export function updateEntityMetadata(bundle: CanonicalBundle, entityId: string, draft: MetadataDraft): CanonicalBundle {
  const entity = bundle.entities[entityId];
  if (!entity) {
    return bundle;
  }
  const next = cloneBundle(bundle);
  next.entities[entityId].metadata = {
    label: draft.label,
    summary: draft.summary || null,
    tags: splitTags(draft.tags)
  };
  return next;
}

export function updateEntityDescription(bundle: CanonicalBundle, entityId: string, description: string): CanonicalBundle {
  const entity = bundle.entities[entityId];
  if (!entity) {
    return bundle;
  }
  const next = cloneBundle(bundle);
  next.entities[entityId].payload = { description };
  return next;
}

export function updateWorldDescription(bundle: CanonicalBundle, description: string): CanonicalBundle {
  if (!bundle.world) {
    return bundle;
  }
  const next = cloneBundle(bundle);
  const world = next.world;
  if (!world) {
    return bundle;
  }
  world.payload = { description };
  return next;
}

export function createAssetRecord(bundle: CanonicalBundle, sourceRef: string, owner: OwnerRef, kind: string): CanonicalBundle {
  const next = cloneBundle(bundle);
  const assetId = `asset:${slugify(sourceRef)}:${Object.keys(next.assets).length + 1}`;
  const asset: AssetRecord = {
    asset_id: assetId,
    asset_kind: kind,
    metadata: {
      label: sourceRef,
      summary: null,
      tags: [kind]
    },
    owner,
    payload: {},
    source_ref: sourceRef
  };
  next.assets[assetId] = asset;
  return next;
}

export function copyBundle(bundle: CanonicalBundle): CanonicalBundle {
  return cloneBundle(bundle);
}
