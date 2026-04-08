import type { CanonicalBundle } from "@/domain/canonical";

export const SAMPLE_BUNDLE: CanonicalBundle = {
  assets: {},
  entities: {
    "entity:sample-city": {
      asset_attachments: [],
      entity_id: "entity:sample-city",
      entity_type: "city",
      event_history: {
        event_ids: ["event:bootstrap"]
      },
      metadata: {
        label: "Sample City",
        summary: "A minimal world entity used to exercise the scaffold.",
        tags: ["city", "sample", "role", "task", "flow"]
      },
      payload: {
        description: "A hand-authored sample entity for the unified app scaffold."
      },
      relation_references: [],
      world_id: "world:sample",
      latest_projection_reference: null,
      location_attachment: {
        layer_membership: ["surface"],
        map_anchor: "map:overworld",
        spatial_scope: "city"
      },
      schema_binding: {
        activation_event_id: "event:bootstrap",
        external_schema_ref: {
          source_system: "Neutral",
          source_uri: "world-model://sample-city",
          migration_contract_ref: null,
          validation_contract_ref: null
        },
        migration_lineage: {
          migration_ref: null,
          previous_schema_version: null
        },
        schema_class: "ProjectSchema",
        schema_id: "city.sample",
        version: "1.0.0",
        promoted_schema_ref: null
      },
      workflow_attachment: null
    }
  },
  events: [
    {
      event_id: "event:bootstrap",
      event_type: "WorldBootstrapped",
      occurred_at: "2026-01-01T00:00:00.000Z",
      owner: {
        World: "world:sample"
      },
      payload: {
        inline_payload: {
          kind: "bootstrap"
        },
        payload_ref: null
      },
      source_system: "Neutral",
      causation: {
        causation_id: null,
        correlation_id: null,
        trace_id: null
      }
    }
  ],
  migrations: [],
  projections: {},
  relations: [],
  workflows: {},
  world: {
    asset_attachments: [],
    metadata: {
      label: "Sample World",
      summary: "Canonical scaffold world for Phase 3.",
      tags: ["sample", "world", "story", "schema"]
    },
    payload: {
      description: "Phase 3 scaffold world."
    },
    root_event_ledger: {
      event_ids: ["event:bootstrap"]
    },
    top_level_entity_index: ["entity:sample-city"],
    workflow_registry_references: [],
    world_id: "world:sample",
    root_schema_binding: null,
    simulation_attachment: null
  }
};
