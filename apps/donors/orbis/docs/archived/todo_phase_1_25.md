
# Orbis 1.0 to 2.0 Gradual Update Plan (Phases 1-25)

**Status:** ARCHIVED
**Completion Date:** 2026-02-12
**Next Phase:** See `update/todo.md` for Phases 26+

This document outlines the completed transition from the voxel-centric Orbis 1.0 to the deep-time planetary simulation framework of Orbis 2.0.

## Progress Tracking
- [done] Phase 1: Core Foundation (The Fixed-Point Root)
- [done] Phase 2: Simulation Clock & Scheduler
- [done] Phase 3: Planetary Solvers (Physics Layer)
- [done] Phase 4: Terrain & Hydrology (Realization Layer)
- [done] Phase 5: Tag & Semantic System
- [done] Phase 6: History & Civilization (Social Layer)
- [done] Phase 7: UI & Visualization
- [done] Phase 8: Life & Evolution (Biologic Layer)
- [done] Phase 9: Population & Migration (Ecological Dynamics)
- [done] Phase 10: Speciation & Bestiary (Procedural Biology)
- [done] Phase 11: Advanced Civilization (Tech & Factions)
- [done] Phase 12: Narrative & Events (The Chronicler)
- [done] Phase 13: Persistence & Project Management
- [done] Phase 14: Atmospheric Fronts & Dynamics
- [done] Phase 15: Magnetosphere & Dynamo
- [done] Phase 16: Semantic Overlays & Spatial Filesystem
- [done] Phase 17: Tactical Realization (D&D 5-ft Grid)
- [done] Phase 19: Orbital Mechanics & Seasons
- [done] Phase 20: Living Planet Orchestrator
- [done] Phase 21: Planetary Archetypes
- [done] Phase 22: Temporal System Gating
- [done] Phase 23: UI Hardening & Flat Projection
- [done] Phase 24: Procedural Entities & Settlements
- [done] Phase 25: Multi-Axial World Generation (Gemini)

---

## Phase 1: Core Foundation (The Fixed-Point Root)
**Goal:** Establish deterministic math and RNG primitives before migrating any logic.

- [x] **1.1 Primitive Types**
- [x] **1.2 Fixed-Point Math Engine**
- [x] **1.3 Deterministic RNG**

---

## Phase 2: Simulation Clock & Scheduler
**Goal:** Replace the monolithic `useTimeStore` with a multi-domain scheduler.

- [x] **2.1 Clock Data Structures**
- [x] **2.2 The Scheduler Loop**
- [x] **2.3 Registry & Defaults**

---

## Phase 3: Planetary Solvers (Physics Layer)
**Goal:** Port physics logic to use the new `core/math` and `core/time`.

- [x] **3.1 Magnetosphere (v2)**
- [x] **3.2 Climate (EBM)**
- [x] **3.3 Carbon Cycle**
- [x] **3.4 Biosphere Capacity**

---

## Phase 4: Terrain & Hydrology (Realization Layer)
**Goal:** Update the map generation to use the new simulation outputs.

- [x] **4.1 Hydrology Refactor**
- [x] **4.2 Deterministic Realizer**
- [x] **4.3 Seamless Region Projection** (Inverse-mapping refactor)

---

## Phase 5: Tag & Semantic System
**Goal:** Implement the "Spatial Filesystem" for region-based overrides.

- [x] **5.1 Tag Registry**
- [x] **5.2 Semantic Update**
- [x] **5.3 Spatial Query Index**

---

## Phase 6: History & Civilization
**Goal:** Implement the deterministic decision engine.

- [x] **6.1 Need Engine**
- [x] **6.2 Regime State Machine**

---

## Phase 7: UI & Visualization
**Goal:** Build the Situation Room dashboard and high-precision tactical viewer.

- [x] **7.1 Situation Room Dashboard**
- [x] **7.2 System Integration**
- [x] **7.3 Interpreted Signal Feed** (SimTracer)
- [x] **7.4 Voxel Collision & Precision Selection** (Raycast refactor)

---

## Phase 8: Life & Evolution
**Goal:** Implement the biological simulation layer (trunks, gates, energy).

- [x] **8.1 Species & Genome Types**
- [x] **8.2 Life Engine (Gates & Trunks)**
- [x] **8.3 Trophic System (Energy Flow)**

---

## Phase 9: Population & Migration
**Goal:** Implement dynamic population flows, refugia logic, and predator-prey stability.
**Spec References:** `docs/update/specs/51-refugia-colonization-solver-contract.md`, `docs/update/specs/52-population-dynamics-predator-prey-stability.md`

- [x] **9.1 Refugia Solver**
  - Implement `RefugiaDomain` to identify safe harbors during climate crises.
  - Implement colonization spread logic.
- [x] **9.2 Population Dynamics**
  - Implement `PopDynamicsGlobals` and density updates.
  - Implement Lotka-Volterra stability clamps (predator/prey limits).
- [x] **9.3 Dispersal System**
  - Connect `Refugia` output to `Species` distribution maps.

---

## Phase 10: Speciation & Bestiary
**Goal:** Generate concrete species from generic trunks using adaptive radiation.
**Spec References:** `docs/update/specs/15-adaptive-radiation.md`, `docs/update/specs/17-bestiary.md`, `docs/update/specs/08-species-template-procedural-biology.md`

- [x] **10.1 Adaptive Radiation Engine**
  - Implement `NicheGap` detection.
  - Implement `Branching` logic (speciation events).
- [x] **10.2 Bestiary Generator**
  - Implement `SpeciesTemplate` to concrete `BestiaryEntry` conversion.
  - Generate procedural names and descriptions based on traits.
- [x] **10.3 Fossil Record**
  - Track extinct species in the `FossilLayer`.

---

## Phase 11: Advanced Civilization
**Goal:** Deepen the social simulation with technology, factions, and pressure propagation.
**Spec References:** `docs/update/specs/79-tech-impact-matrix-contract.md`, `docs/update/specs/80-impact-propagation-engine.md`, `docs/update/specs/83-faction-interest-group-generator.md`

- [x] **11.1 Tech Impact Matrix**
  - Implement `TechTree` and impact emission (Economy, Military, Environment).
- [x] **11.2 Pressure Propagation Engine**
  - Implement deterministic pressure flows (e.g., Tech -> Inequality -> Unrest).
- [x] **11.3 Faction Generator**
  - Generate factions based on `Ideology` and `Pressure` vectors.
  - Implement faction demands and radicalization loops.

---

## Phase 12: Narrative & Events
**Goal:** The "Dungeon Master" layer that interprets simulation data into history.
**Spec References:** `docs/update/specs/60-event-schema-reason-code-registry.md`, `docs/update/specs/86-information-narrative-engine.md`

- [x] **12.1 Event Schema Registry**
  - Standardize all simulation events (Extinction, War, Discovery).
- [x] **12.2 Narrative Engine**
  - Implement `InformationSource` and `NarrativePayload`.
  - Model "Objective Truth" vs "Perceived Truth" (Fog of War/History).
- [x] **12.3 Chronicle System**
  - Create a queryable history timeline for the UI.

---

## Phase 13-24: Scale, Persistence, and Hardening (Completed)
**Status:** COMPLETED
- [x] **Phase 13: Persistence & Project Management** (IndexedDB, Delta Saves)
- [x] **Phase 14: Atmospheric Fronts** (Air Mass Dynamics)
- [x] **Phase 15: Magnetosphere & Dynamo** (Aurora, Shielding)
- [x] **Phase 16: Semantic Overlays** (Region Declaration, Resolver)
- [x] **Phase 17: Tactical Realization** (5-ft Grid, Sprites, Pathfinding)
- [x] **Phase 19: Orbital Mechanics** (Axial Tilt, Seasons, Day/Night)
- [x] **Phase 20: Living Planet Orchestrator** (Simulation Loop, Ticks)
- [x] **Phase 21: Planetary Archetypes** (Presets: Arid, Ocean, Lava)
- [x] **Phase 22: Temporal System Gating** (System throttling by time scale)
- [x] **Phase 23: UI Hardening & Flat Projection** (Help, Tooltips, Flat Projection)
- [x] **Phase 24: Procedural Entities & Settlements** (UUID Hashing, Town Layouts, Linguistics)

---

## Phase 25: Multi-Axial World Generation (Gemini)
**Goal:** Implement the "Strata" and "Plane" axes to support complex fantasy cosmologies.
**Spec References:** `docs/gemini/01-framework-and-axes.md`, `docs/gemini/02-taxonomy-and-generation-model.md`

- [x] **25.1 Strata System**
  - Implement vertical domains: `Aero` (Sky), `Terra` (Surface), `Litho` (Underdark), `Abyssal` (Deep).
  - Update `VoxelGenerator` to support stratum-specific material tables.
- [x] **25.2 Plane System**
  - Implement `PlaneId`: `Material`, `Feywild`, `Shadowfell`.
  - Implement `PlaneTransform` overrides for biomes (e.g., Forest -> Crystal Grove in Feywild).
- [x] **25.3 Biome Matrix Expansion**
  - Refactor `BiomeType` to be a result of `Function(Climate, Stratum, Plane)`.
