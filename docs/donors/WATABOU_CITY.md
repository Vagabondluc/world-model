# Watabou City Generator — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Watabou City Generator |
| Internal ID | `watabou-city` (provisional) |
| Class | **source-fragment (GPL)** |
| Adapter ID | none — not registered |
| Manifest | not yet created |
| Source Root | `to be merged/watabou-city-clean-room/gpl_source/` |
| Source Kind | Haxe (OpenFL + Lime) |
| License | GPL |
| Original Author | Watabou (Peter Dmitriev) |
| Canonical Lane | procedural-city-layout (candidate) |
| Phase 7 Methodology | designed intent authoring |
| Adapter Status | **unregistered** |

## What It Is

The Watabou Medieval Fantasy City Generator is a procedural city-generation tool originally written by Watabou in Haxe (OpenFL). The GPL source has been placed in this repository as a clean-room reference for algorithm and concept extraction.

The application generates a top-down map of a medieval fantasy city from a seed and a city size. It uses Voronoi partitioning to divide the city into patches (city blocks), assigns ward types to each block, builds walls, gates, roads, and the citadel, and renders the result as a 2D vector graphic.

The react-app subfolder (`watabou-city-clean-room/react-app/`) contains only `dist/` and `node_modules/` — no React source survives.

**GPL constraint:** Because the source is licensed GPL, no code may be incorporated into the `world-model` canonical layer or the final app directly. Only *concept extractions* (data shapes, structural vocabulary, domain terms) are permitted. The GPL license does not restrict documentation of algorithms or data structures; it restricts code copying.

The `docs/` subfolder inside `gpl_source/` contains detailed reverse-engineering documentation produced specifically for this purpose.

## Generation Pipeline (Algorithm Summary)

Seeded, deterministic 6-stage pipeline:

| Stage | What It Does |
|---|---|
| `buildPatches()` | Voronoi partitioning; assigns center, plaza, citadel, inner/outer patches |
| `optimizeJunctions()` | Merges short edges to reduce geometry noise |
| `buildWalls()` | CurtainWall + towers, gates, citadel wall |
| `buildStreets()` | Arterials and plaza roads from gate/center paths |
| `createWards()` | Assigns ward type to each city block |
| `buildGeometry()` | Final per-ward geometry (buildings, alleys, insets) |

State: `{ seed: number, size: 'small' | 'medium' | 'large' }` — all other structure is derived.

## Canonical Concept Candidates

These are the domain structures that could be extracted and canonicalized. All are candidate — none are promoted.

### 1. City Layout Structure

| Concept | Shape | Canonical Target Proposal |
|---|---|---|
| `Patch` | a city block: polygon + ward reference + `withinCity`, `withinWalls` flags | `CityLayoutAttachment.patches` |
| `Ward` | a typed block within a city: type, geometry, label | `CityLayoutAttachment.wards` |
| `Gate` | a named entry point in the city wall | `CityLayoutAttachment.gates` |
| `Tower` | a defensive wall tower | part of wall geometry |
| `Castle` (citadel ward) | fortified center ward | `CityLayoutAttachment.citadel` |

### 2. Ward Types

The generator defines these ward types (district classifications):

| Ward Type | Description |
|---|---|
| `CommonWard` | generic residential/mixed use |
| `CraftsmenWard` | small-to-large artisan plots |
| `MerchantWard` | medium/large commercial; prefers plaza proximity |
| `AdministrationWard` | large, regular; prefers plaza adjacency |
| `PatriciateWard` | large, sparse, affluent; prefers Park adjacency |
| `Slum` | small, chaotic, dense; prefers periphery |
| `GateWard` | surrounds gates; small-medium |
| `MilitaryWard` | requires citadel or wall border |
| `Market` | special commercial district |
| `Park` | open green space |
| `Cathedral` | religious district |
| `Castle` | citadel complex |
| `Sea` | water boundary (coastal cities) |

This is a candidate for a `WardType` enum in `CityLayoutAttachment`. It extends the `urban` biome type from Mappa Imperium by providing intra-city district structure.

### 3. Generation Parameters

| Concept | Shape | Canonical Target |
|---|---|---|
| Seed | `number` | `CityGenerationParams.seed` |
| Size | `'small' \| 'medium' \| 'large'` | `CityGenerationParams.size` |
| plazaNeeded | `boolean` | `CityGenerationParams.plazaNeeded` |
| citadelNeeded | `boolean` | `CityGenerationParams.citadelNeeded` |
| wallsNeeded | `boolean` | `CityGenerationParams.wallsNeeded` |

This parallels Mappa Imperium's `WorldSettings` pattern (seed + algorithm + params).

### 4. Road / Street Network

| Concept | Description |
|---|---|
| Arterial road | main road between gates and center |
| Plaza road | road bordering the plaza |
| Regular street | standard inner road |
| Alley | small back passage |

**Street widths** are typed constants (`MAIN_STREET`, `REGULAR_STREET`, `ALLEY`) and used as inset distances for city block geometry.

## Provisional Concept-to-Canonical Mapping

| Watabou Concept | Provisional Canonical Target | Status |
|---|---|---|
| `Patch` (city block) | `CityLayoutAttachment.patches` | candidate |
| `Ward` + ward type | `CityLayoutAttachment.wards` + `WardType` enum | candidate |
| `Gate` | `CityLayoutAttachment.gates` | candidate |
| Generation params (seed, size, flags) | `CityGenerationParams` attachment on `WorldRecord` | candidate |
| Street type constants | part of `CityLayoutAttachment` geometry spec | candidate |

All candidates require a world-model change + new promoted-schema contracts.

## What Is Extracted

For a future adapter, suggested approach:

| Material | What to Copy |
|---|---|
| `gpl_source/docs/` | the reverse-engineering documentation (algorithm + data structure analysis) |
| `gpl_source/Source/com/watabou/towngenerator/building/` | type/interface analysis (concept extraction only) |
| `gpl_source/Source/com/watabou/towngenerator/wards/` | ward type enumeration and structure |
| `gpl_source/Source/com/watabou/geom/` | geometric primitive vocabulary |

**Do not copy:** any `.hx` source files directly into the app codebase. Concept extraction only.

## What Is Not Extracted

| Excluded Material | Reason |
|---|---|
| All `.hx` source files (except as reference) | GPL license — no code copy |
| `react-app/dist/` | compiled artifact, no source |
| `Assets/` | bitmap assets (font only) |
| Rendering / view code | donor-specific UI layer; not canonical |

## UI Characterization Methodology

**Designed intent authoring.** There is no TypeScript/React source to run. Phase 7 characterization:

1. Consult the `gpl_source/docs/` reverse-engineering documentation
2. Consult the original donor app online (Watabou's fantasy city generator) for behavioral reference
3. Design the canonical city-layout surface authoritatively, using ward types and generation parameters as the structural vocabulary
4. All Phase 7 requirements carry `basis: designed`

Pre-registered waivers:
- **WC-W01**: Source is GPL and cannot be run as an integrated part of the app. Behavioral capture is not applicable. Mitigation: use the live online version of the generator for behavioral reference only; all canonical decisions are designed intent.
- **WC-W02**: No React source survives in `react-app/`. Mitigation: city-layout surface design must start from scratch using the algorithm documentation as domain reference.

## Relation to Other Donors

- **Mythforge** `LocationAttachment` has `city/settlement` as a spatial type — Watabou City extends this with internal district structure (`CityLayoutAttachment`).
- **Mappa Imperium** `BiomeType.urban` — the urban biome from Mappa Imperium maps to the city as a whole; Watabou City provides the internal topology *within* an urban biome hex.
- **Dungeon Generator** — if source is recovered, dungeon topology would be an analogous spatial attachment for underground enclosed spaces, parallel to `CityLayoutAttachment` for the surface.

## Registration Steps Required

1. Confirm GPL allows concept extraction (it does — GPL restricts code copying, not documentation of data structures)
2. Create `adapters/watabou-city/manifest.yaml` with `source_kind: haxe_reference` and appropriate included paths
3. Copy selected algorithm documentation into `adapters/watabou-city/source-snapshot/`
4. Design `CityLayoutAttachment` and `WardType` contracts
5. Promote contracts into `contracts/promoted-schema/watabou-city/`

## Open Questions

- Should `CityLayoutAttachment` be a canonical record type, or should it always be a sub-structure within `LocationAttachment` when `location_type = city`?
- Does the six ward-type classification map meaningfully to Mythforge entity types (e.g., `AdministrationWard` → organization entities)?
- Is the Voronoi-patch structure part of the canonical model, or is it a generation-time artifact that should not be stored?
- Are there newer versions of the Watabou city generator source with more structural detail than what is in `gpl_source/`?
- What is the `2nd/` folder in `watabou-city-clean-room/`? Does it contain a second iteration?
