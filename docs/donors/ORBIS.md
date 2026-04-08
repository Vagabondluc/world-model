# Orbis — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Orbis |
| Class | **semantic-only** |
| Adapter ID | `orbis` |
| Manifest | `adapters/orbis/manifest.yaml` |
| Source Root | `adapters/orbis/source-snapshot/` (6 TypeScript files only) |
| Source Origin | `external/claurst/mechanical-sycophant/src/` |
| Source Kind | `typescript` |
| Canonical Lane | simulation |
| Phase 7 Methodology | designed intent authoring |
| Adapter Status | **registered** |

## What It Is

Orbis is a simulation donor. The source material is a small slice of a world-simulation application (`mechanical-sycophant`), from which only 6 TypeScript files were promoted into the adapter snapshot. There is no surviving runnable UI from this donor — only the type contracts and a weather/map store survive.

Orbis provides the simulation depth layer: a world can carry a `SimulationAttachment` that describes which simulation domains are active, at what fidelity, and what snapshot or event payload shapes those domains produce.

Orbis does not define the root world shape (that is Mythforge's lane). It attaches to an existing `WorldRecord` or `EntityRecord` with simulation metadata.

**Source origin note:** The Orbis donor source lives inside `mechanical-sycophant/` (the workspace folder for Orbis-related exploration), not inside `external/claurst/` directly. The manifest registers it as `local://mechanical-sycophant`. The `Orbis Spec 2.0/` folder in `to be merged/` is a placeholder (empty `Orbis 1.0/` subfolder only) and does not add new material.

## What Is Extracted

| Included File | Reason |
|---|---|
| `types/session.ts` | world session shape and simulation context |
| `stores/weatherStore.ts` | weather simulation state (domain: weather) |
| `stores/mapStore.ts` | map/geography simulation state (domain: geography) |
| `stores/mapLocationStore.ts` | location-level simulation state |
| `contracts/forms/social_event.schema.ts` | social event simulation contract |
| `contracts/forms/social_event.types.ts` | social event type definitions |

## What Is Not Extracted

| Excluded Path | Reason |
|---|---|
| `components/` | donor UI (standalone simulation dashboards, harness chrome) |
| `__tests__/`, `test/`, `tests/` | donor test suite |
| `app/` | donor application shell |

The surviving source is type-contract material only. There is no interactive donor UI to characterize.

## Canonical Lane — Simulation

| Canonical Record | Description |
|---|---|
| `SimulationAttachment` | attached to WorldRecord or EntityRecord; describes active simulation domains and fidelity |
| Simulation event payloads | per-domain event shapes (weather events, map events, social events) |
| Simulation snapshot payloads | per-domain snapshot shapes (current simulation state point-in-time) |
| Domain-profile contracts | metadata describing how a simulation domain is configured |

### Promotion Class

`simulation` — concepts from this donor become optional attachments on canonical trunk records. Simulation functionality is always optional; an entity or world without a `SimulationAttachment` is fully valid.

## Concept Families

Registered in concept-family-registry:

- `simulation-profile` — domain activation, fidelity levels, simulation metadata
- `simulation-snapshot` — point-in-time state capture for a simulation domain
- `simulation-domain` — the enumeration of domain types (weather, geography, social events, etc.)
- `simulation-event` — per-domain event payload shapes that extend EventEnvelope

## UI Characterization Methodology

**Designed intent authoring.** No runnable donor UI survives. Phase 7 characterization for Orbis:

1. Work only from the 6 files in the adapter snapshot and the promoted schema contracts
2. Author a specification of what the simulation surface *should* behave like, grounded in what the contracts describe
3. Every requirement must carry `basis: designed` in the Phase 7 conformance matrix

Pre-registered waivers for this donor:
- **Orbis-W01**: Simulation dashboard behavior cannot be behaviorally captured (no runnable donor app). All simulation surface requirements are authored as designed intent. Mitigation: anchor all designed requirements to existing contract types in the snapshot.
- **Orbis-W02**: No verified end-to-end simulation run available to validate snapshot payload shapes. Mitigation: round-trip serialization test against promoted JSON schema.

## Open Questions

- Are there additional Orbis simulation domains beyond weather, geography, and social events?
- Is `SimulationAttachment` intended as a top-level record or always embedded inside WorldRecord?
- Does `mapLocationStore.ts` imply a canonical location → simulation domain join that needs its own record type?
- Is the `Orbis Spec 2.0/` placeholder folder intended to receive new material in the future?
