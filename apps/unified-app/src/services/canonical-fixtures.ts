import type { CanonicalBundle } from "@/domain/canonical";

export const SAMPLE_BUNDLE: CanonicalBundle = {
  assets: {},
  entities: {
    "entity:harbor-biome": {
      asset_attachments: [],
      entity_id: "entity:harbor-biome",
      entity_type: "biome",
      event_history: {
        event_ids: ["event:bootstrap"]
      },
      metadata: {
        label: "Harbor Biome",
        summary: "A shoreline biome used to exercise shared concept lensing.",
        tags: ["biome", "location", "sample"]
      },
      payload: {
        description: "The coastline biome frames Sample City and the harbor district."
      },
      relation_references: [],
      world_id: "world:sample",
      latest_projection_reference: null,
      location_attachment: {
        layer_membership: ["surface", "coastal"],
        map_anchor: "map:harbor-bay",
        spatial_scope: "biome"
      },
      schema_binding: null,
      workflow_attachment: null
    },
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
    },
    "entity:harbor-warden": {
      asset_attachments: [],
      entity_id: "entity:harbor-warden",
      entity_type: "character",
      event_history: {
        event_ids: ["event:bootstrap", "event:session-advanced"]
      },
      metadata: {
        label: "Harbor Warden",
        summary: "A named NPC used to exercise workflow and projection surfaces.",
        tags: ["npc", "sample", "workflow"]
      },
      payload: {
        description: "The warden coordinates arrivals, departures, and rumors around Sample City."
      },
      relation_references: [],
      world_id: "world:sample",
      latest_projection_reference: "projection:harbor-warden",
      location_attachment: {
        layer_membership: ["surface"],
        map_anchor: "map:sample-city",
        spatial_scope: "district"
      },
      schema_binding: null,
      workflow_attachment: {
        activity_type: "guided-adventure",
        checkpoints: [
          {
            checkpoint_key: "briefing",
            reached_at: "2026-01-01T00:15:00.000Z"
          }
        ],
        output_references: [{ Entity: "entity:sample-city" }],
        progress_ratio: 0.5,
        resumable: true,
        status: "active",
        step_state: [
          {
            step_key: "start",
            state: "complete"
          },
          {
            step_key: "rumor",
            state: "in-progress"
          }
        ],
        workflow_id: "workflow:sample-adventure"
      }
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
    },
    {
      event_id: "event:session-advanced",
      event_type: "WorkflowCheckpointReached",
      occurred_at: "2026-01-01T00:15:00.000Z",
      owner: {
        Workflow: "workflow:sample-adventure"
      },
      payload: {
        inline_payload: {
          checkpoint: "briefing"
        },
        payload_ref: null
      },
      source_system: "AdventureGenerator",
      causation: {
        causation_id: "event:bootstrap",
        correlation_id: "corr:sample-adventure",
        trace_id: "trace:sample-adventure"
      }
    }
  ],
  migrations: [],
  projections: {
    "projection:harbor-warden": {
      derived_state: {
        presence: "active"
      },
      owner: {
        Entity: "entity:harbor-warden"
      },
      projection_id: "projection:harbor-warden",
      projection_version: "1.0.0",
      source_event_range: {
        start_event_id: "event:bootstrap",
        end_event_id: "event:session-advanced"
      },
      schema_binding_version: null
    }
  },
  relations: [
    {
      source_entity_id: "entity:sample-city",
      target_entity_id: "entity:harbor-biome",
      relation_type: "located_within",
      provenance: {
        source_system: "Neutral",
        note: "Sample city sits inside the harbor biome."
      },
      effective_from: "2026-01-01T00:00:00.000Z",
      effective_to: null
    }
  ],
  workflows: {
    "workflow:sample-adventure": {
      asset_attachments: [],
      attachment: {
        activity_type: "guided-adventure",
        checkpoints: [
          {
            checkpoint_key: "briefing",
            reached_at: "2026-01-01T00:15:00.000Z"
          }
        ],
        output_references: [{ Entity: "entity:sample-city" }],
        progress_ratio: 0.5,
        resumable: true,
        status: "active",
        step_state: [
          {
            step_key: "start",
            state: "complete"
          },
          {
            step_key: "rumor",
            state: "in-progress"
          }
        ],
        workflow_id: "workflow:sample-adventure"
      },
      event_history: {
        event_ids: ["event:bootstrap", "event:session-advanced"]
      },
      metadata: {
        label: "Sample Adventure",
        summary: "A guided workflow record used to exercise workflow donor surfaces.",
        tags: ["workflow", "sample", "adventure"]
      },
      payload: {
        description: "Resume the harbor rumor and prepare the next city beat."
      },
      workflow_id: "workflow:sample-adventure",
      world_id: "world:sample",
      schema_binding: null
    }
  },
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
    top_level_entity_index: ["entity:harbor-biome", "entity:sample-city", "entity:harbor-warden"],
    workflow_registry_references: ["workflow:sample-adventure"],
    world_id: "world:sample",
    root_schema_binding: null,
    simulation_attachment: {
      dashboard_mode: "console",
      enabled_domains: [
        {
          enabled: true,
          fidelity: "high",
          id: "weather",
          tick_mode: "continuous"
        },
        {
          enabled: false,
          fidelity: "medium",
          id: "economy",
          tick_mode: "manual"
        }
      ],
      latest_snapshot_refs: [
        {
          domain_id: "weather",
          snapshot_ref: "snapshot:weather-001",
          trace_id: "trace:weather-001"
        }
      ],
      provenance: {
        profile_version: "2.0.0",
        source_system: "Orbis"
      },
      profile_id: "profile:sample-world"
    }
  }
};
