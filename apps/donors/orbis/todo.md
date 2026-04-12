
# Orbis 2.0 Migration & Architecture Roadmap

This document outlines the active transition from Orbis 1.0 logic to the Orbis 2.0 deterministic engine, incorporating strict type safety, fixed-point math, and robust state management.

## Progress Overview
- [x] **Phase 1: Core Foundation** (Math, Types, RNG)
- [x] **Phase 2: Simulation Clock** (Scheduler, Time)
- [x] **Phase 3: Planetary Solvers** (Physics, Climate, Bio)
- [x] **Phase 4: Terrain & Hydrology** (Realization, Erosion)
- [x] **Phase 5: Semantic System** (Tags, Queries)
- [x] **Phase 6: Civilization** (Needs, Regimes, Tech)
- [x] **Phase 7: Visualization** (Dashboard, Orchestration)
- [x] **Phase 8: State Hardening** (Zod Schemas, Zustand Stores)
- [x] **Phase 9: High-Resolution Tactical View** (Grid, Pathing, Sprites)
- [x] **Phase 10: Narrative Engine Expansion** (Active)

---

## Phase 1: Core Foundation (The Fixed-Point Root)
**Goal:** Establish deterministic math and RNG primitives.
- [x] **1.1 Primitive Types** (`core/types.ts`)
- [x] **1.2 Fixed-Point Math Engine** (`core/math.ts`)
- [x] **1.3 Deterministic RNG** (`core/rng.ts`)
- [x] **1.4 Unit Tests** (`update/tdd/numerical-stability.tdd.md`)

## Phase 2: Simulation Clock & Scheduler
**Goal:** Implement multi-domain time management.
- [x] **2.1 Clock Data Structures** (`core/time/types.ts`)
- [x] **2.2 The Scheduler Loop** (`core/time/Scheduler.ts`)
- [x] **2.3 Registry & Defaults** (`core/time/Constants.ts`)

## Phase 3: Planetary Solvers (Physics Layer)
**Goal:** Port physics logic to 2.0 architecture.
- [x] **3.1 Magnetosphere** (`sim/physics/Magnetosphere.ts`)
- [x] **3.2 Climate (EBM)** (`sim/climate/EnergyBalanceModel.ts`)
- [x] **3.3 Carbon Cycle** (`sim/climate/CarbonCycle.ts`)
- [x] **3.4 Biosphere Capacity** (`sim/biosphere/BiosphereCapacity.ts`)

## Phase 4: Terrain & Hydrology (Realization Layer)
**Goal:** Update map generation and flow logic.
- [x] **4.1 Hydrology Solver** (`sim/hydrology/ABCDHydrology.ts`)
- [x] **4.2 Erosion Engine** (`sim/geology/GeologyEngine.ts`)
- [x] **4.3 Field Projection** (`core/fields/Projection.ts`)

## Phase 5: Tag & Semantic System
**Goal:** Implement spatial tagging and queries.
- [x] **5.1 Tag Registry** (`core/tags.ts`)
- [x] **5.2 Semantic Resolver** (`services/semanticResolver.ts`)
- [x] **5.3 Spatial Index** (`services/spatialQuery.ts`)

## Phase 6: History & Civilization
**Goal:** Implement deterministic social engines.
- [x] **6.1 Need Engine** (`sim/history/NeedEngine.ts`)
- [x] **6.2 Regime Manager** (`sim/civilization/RegimeManager.ts`)
- [x] **6.3 Tech & Factions** (`sim/civilization/TechTree.ts`, `sim/civilization/FactionSystem.ts`)

## Phase 7: UI & Visualization
**Goal:** Connect the simulation to the frontend.
- [x] **7.1 Dashboard Integration** (`components/dashboard/SimulationDashboard.tsx`)
- [x] **7.2 Sim Orchestrator** (`sim/SimSystem.ts`)

## Phase 8: Data Validation & State Hardening
**Goal:** Enforce strict type safety and schema validation for all simulation state, and migrate staged artifacts to core.
- [x] **8.1 Zod Schemas** (`core/schemas/*.ts`)
- [x] **8.2 Zustand Stores** (`stores/*.ts`)
- [x] **8.3 Integration**
- [x] **8.4 Source Migration**

## Phase 9: High-Resolution Tactical View
**Goal:** Implement 5ft grid projection and tactical gameplay logic.
- [x] **9.1 Tactical Types** (`core/tactical/types.ts`)
- [x] **9.2 Tactical Projector** (`services/tactical/TacticalProjector.ts`)
- [x] **9.3 Store Integration** (`stores/useLocalStore.ts`)
- [x] **9.4 Visualizer Update** (`components/VoxelVisualizer.tsx`)
- [x] **9.5 Pathfinding** (`services/tactical/pathfinding.ts`)
- [x] **9.6 Sprites & Grid** (`components/tactical/*.tsx`)

## Phase 10: Narrative Engine Expansion (Active)
**Goal:** Deepen the narrative simulation with myth production and cultural memory.
- [x] **10.1 Schema Definitions** (`core/schemas/narrative.ts`)
- [x] **10.2 Myth Engine** (`sim/narrative/MythEngine.ts`)
- [x] **10.3 Narrative UI** (`components/dashboard/SimulationDashboard.tsx`)
- [x] **10.4 Chronicle Persistence** (`sim/narrative/NarrativeEngine.ts`, `sim/narrative/MythEngine.ts`, `services/SnapshotService.ts`)

---
**Next Steps:**
1. **Phase 11: Advanced Civilization** (Active).
