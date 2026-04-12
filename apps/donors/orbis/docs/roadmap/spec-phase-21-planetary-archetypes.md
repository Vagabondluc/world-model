
# Spec: Planetary Archetypes (Phase 21)

## 1. Objective
Define a configuration ontology to generate distinct classes of planets ("Archetypes") using the unified orchestrator. The engine must support more than just Earth-like worlds.

## 2. The Archetype Config Schema

Every planet generation is driven by a `PlanetConfig` object. Archetypes are simply presets of this config.

```typescript
interface PlanetConfig {
  // Cosmic
  scale: number;            // 1.0 = Earth Radius
  gravity: number;          // 1.0 = Earth Gravity
  rotationSpeed: number;    // Multiplier (affects Coriolis/Wind bands)
  axialTilt: number;        // Degrees (affects Seasons)

  // Geosphere
  tectonicActivity: number; // 0.0 (Dead) to 1.0 (Primordial)
  volcanism: number;        // Heat emission at boundaries
  plateCount: number;       // Complexity of crust

  // Hydrosphere
  seaLevel: number;         // -1.0 to 1.0 (0.0 = Earth Datum)
  globalTemperature: number;// Offset in Celsius
  moistureAvailability: number; // 0.0 (Arid) to 1.0 (Wet)
  erosionRate: number;      // Multiplier for river incision

  // Biosphere
  lifeThreshold: number;    // Habitability score required for life
  vegetationColor: string;  // Hex override for chlorophyll (e.g., Purple/Red)
}
```

---

## 3. Standard Archetypes

### 3.1 Terra (The Default)
*   **Description**: A Goldilocks world capable of supporting diverse carbon-based life.
*   **Config**:
    *   `seaLevel`: 0.0 (approx 70% ocean)
    *   `globalTemperature`: 14°C
    *   `tectonicActivity`: 0.5 (Active plates)
    *   `erosionRate`: 1.0
    *   `moistureAvailability`: 0.6

### 3.2 Arid / Dune World
*   **Description**: A desert planet where water is scarce, trapped in polar caps or deep aquifers. Erosion is primarily Aeolian (Wind).
*   **Config**:
    *   `seaLevel`: -0.6 (Dried seabeds become salt flats)
    *   `moistureAvailability`: 0.1
    *   `erosionRate`: 0.2 (Rivers are rare/flash floods)
    *   `globalTemperature`: 25°C (Hotter)
    *   **Special Rules**:
        *   Biomes shift: `Forest` -> `Scrub`, `Grassland` -> `Dune`.
        *   Civilization clusters tightly around Oases (rare water sources).

### 3.3 Thalassic / Ocean World
*   **Description**: A world covered almost entirely by water. Land exists only as volcanic archipelagos or coral atolls.
*   **Config**:
    *   `seaLevel`: 0.4 (95% ocean)
    *   `plateCount`: 20 (Many small plates = many small islands)
    *   `volcanism`: 0.8 (Island building)
    *   `erosionRate`: 2.0 (High wave action)
    *   **Special Rules**:
        *   Civilizations are `Floating` or `Seabed`.
        *   Atmosphere is hyper-saturated (Constant storms).

### 3.4 Cryo / Iceball
*   **Description**: A world in a snowball state. Oceans are frozen surfaces. Life exists in sub-surface vents.
*   **Config**:
    *   `globalTemperature`: -40°C
    *   `seaLevel`: -0.2 (Water locked in ice)
    *   `moistureAvailability`: 0.2 (Cold air holds less water)
    *   **Special Rules**:
        *   Ocean Surface material -> `ICE`.
        *   Habitability focuses on `Volcanic` hotspots (Geothermal).

### 3.5 Primordial / Volcanic
*   **Description**: A young, violent world. The crust is thin, and the mantle is exposed.
*   **Config**:
    *   `tectonicActivity`: 1.0
    *   `volcanism`: 1.0
    *   `globalTemperature`: 45°C
    *   `atmosphereDensity`: 2.0 (Thick, greenhouse)
    *   **Special Rules**:
        *   Rivers are `Lava` (Visual override).
        *   Clouds are `Ash` (Dark grey/black).

---

## 4. UI Implementation (Phase 21)

### 4.1 The Architect Dashboard
A new UI panel replacing the generic "Settings".
*   **Archetype Selector**: Dropdown to apply presets.
*   **Planetary Dials**:
    *   "Wetness" (Moisture)
    *   "Temperature" (Thermostat)
    *   "Age" (Erosion iterations)
    *   "Violence" (Tectonics)

### 4.2 Voxel Material Overrides
The `VoxelMaterial` palette must adapt to the archetype.
*   **Primordial**: `WATER` renders as `LAVA`. `GRASS` renders as `OBSIDIAN`.
*   **Cryo**: `WATER` renders as `ICE`. `SAND` renders as `SNOW`.
*   **Alien**: `LEAVES` render as `PURPLE_VEGETATION`.

## 5. Verification
*   [ ] **TC-21-01**: Switching to "Arid" removes 90% of water hexes.
*   [ ] **TC-21-02**: "Primordial" generates lava rivers (visual check).
*   [ ] **TC-21-03**: Customizing dials after selecting a preset respects the new values.
