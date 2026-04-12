# Gemini Crosswalk to Core Voxel Spec

## Purpose
Map curated Gemini concepts into the core spec stack (`docs/01` to `docs/10`) so narrative worldbuilding and simulation architecture use one consistent model.

## Source Inputs
- `docs/gemini/01-framework-and-axes.md`
- `docs/gemini/02-taxonomy-and-generation-model.md`
- `docs/gemini/03-zones-and-strata-catalog.md`
- `docs/gemini/04-encounter-resource-hazard-patterns.md`
- `docs/gemini-2/01-system-overview.md`
- `docs/gemini-2/02-coordinate-and-plate-model.md`
- `docs/gemini-2/03-tectonics-heat-ecology.md`
- `docs/gemini-2/04-rendering-and-simulation-loop.md`

## LOD Mapping

| Gemini Concept | Core LOD | Authority | Notes |
|---|---|---|---|
| Climate zone (Whittaker baseline) | L0-L3 | Yes | Macro climate controls zone family |
| Plane/Spirit axis (Material/Fey/Shadow) | L2-L5 | Yes | Metaphysical law modifier on generation rules |
| Strata axis (Aero/Terra/Litho/Abyssal) | L3-L6 | Mixed | Authoritative layer tags at L3-L5, derived realization below |
| Plate drift + tectonic stress | L0-L4 | Yes | Geological authority source |
| Volcanic belts + heat fields | L2-L5 | Yes | Inputs to local map baking |
| Sub-hex refinement | L6 | Derived | Uses seam-safe rules in `docs/07-subhex-grid-spec.md` |
| Voxel terrain realization | L7 | Derived | Uses world-space resolver in `docs/03-hex-to-voxel-pipeline.md` |
| 5-ft tactical projection | L8 | Derived | Uses local sampled terrain |

## Data Contract Mapping

Gemini dimensions map into v1 contracts as:
- `zoneId` -> authority metadata on local hex (L5)
- `planeId` -> generation policy profile id
- `strataId` -> vertical domain selector
- tectonic stress/heat fields -> inputs for `ElevationDeltaMap`, `WaterMask`, `MaterialClassMap`

Contract targets:
- `docs/08-data-contracts.md` (`RefinedHexHeader`, `BakedMapBundleV1`, `LocalEditDelta`)
- `docs/06-baked-texture-spec.md` (canonical texture set)

## Bake Pipeline Crosswalk
1. L0-L4 compute climate, tectonics, and plate interaction fields.
2. L5 resolves `zoneId + planeId + strataId` for each authority hex.
3. L5 bake step writes semantic maps:
   - biome index from zone/plane rules
   - elevation delta from tectonic + local deformation
   - moisture/water from climate + hydrology + heat influence
   - material class from pressure/heat/substrate rules
4. L6-L8 consumers derive sub-hex, voxel, sprite, and tactical views.

## Hazard/Resource/Ecology Crosswalk

From Gemini encounter patterns:
- Hazards become rule outputs tied to baked fields and thresholds.
- Resources become pressure/heat/material-dependent spawn probabilities.
- Ecology becomes viability envelope (`dangerScore` vs sustainability) near tectonic activity.

Implementation location:
- Authority computation at L3-L5
- Visual/gameplay projection at L6-L8

## Determinism and Seams
Use existing guarantees:
- Edge-key seam contract from `docs/07-subhex-grid-spec.md`
- Determinism tests and epsilons from `docs/09-test-and-determinism-spec.md`
- World-space sampling from `docs/03-hex-to-voxel-pipeline.md`

Gemini rule packs must be pure functions of:
- authority fields
- world seed
- canonical edge constraints

## Edit Lifecycle Crosswalk
Narrative/world edits (ritual scars, corruption zones, engineered biomes):
- captured as `LocalEditDelta`
- default to `persistent_local`
- optionally promoted through `candidate_authority` -> `accepted_authority`

Policy source:
- `docs/10-edit-propagation-policy.md`

## Recommended Integration Backlog
1. Add `planeId` and `strataId` to L5 authority schema.
2. Define rule-pack registry: `material`, `feywild`, `shadowfell`.
3. Add tectonic field channels to local bake inputs.
4. Add hazard/resource/ecology derived layers for encounter generation.
5. Add cross-pack deterministic fixtures covering one zone across three planes.
