# Mythforge — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Mythforge |
| Class | **real app** |
| Adapter ID | `mythforge` |
| Manifest | `adapters/mythforge/manifest.yaml` |
| Source Root | `adapters/mythforge/source-snapshot/` (schema-templates only) |
| Source Kind | `schema_template` |
| Canonical Lane | trunk |
| Phase 7 Methodology | behavioral capture |
| Adapter Status | **registered** |

## What It Is

Mythforge is the primary donor application. It is a worldbuilding authoring tool with schema-aware entities, world ownership, append-only history, and spatial/relational attachments. It is the only donor that defines the core canonical identity of a World and Entity.

All other donors attach to records that Mythforge defines. This means Mythforge's shape is the constraint all other adapters must conform to — it is called the **trunk** donor.

The adapter copies schema templates only (not application code or UI). The application code lives elsew here in the workspace and is reserved for Phase 7 behavioral capture.

## What Is Extracted

| Included Path | Reason |
|---|---|
| `schemas/` | canonical entity and world schema templates |
| `index.md`, `Campaign.md`, `Character.md`, `Settlement.md`, `Region.md`, `Artifact.md`, `Item.md`, `Faction.md`, `NPC.md`, `Landmark.md` | schema-level concept definitions |
| `UUID_CONTAINER_ARCHITECTURE.md`, `UUID_CONTAINER_IMPLEMENTATION_PLAN.md` | identity architecture decisions |

## What Is Not Extracted

| Excluded Path | Reason |
|---|---|
| `prompts/` | donor-specific AI prompting (not canonical) |
| `samples/` | example content, not schema enforcements |
| `methods/` | donor-specific UX flows (available for Phase 7) |

The `methods/` and related UI paths are excluded from data extraction scope but remain accessible for Phase 7 behavioral characterization. Exclusion from the adapter does not remove them from the Phase 7 task list.

## Canonical Lane — Trunk

Mythforge owns the root canonical model. All other donors attach to records defined here.

### Canonical Records Owned by This Donor

| Canonical Record | Description |
|---|---|
| `WorldRecord` | top-level world identity, slug, metadata |
| `EntityRecord` | all named entities (characters, places, factions, items, artifacts) |
| `SchemaBindingRecord` | binding between entities and schema templates |
| `EventEnvelope` | append-only history event wrapper |
| `ProjectionRecord` | derived/summarized state over history |
| `RelationRecord` | directional typed relation between two entities |
| `AssetRecord` | file or media asset attached to world or entity |
| `LocationAttachment` | spatial attachment on EntityRecord (biome, region, settlement, dungeon, landmark) |

### Promotion Class

`core` — concepts promoted from this donor become part of the canonical root model. No other donor can override core-promotions.

## Concept Families

Registered in `adapters/concept-family-registry.yaml`:

- `identity-history` — world and entity identity shapes, event history
- `schema-contract` — the binding model between entities and schema templates
- `entity-template` — template-level definitions (Character, Faction, Settlement, etc.)

## UI Characterization Methodology

**Behavioral capture.** Mythforge is a runnable full application. The Phase 7 characterization process:

1. Run the donor app from the workspace
2. Walk each user-facing feature from the donor's navigation
3. Record observable behavior, state transitions, and field semantics
4. Produce a behavior matrix with columns: `feature | steps | outcome | canonical_mapping | basis: captured`

This methodology produces the highest-confidence characterization. All Mythforge feature requirements in Phase 7 must carry `basis: captured` or `basis: captured_with_deviation` (with a registered waiver). `basis: inferred` is not permitted for Mythforge features.

## Spatial Semantics in LocationAttachment

Mythforge explicitly defines these spatial types, all of which fold into `LocationAttachment`:

- city / settlement
- region
- biome
- dungeon
- landmark

**Biome cross-donor constraint:** Multiple donors contribute biome vocabulary. Mythforge's `LocationAttachment.biome` field accepts a string; the canonical biome vocabulary is extended by cross-donor promotion. The Mythforge surface must render exactly the biome interaction its donor app provides. Other donor surfaces that display biomes must render biomes in their own donor-faithful way — they do not inherit Mythforge's UI.

## Open Questions

- Does Mythforge have a multi-world workspace concept (multiple WorldRecords active at once), or one world at a time?
- Is the EventEnvelope schema intended for full replay, or is it a partial audit log?
- Does Mythforge have an entity ownership model (user ↔ entity) that needs a canonical record?
