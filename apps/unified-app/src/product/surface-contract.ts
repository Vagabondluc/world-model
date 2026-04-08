import type { CanonicalBundle, EntityRecord, EventEnvelope, WorkflowRecord } from "@/domain/canonical";

export type ProductSurfaceKey = "world" | "story" | "schema";
export type DonorLens = "mythforge" | "adventure-generator" | "orbis";
export type SharedConceptFamily =
  | "biome-location"
  | "entities"
  | "workflows"
  | "simulation-events"
  | "projections"
  | "attachments";

export interface SharedConceptFamilyDefinition {
  family: SharedConceptFamily;
  label: string;
  summary: string;
  defaultLens: DonorLens;
  canonicalKey: string;
}

export interface SharedConceptProjection {
  family: SharedConceptFamily;
  label: string;
  summary: string;
  lens: DonorLens;
  lensLabel: string;
  canonicalKey: string;
  facts: string[];
}

export interface CrossDonorJourney {
  title: string;
  summary: string;
  steps: Array<{
    label: string;
    route: string;
    note: string;
  }>;
}

export const PRODUCT_SURFACE_BOUNDARY = {
  productLanguage: "World / Story / Schema",
  donorLanguage: "Mythforge / Adventure Generator / Orbis",
  codeBoundary: "src/product/surface-contract.ts",
  note: "Unified product surfaces use product language; donor surfaces preserve donor language, layout priorities, and interaction order."
} as const;

export const PRODUCT_SURFACES: Array<{
  key: ProductSurfaceKey;
  label: string;
  route: string;
  description: string;
  summary: string;
}> = [
  {
    key: "world",
    label: "World",
    route: "/world",
    description: "Map, locations, cities, biomes, and spatial relationships.",
    summary: "Spatial product surface"
  },
  {
    key: "story",
    label: "Story",
    route: "/story",
    description: "Quests, sessions, progression, and generated content.",
    summary: "Narrative product surface"
  },
  {
    key: "schema",
    label: "Schema",
    route: "/schema",
    description: "Contracts, adapters, migration reports, and provenance.",
    summary: "Expert product surface"
  }
];

export const SHARED_CONCEPT_FAMILIES: SharedConceptFamilyDefinition[] = [
  {
    family: "biome-location",
    label: "Biome / location",
    summary: "A spatial record read through three donor lenses.",
    defaultLens: "mythforge",
    canonicalKey: "entity:harbor-biome"
  },
  {
    family: "entities",
    label: "Entities",
    summary: "Named actors and places that stay canonical across surfaces.",
    defaultLens: "mythforge",
    canonicalKey: "entity:harbor-warden"
  },
  {
    family: "workflows",
    label: "Workflows",
    summary: "Guided steps, checkpoints, and resumable progress.",
    defaultLens: "adventure-generator",
    canonicalKey: "workflow:sample-adventure"
  },
  {
    family: "simulation-events",
    label: "Simulation events",
    summary: "Event history that drives Orbis review surfaces.",
    defaultLens: "orbis",
    canonicalKey: "event:session-advanced"
  },
  {
    family: "projections",
    label: "Projections",
    summary: "Derived state that remains tied to canonical sources.",
    defaultLens: "orbis",
    canonicalKey: "projection:harbor-warden"
  },
  {
    family: "attachments",
    label: "Attachments",
    summary: "World, entity, workflow, and simulation attachments viewed together.",
    defaultLens: "mythforge",
    canonicalKey: "world:sample"
  }
];

export const CROSS_DONOR_JOURNEYS: CrossDonorJourney[] = [
  {
    title: "World to workflow to simulation",
    summary: "Author a world in Mythforge, attach a workflow in Adventure Generator, then inspect the simulation in Orbis.",
    steps: [
      { label: "Mythforge world", route: "/donor/mythforge", note: "Open the canonical world and entity explorer." },
      { label: "Adventure workflow", route: "/donor/adventure-generator", note: "Inspect checkpoints and generated outputs." },
      { label: "Orbis simulation", route: "/donor/orbis", note: "Review enabled domains and snapshot state." },
      { label: "Return to world", route: "/world", note: "Confirm the same selected world and entity remain in context." }
    ]
  },
  {
    title: "Biome to location to profile",
    summary: "Inspect a shared biome/location record across all three donor surfaces without mutating canonical state.",
    steps: [
      { label: "Biome lens", route: "/schema", note: "Switch lens on the shared concept panel." },
      { label: "Product summary", route: "/world", note: "Read the same canonical record in the public product surface." },
      { label: "Donor compare", route: "/compare/donors", note: "Open the donor comparison surface for the same bundle." },
      { label: "Integration compare", route: "/compare", note: "Confirm the product/donor boundary and shared concept matrix." }
    ]
  }
];

function getEntity(bundle: CanonicalBundle, entityId: string): EntityRecord | null {
  return bundle.entities[entityId] ?? null;
}

function getWorkflow(bundle: CanonicalBundle, workflowId: string): WorkflowRecord | null {
  return bundle.workflows[workflowId] ?? null;
}

function getLatestEvent(bundle: CanonicalBundle, eventId: string): EventEnvelope | null {
  return bundle.events.find((event) => event.event_id === eventId) ?? null;
}

function lensLabel(lens: DonorLens): string {
  switch (lens) {
    case "mythforge":
      return "Mythforge lens";
    case "adventure-generator":
      return "Adventure Generator lens";
    case "orbis":
      return "Orbis lens";
  }
}

export function recommendSurfaceForBundle(bundle: CanonicalBundle): {
  key: ProductSurfaceKey;
  label: string;
  reason: string;
} {
  const workflowCount = Object.keys(bundle.workflows).length;
  const hasSimulation = bundle.world?.simulation_attachment !== null && bundle.world?.simulation_attachment !== undefined;

  if (hasSimulation) {
    return {
      key: "schema",
      label: "Schema",
      reason: "the canonical bundle already includes simulation and audit artifacts"
    };
  }

  if (workflowCount > 0) {
    return {
      key: "story",
      label: "Story",
      reason: "the canonical bundle already includes workflows and guided progress"
    };
  }

  return {
    key: "world",
    label: "World",
    reason: "the canonical bundle is centered on spatial world editing"
  };
}

export function projectSharedConcept(bundle: CanonicalBundle, family: SharedConceptFamily, lens: DonorLens): SharedConceptProjection {
  const familyDefinition = SHARED_CONCEPT_FAMILIES.find((entry) => entry.family === family) ?? SHARED_CONCEPT_FAMILIES[0];
  const world = bundle.world;
  const biome = getEntity(bundle, "entity:harbor-biome");
  const warden = getEntity(bundle, "entity:harbor-warden");
  const city = getEntity(bundle, "entity:sample-city");
  const workflow = getWorkflow(bundle, "workflow:sample-adventure");
  const projection = bundle.projections["projection:harbor-warden"];
  const latestEvent = getLatestEvent(bundle, "event:session-advanced");

  if (family === "biome-location") {
    return {
      family,
      label: biome?.metadata.label ?? "Harbor Biome",
      summary: biome?.metadata.summary ?? "A shared spatial concept inspected through donor lenses.",
      lens,
      lensLabel: lensLabel(lens),
      canonicalKey: biome?.entity_id ?? familyDefinition.canonicalKey,
      facts:
        lens === "mythforge"
          ? [
              `Map anchor: ${biome?.location_attachment?.map_anchor ?? "map:harbor-bay"}`,
              `Layer membership: ${biome?.location_attachment?.layer_membership.join(", ") ?? "surface, coastal"}`,
              `Spatial scope: ${biome?.location_attachment?.spatial_scope ?? "biome"}`
            ]
          : lens === "adventure-generator"
            ? [
                `Linked workflow: ${workflow?.workflow_id ?? "workflow:sample-adventure"}`,
                `Checkpoints: ${workflow?.attachment.checkpoints.length ?? 0}`,
                `Output references: ${workflow?.attachment.output_references.length ?? 0}`
              ]
            : [
                `Profile: ${world?.simulation_attachment?.profile_id ?? "profile:sample-world"}`,
                `Enabled domains: ${world?.simulation_attachment?.enabled_domains.length ?? 0}`,
                `Latest snapshot: ${world?.simulation_attachment?.latest_snapshot_refs[0]?.snapshot_ref ?? "snapshot:weather-001"}`
              ]
    };
  }

  if (family === "entities") {
    return {
      family,
      label: warden?.metadata.label ?? "Harbor Warden",
      summary: warden?.metadata.summary ?? "A canonical entity used to compare donor lenses.",
      lens,
      lensLabel: lensLabel(lens),
      canonicalKey: warden?.entity_id ?? familyDefinition.canonicalKey,
      facts:
        lens === "mythforge"
          ? [
              `Explorer label: ${warden?.metadata.label ?? "Harbor Warden"}`,
              `Location anchor: ${warden?.location_attachment?.map_anchor ?? "map:sample-city"}`,
              `Workspace projection: ${warden?.latest_projection_reference ?? "projection:harbor-warden"}`
            ]
          : lens === "adventure-generator"
            ? [
                `Workflow status: ${warden?.workflow_attachment?.status ?? "active"}`,
                `Checkpoint count: ${warden?.workflow_attachment?.checkpoints.length ?? 0}`,
                `Resume ratio: ${(warden?.workflow_attachment?.progress_ratio ?? 0) * 100}%`
              ]
            : [
                `Projection version: ${projection?.projection_version ?? "1.0.0"}`,
                `Source range: ${projection?.source_event_range.start_event_id ?? "event:bootstrap"} -> ${projection?.source_event_range.end_event_id ?? "event:session-advanced"}`,
                `Derived state: ${JSON.stringify(projection?.derived_state ?? { presence: "active" })}`
              ]
    };
  }

  if (family === "workflows") {
    return {
      family,
      label: workflow?.metadata.label ?? "Sample Adventure",
      summary: workflow?.metadata.summary ?? "A donor workflow reconstructed over canonical state.",
      lens,
      lensLabel: lensLabel(lens),
      canonicalKey: workflow?.workflow_id ?? familyDefinition.canonicalKey,
      facts:
        lens === "mythforge"
          ? [
              `Top-level entity references: ${world?.workflow_registry_references.length ?? 0}`,
              `Workflow label: ${workflow?.metadata.label ?? "Sample Adventure"}`,
              `World linkage: ${workflow?.world_id ?? "world:sample"}`
            ]
          : lens === "adventure-generator"
            ? [
                `Progress ratio: ${(workflow?.attachment.progress_ratio ?? 0) * 100}%`,
                `Checkpoints: ${workflow?.attachment.checkpoints.map((checkpoint) => checkpoint.checkpoint_key).join(", ") || "none"}`,
                `Resumable: ${workflow?.attachment.resumable ? "yes" : "no"}`
              ]
            : [
                `Event history: ${workflow?.event_history.event_ids.join(", ") || "none"}`,
                `Output references: ${workflow?.attachment.output_references.length ?? 0}`,
                `Activity type: ${workflow?.attachment.activity_type ?? "guided-adventure"}`
              ]
    };
  }

  if (family === "simulation-events") {
    return {
      family,
      label: latestEvent?.event_type ?? "WorkflowCheckpointReached",
      summary: "A canonical event viewed through donor-specific review surfaces.",
      lens,
      lensLabel: lensLabel(lens),
      canonicalKey: latestEvent?.event_id ?? familyDefinition.canonicalKey,
      facts:
        lens === "mythforge"
          ? [
              `Owner world: ${world?.world_id ?? "world:sample"}`,
              `Event id: ${latestEvent?.event_id ?? "event:session-advanced"}`,
              `Causation: ${latestEvent?.causation.causation_id ?? "event:bootstrap"}`
            ]
          : lens === "adventure-generator"
            ? [
                `Checkpoint: ${latestEvent?.payload.inline_payload && typeof latestEvent.payload.inline_payload === "object" ? String((latestEvent.payload.inline_payload as { checkpoint?: string }).checkpoint ?? "briefing") : "briefing"}`,
                `Correlation id: ${latestEvent?.causation.correlation_id ?? "corr:sample-adventure"}`,
                `Trace id: ${latestEvent?.causation.trace_id ?? "trace:sample-adventure"}`
              ]
            : [
                `Source system: ${latestEvent?.source_system ?? "AdventureGenerator"}`,
                `Occurred at: ${latestEvent?.occurred_at ?? "2026-01-01T00:15:00.000Z"}`,
                `Payload ref: ${latestEvent?.payload.payload_ref ?? "none"}`
              ]
    };
  }

  if (family === "projections") {
    return {
      family,
      label: projection?.projection_id ?? "projection:harbor-warden",
      summary: "A derived state object that remains tied to a canonical source.",
      lens,
      lensLabel: lensLabel(lens),
      canonicalKey: projection?.projection_id ?? familyDefinition.canonicalKey,
      facts:
        lens === "mythforge"
          ? [
              `Owner entity: ${warden?.entity_id ?? "entity:harbor-warden"}`,
              `Projection id: ${projection?.projection_id ?? "projection:harbor-warden"}`,
              `Workspace view: ${warden?.metadata.label ?? "Harbor Warden"}`
            ]
          : lens === "adventure-generator"
            ? [
                `Output references: ${warden?.workflow_attachment?.output_references.length ?? 0}`,
                `Event range: ${projection?.source_event_range.start_event_id ?? "event:bootstrap"} -> ${projection?.source_event_range.end_event_id ?? "event:session-advanced"}`,
                `Projection version: ${projection?.projection_version ?? "1.0.0"}`
              ]
            : [
                `Derived state: ${JSON.stringify(projection?.derived_state ?? { presence: "active" })}`,
                `Schema binding version: ${projection?.schema_binding_version ?? "none"}`,
                `Source entity: ${projection?.owner.Entity ?? "entity:harbor-warden"}`
              ]
    };
  }

  return {
    family,
    label: "Canonical attachments",
    summary: "World, entity, workflow, and simulation attachments projected without mutating the bundle.",
    lens,
    lensLabel: lensLabel(lens),
    canonicalKey: familyDefinition.canonicalKey,
    facts:
      lens === "mythforge"
        ? [
            `World attachments: ${world?.asset_attachments.length ?? 0}`,
            `Entity attachments: ${Object.values(bundle.entities).reduce((sum, entity) => sum + entity.asset_attachments.length, 0)}`,
            `Workflow attachments: ${Object.values(bundle.workflows).reduce((sum, workflowRecord) => sum + workflowRecord.asset_attachments.length, 0)}`
          ]
        : lens === "adventure-generator"
          ? [
              `Workflow registry references: ${world?.workflow_registry_references.join(", ") || "none"}`,
              `Entity workflow attachment: ${warden?.workflow_attachment?.workflow_id ?? "workflow:sample-adventure"}`,
              `Location attachment: ${city?.location_attachment?.spatial_scope ?? "city"}`
            ]
          : [
              `Simulation attachment: ${world?.simulation_attachment?.profile_id ?? "profile:sample-world"}`,
              `Enabled domains: ${world?.simulation_attachment?.enabled_domains.map((domain) => String(domain.id)).join(", ") || "none"}`,
              `Latest events: ${bundle.events.length}`
            ]
  };
}
