
# Spec: Living Planet Orchestrator (Phase 20)

## 1. Objective
Unify discrete geological and atmospheric subsystems into a single, cohesive **Generation Pipeline** (for initial state) and **Simulation Loop** (for runtime evolution). This transforms "Orbis" from a terrain viewer into a living planetary engine.

## 2. The Living Planet Architecture

The system is divided into four vertical strata of authority.

| Layer | System | Responsibility | Inputs | Outputs |
| :--- | :--- | :--- | :--- | :--- |
| **L0** | **Cosmic** | Orbital mechanics, stellar input | Seed, Preset | Solar Constant, Gravity, Rotation |
| **L1** | **Geosphere** | Tectonics, Volcanism, Magnetism | L0, Time | Elevation, Heat Map, Mineralization |
| **L2** | **Hydrosphere** | Circulation, Precipitation, Erosion | L1, L0 | Moisture, Rivers, Sediment, Coastlines |
| **L3** | **Biosphere** | Biomes, Flora, Civilizations | L1, L2 | Surface Materials, Settlements, Resources |

---

## 3. The Generation Pipeline (Init)

This pipeline runs *once* (or upon heavy regeneration) to build the base `HexData` authority.

### Step 1: Cosmic Setup
*   **Action**: Initialize `PlanetConfig`.
*   **Derive**: `SolarInsolation` maps (Latitudinal heat gradient), `Coriolis` strength (Rotation).

### Step 2: Tectonic Genesis
*   **Inputs**: `plateCount`, `activityLevel`.
*   **Process**:
    1.  Seed Plates (Voronoi/Floodfill).
    2.  Assign Drift Vectors.
    3.  Resolve Boundaries (Convergent/Divergent/Transform).
    4.  **Output**: `ElevationBase`, `Roughness`, `VolcanicActivity`.

### Step 3: Hydrologic Etching
*   **Inputs**: `seaLevel`, `moistureOffset`.
*   **Process**:
    1.  **Global Circulation**: Generate prevailing winds based on Rotation.
    2.  **Moisture Transport**: Advect moisture from oceans to land (Orographic lift).
    3.  **River Routing**: Calculate Flux and Erosion (Stream Power Law).
    4.  **Output**: `RiverGraph`, `LakeBasins`, `ErosionMap`, `SedimentDeposits`.

### Step 4: Biome Resolution
*   **Inputs**: `temperature`, `moisture`, `elevation`, `lithology`.
*   **Process**:
    1.  Classify Whittaker Biomes.
    2.  Apply Stratum adjustments (Underdark/Sky).
    3.  **Output**: `BiomeId`, `FloraDensity`.

---

## 4. The Simulation Loop (Runtime)

The planet is not static. It breathes. We define three "Heartbeats" running at different rates.

### 4.1 The Fast Tick (Visual/Atmospheric)
*   **Frequency**: Every Frame / 100ms.
*   **Systems**:
    *   **Cloud Drift**: Advect cloud particles via L2 Wind Vectors.
    *   **Day/Night Cycle**: Update shader uniforms for sun position.
    *   **Magnetosphere**: Flicker Aurora intensity based on solar wind buffer.

### 4.2 The Medium Tick (Civilization/Ecology)
*   **Frequency**: 1s - 5s.
*   **Systems**:
    *   **Settlement Growth**: Update `HabitabilityScore`. If `Food > Threshold`, expand Settlement tier.
    *   **Resource Extraction**: Active mines deplete local `Resource` values.
    *   **Seasonal Pulse**: Oscillate `effectiveTemperature` and `snowLine` based on Orbital Angle.

### 4.3 The Slow Tick (Geologic)
*   **Frequency**: On Demand / "Epoch" Button.
*   **Systems**:
    *   **Erosion Step**: Apply `dtYears` of river incision.
    *   **Coastal Evolution**: Process sediment accumulation at Deltas.
    *   **Tectonic Creep**: Minor stress accumulation at boundaries (Earthquakes).

---

## 5. Data Contracts

### 5.1 The Planet State Object
```typescript
interface PlanetState {
  meta: {
    age: number; // Geological years
    seed: number;
    archetype: PlanetArchetypeId;
  };
  physics: {
    gravity: number;
    radius: number;
    hydrosphereCoverage: number; // 0..1 target
  };
  hexes: HexData[]; // The authoritative grid
  // Global Field buffers for GPU/Compute
  fields: {
    elevation: Float32Array;
    moisture: Float32Array;
    temperature: Float32Array;
    plates: Uint8Array;
  };
}
```

## 6. Determinism & Serialization
*   **Rule**: The Simulation Loop must be deterministic.
*   **Implementation**: All "Ticks" utilize a `Prando` or `SFC32` RNG instance seeded by `WorldSeed + TickCount`.
*   **Saving**: We save the `Generation Config` + `Delta Log`. We do *not* save the full history of ticks, only the current authoritative state if it diverges significantly from the seed.

## 7. Verification Plan
*   [ ] **TC-20-01**: Pipeline produces water in depressions (Hydrology success).
*   [ ] **TC-20-02**: Rain shadows appear behind mountain ranges (Atmosphere success).
*   [ ] **TC-20-03**: Fast Tick updates clouds without lagging main thread.
