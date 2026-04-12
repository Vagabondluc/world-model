# Watabou City Generator — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Watabou City Generator |
| Internal ID | `watabou-city` (provisional) |
| Class | **clean-room app donor** |
| Adapter ID | none — not registered |
| Manifest | not yet created |
| Source Root | `to be merged/watabou-city-clean-room/2nd/` |
| Source Kind | React/Vite clean-room implementation |
| License | clean-room implementation; GPL reference tree is not the Phase 9 rehost source |
| Original Author | Watabou (Peter Dmitriev) |
| Canonical Lane | procedural-city-layout (candidate) |
| Phase 7/9 Methodology | clean-room app characterization and exact rehost parity |
| Adapter Status | **unregistered** |

## What It Is

The Watabou Medieval Fantasy City Generator lane now uses the clean-room implementation under `to be merged/watabou-city-clean-room/2nd/` as the Phase 9 UI source. The older GPL reference tree remains historical reference material, not the runtime or rehost source.

**Scope note:** This is a procedural-layout generator that could extend Adventure Generator's `LocationAttachment` with settlement/city topology, similar to how Orbis extends with biosphere simulation. Phase 9 may vendor the clean-room implementation; it must not vendor the GPL reference tree.

The application generates a top-down map of a medieval fantasy city from a seed and a city size. It uses Voronoi partitioning to divide the city into patches (city blocks), assigns ward types to each block, builds walls, gates, roads, and the citadel, and renders the result as a 2D vector graphic.

The `2nd/` folder contains the clean-room React/Vite implementation with source, tests, artifacts, and deterministic replay assets. The `gpl_source/` folder is retained only as reference documentation/source material and must not be copied into the Phase 9 rehost.

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

For the Phase 9 rehost, the clean-room implementation is the source that may be vendored into `world-model`:

| Material | What to Copy |
|---|---|
| `2nd/src/` | clean-room React/Vite app code and city-layout implementation |
| `2nd/docs/06-schemas/` | schema assets required by the clean-room runtime |
| `2nd/tests/propertyTestGenerator.ts` | deterministic/property-test support used by the clean-room implementation |
| `gpl_source/docs/` | historical algorithm notes only; useful for concept review, not runtime code |

**Do not copy:** any GPL `.hx` source files directly into the app codebase. The Phase 9 rehost source is the clean-room `2nd/` implementation.

## What Is Not Extracted

| Excluded Material | Reason |
|---|---|
| All `.hx` source files (except as reference) | GPL license — no code copy |
| `react-app/dist/` | compiled artifact, no source |
| GPL `Assets/` | GPL reference material; not the clean-room rehost source |
| Clean-room editor/session UI state | donor-local transient state; must not persist into canonical bundles |

## UI Characterization Methodology

**Clean-room app characterization.** Phase 7/9 characterization now uses the runnable clean-room implementation under `to be merged/watabou-city-clean-room/2nd/`:

1. Capture the clean-room route, DOM shape, accessibility tree, keyboard/focus behavior, and core controls.
2. Compare the vendored `world-model/apps/donors/watabou-city/` route against that clean-room baseline.
3. Treat GPL reference material as historical concept support only, not as runtime or rehost source.
4. Use `basis: clean-room-captured` for UI requirements and `basis: reference-note` only for non-runtime GPL concept notes.

Pre-registered waivers:
- **WC-W01**: GPL reference source is not the Phase 9 runtime source. Mitigation: vendor only the clean-room `2nd/` implementation.
- **WC-W02**: GPL `react-app/dist/` remains excluded because it is a compiled/reference artifact. Mitigation: use the clean-room React/Vite source for UI parity.

## Relation to Other Donors

- **Mythforge** `LocationAttachment` has `city/settlement` as a spatial type — Watabou City extends this with internal district structure (`CityLayoutAttachment`).
- **Mappa Imperium** `BiomeType.urban` — the urban biome from Mappa Imperium maps to the city as a whole; Watabou City provides the internal topology *within* an urban biome hex.
- **Dungeon Generator** — if source is recovered, dungeon topology would be an analogous spatial attachment for underground enclosed spaces, parallel to `CityLayoutAttachment` for the surface.

## Registration Steps Required

1. Register `adapters/watabou-city/manifest.yaml` against the clean-room source snapshot, not the GPL Haxe tree.
2. Add `CityLayoutAttachment` and `WardType` contracts for canonical folding.
3. Add projector/action-translator tests that mutate seed, size, generated layout, wards, roads, walls, and diagnostics.
4. Promote contracts into `contracts/promoted-schema/watabou-city/` once convergence is settled.
5. Keep GPL reference notes out of runtime vendoring and use them only for concept review.

## Open Questions

- Should `CityLayoutAttachment` be a canonical record type, or should it always be a sub-structure within `LocationAttachment` when `location_type = city`?
- Does the six ward-type classification map meaningfully to Mythforge entity types (e.g., `AdministrationWard` → organization entities)?
- Is the Voronoi-patch structure part of the canonical model, or is it a generation-time artifact that should not be stored?
- Which parts of the clean-room diagnostics/export surface should be canonical attachments versus donor-local UI state?
- What visual threshold should the Playwright nonblank city-render check use before promoting Watabou to `exact-vendored`?
