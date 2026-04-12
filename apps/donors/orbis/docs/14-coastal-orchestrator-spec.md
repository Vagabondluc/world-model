# Coastal Orchestrator Spec (v1)

## Purpose
Define long-term coastal evolution orchestration that couples sea-level, wave energy, river sediment supply, and climate-driven carving.

## Coastal Features
- `NONE`
- `BARRIER`
- `LAGOON`
- `INLET`
- `FJORD`

## Coastal Cell Classification
A cell is coastal when:
1. It is land-adjacent to ocean, or
2. It is shallow marine adjacent to emergent land.

## Orchestrator Inputs
- Hydrology fields (`receiver`, `accumulation`, sediment flux proxies)
- Climate fields (temperature/moisture seasonality)
- Sea-level trajectory
- Wave/storm energy proxy
- Tectonic uplift/subsidence proxy

## Orchestrator Pass Order
1. Update coastal regime classification
2. Apply marine erosion term
3. Apply coastal deposition term
4. Apply barrier/lagoon/inlet transitions
5. Apply fjord carving in cold steep valleys
6. Reconcile drainage/coastline consistency

## Invariants
1. Coastal transitions cannot violate drainage coherence.
2. Fjords require cold + steep + coastal valley conditions.
3. Barrier/inlet updates must preserve neighbor continuity.
4. No negative sediment after marine erosion removal.

## Outputs
- Updated `coastalFeature`
- Updated `sedimentM`
- Updated `elevationM`
- Coastal diagnostics for visualization/testing

## Cross-Doc Dependencies
- `docs/13-hydrology-erosion-sediment-spec.md`
- `docs/06-baked-texture-spec.md` (`WaterMask`, elevation delta)
- `docs/09-test-and-determinism-spec.md`
