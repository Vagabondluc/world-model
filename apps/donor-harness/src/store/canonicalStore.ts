import { create } from 'zustand'

// ---- Enums (mirror Rust canonical enums) ----

export type BiomeType =
  | 'forest' | 'plains' | 'desert' | 'tundra' | 'mountain'
  | 'swamp' | 'ocean' | 'urban' | 'ruins' | 'cavern'
  | 'volcanic' | 'farmland' | 'jungle' | 'savanna' | 'mystic'
  | { other: string }

export type DiscoveryStatus = 'unknown' | 'surveyed' | 'settled' | 'ruined'

export type DashboardMode = 'hidden' | 'summary' | 'diagnostic'

export type FidelityLevel = 'low' | 'medium' | 'high'

export type TickMode = 'disabled' | 'on_demand' | 'continuous' | 'stepped'

export type SourceSystem =
  | 'Mythforge' | 'Orbis' | 'AdventureGenerator'
  | 'MappaImperium' | 'DawnOfWorlds' | 'FactionImage'
  | 'Neutral' | { external: string }

export type SchemaClass = 'native_schema' | 'project_schema' | 'simulation_schema' | 'workflow_schema'

export type SimulationDomainId =
  | 'Genesis' | 'Climate' | 'Topography' | 'Hydrology' | 'Ecology'
  | 'Population' | 'Economy' | 'Culture' | 'Conflict' | 'Magic'
  | 'Resources' | 'Infrastructure' | 'Transportation' | 'Governance'
  | 'Technology' | 'Demographics' | { custom: string }

// ---- Value types ----

export type JsonValue =
  | string | number | boolean | null
  | JsonValue[]
  | { [key: string]: JsonValue }

// ---- Struct types (mirror Rust structs) ----

export interface HumanMetadata {
  label: string
  summary: string | null
  tags: string[]
}

export interface HexCoordinate {
  q: number
  r: number
  s: number
}

export interface LocationAttachment {
  map_anchor: string
  hex_or_cell_ref: string | null
  coordinate_ref: string | null
  spatial_scope: string
  layer_membership: string[]
  biome_type: BiomeType | null
  discovery_status: DiscoveryStatus | null
  hex_coordinate: HexCoordinate | null
}

export interface SimulationDomainConfig {
  id: SimulationDomainId
  enabled: boolean
  fidelity: FidelityLevel
  tick_mode: TickMode
}

export interface SimulationSnapshotRef {
  domain_id: SimulationDomainId
  snapshot_ref: string
  trace_id: string
}

export interface SimulationProvenance {
  source_system: SourceSystem
  profile_version: string
}

export interface SimulationAttachment {
  profile_id: string | null
  enabled_domains: SimulationDomainConfig[]
  dashboard_mode: DashboardMode
  latest_snapshot_refs: SimulationSnapshotRef[]
  provenance: SimulationProvenance
}

export interface ExternalSchemaRef {
  source_system: SourceSystem
  source_uri: string
  validation_contract_ref: string | null
  migration_contract_ref: string | null
}

export interface MigrationLineage {
  previous_schema_version: string | null
  migration_ref: string | null
}

export interface SchemaBindingRecord {
  schema_id: string
  schema_class: SchemaClass
  promoted_schema_ref: string | null
  external_schema_ref: ExternalSchemaRef
  version: string
  activation_event_id: string
  migration_lineage: MigrationLineage
}

export interface AppendOnlyEventLedger {
  event_ids: string[]
}

export interface WorldRecord {
  world_id: string
  metadata: HumanMetadata
  payload: JsonValue
  root_event_ledger: AppendOnlyEventLedger
  root_schema_binding: SchemaBindingRecord | null
  workflow_registry_references: string[]
  simulation_attachment: SimulationAttachment | null
  asset_attachments: string[]
  top_level_entity_index: string[]
}

// ---- Store ----

interface Store {
  world: WorldRecord | null
  setWorld: (w: WorldRecord) => void
  clearWorld: () => void
}

export const useCanonicalStore = create<Store>()((set) => ({
  world: null,
  setWorld: (w) => set({ world: w }),
  clearWorld: () => set({ world: null }),
}))
