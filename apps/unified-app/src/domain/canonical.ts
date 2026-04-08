export interface HumanMetadata {
  label: string;
  summary?: string | null;
  tags: string[];
}

export interface AppendOnlyEventLedger {
  event_ids: string[];
}

export interface OwnerRef {
  World?: string;
  Entity?: string;
  Asset?: string;
  Workflow?: string;
}

export interface EventCausation {
  causation_id?: string | null;
  correlation_id?: string | null;
  trace_id?: string | null;
}

export interface EventPayloadRef {
  inline_payload: unknown;
  payload_ref?: string | null;
}

export interface EventEnvelope {
  event_id: string;
  event_type: string;
  occurred_at: string;
  owner: OwnerRef;
  payload: EventPayloadRef;
  source_system: unknown;
  causation: EventCausation;
}

export interface RelationProvenance {
  source_system: unknown;
  note?: string | null;
}

export interface RelationRecord {
  source_entity_id: string;
  target_entity_id: string;
  relation_type: unknown;
  provenance: RelationProvenance;
  effective_from?: string | null;
  effective_to?: string | null;
}

export interface ExternalSchemaRef {
  source_system: unknown;
  source_uri: string;
  migration_contract_ref?: string | null;
  validation_contract_ref?: string | null;
}

export interface MigrationLineage {
  migration_ref?: string | null;
  previous_schema_version?: string | null;
}

export interface SchemaBindingRecord {
  activation_event_id: string;
  external_schema_ref: ExternalSchemaRef;
  migration_lineage: MigrationLineage;
  schema_class: unknown;
  schema_id: string;
  version: string;
  promoted_schema_ref?: string | null;
}

export interface LocationAttachment {
  layer_membership: string[];
  map_anchor: string;
  spatial_scope: string;
  coordinate_ref?: string | null;
  hex_or_cell_ref?: string | null;
}

export interface WorkflowCheckpoint {
  checkpoint_key: string;
  reached_at: string;
}

export interface WorkflowStepState {
  step_key: string;
  state: unknown;
}

export interface WorkflowAttachment {
  activity_type: string;
  checkpoints: WorkflowCheckpoint[];
  output_references: OwnerRef[];
  progress_ratio: number;
  resumable: boolean;
  status: unknown;
  step_state: WorkflowStepState[];
  workflow_id: string;
}

export interface SimulationSnapshotRef {
  domain_id: unknown;
  snapshot_ref: string;
  trace_id: string;
}

export interface SimulationDomainConfig {
  enabled: boolean;
  fidelity: unknown;
  id: unknown;
  tick_mode: unknown;
}

export interface SimulationProvenance {
  profile_version: string;
  source_system: unknown;
}

export interface SimulationAttachment {
  dashboard_mode: unknown;
  enabled_domains: SimulationDomainConfig[];
  latest_snapshot_refs: SimulationSnapshotRef[];
  provenance: SimulationProvenance;
  profile_id?: string | null;
}

export interface WorldRecord {
  asset_attachments: string[];
  metadata: HumanMetadata;
  payload: unknown;
  root_event_ledger: AppendOnlyEventLedger;
  top_level_entity_index: string[];
  workflow_registry_references: string[];
  world_id: string;
  root_schema_binding?: SchemaBindingRecord | null;
  simulation_attachment?: SimulationAttachment | null;
}

export interface EntityRecord {
  asset_attachments: string[];
  entity_id: string;
  entity_type: string;
  event_history: AppendOnlyEventLedger;
  metadata: HumanMetadata;
  payload: unknown;
  relation_references: RelationRecord[];
  world_id: string;
  latest_projection_reference?: string | null;
  location_attachment?: LocationAttachment | null;
  schema_binding?: SchemaBindingRecord | null;
  workflow_attachment?: WorkflowAttachment | null;
}

export interface AssetRecord {
  asset_id: string;
  asset_kind: string;
  metadata: HumanMetadata;
  owner: OwnerRef;
  payload: unknown;
  source_ref: string;
}

export interface ProjectionRecord {
  derived_state: unknown;
  owner: OwnerRef;
  projection_id: string;
  projection_version: string;
  source_event_range: {
    start_event_id: string;
    end_event_id: string;
  };
  schema_binding_version?: string | null;
}

export interface WorkflowRecord {
  asset_attachments: string[];
  attachment: WorkflowAttachment;
  event_history: AppendOnlyEventLedger;
  metadata: HumanMetadata;
  payload: unknown;
  workflow_id: string;
  world_id: string;
  schema_binding?: SchemaBindingRecord | null;
}

export interface MigrationRecord {
  from_schema_version: string;
  migration_id: string;
  owner: OwnerRef;
  to_schema_version: string;
  triggered_by_event_id: string;
  notes?: string | null;
}

export interface CanonicalBundle {
  assets: Record<string, AssetRecord>;
  entities: Record<string, EntityRecord>;
  events: EventEnvelope[];
  migrations: MigrationRecord[];
  projections: Record<string, ProjectionRecord>;
  relations: RelationRecord[];
  workflows: Record<string, WorkflowRecord>;
  world?: WorldRecord | null;
}
