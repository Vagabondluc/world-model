# SPEC-042: Pre-Runtime Globe Generation

**Epic:** Pre-Game Globe
**Status:** DRAFT
**Dependencies:** SPEC-036 (Smooth Globe Architecture)

## 1. Overview
The "Genesis Protocol" requires generating a massive, detailed planet. Doing this during gameplay would lag the system. This epic defines the **Pre-Runtime** architecture where the planet is generated, cached, and then partially hydrated for gameplay.

## 2. Core Components

### 2.1 The Genesis Wizard (`GenesisProtocol.tsx`)
A UI flow that runs **before** `GameLoop` starts.

1.  **Stellar Forge:** User selects star type, planet size, and age.
2.  **Advanced Noise Control (Perlin/Simplex):**
    - **Sliders:** Lacunarity, Persistence, Octaves, Scale.
    - **Layers:** Base Height, Mountain Ridges, Ocean Trenches.
    - **Preview:** Real-time heightmap visualization.
3.  **Climate Engine (Simulated):**
    - **Latitude Logic:** Equator is hot, poles are cold (configurable axial tilt).
    - **Wind & Rain:** Trade winds carry moisture; massive mountains create rain shadows using ray-casting.
    - **Seasonal Cycles:** Calculate average temp/rainfall for Summer/Winter.
4.  **Biome Resolution (Matrix):**
    - Use a **Whittaker diagram** (Temp vs. Moisture) to assign biomes.
    - **Extended Biomes:** Savanna, Taiga, Rainforest, Tundra, Chaparral, Badlands, Coral Reefs, etc.
    - **Rivers:** Hydraulic erosion flow accumulation to generate river networks from high to low.

### 2.2 The Globe Cache (`GlobeStore`)
A separate store (or IndexedDB table) from `GameStore`.

- **Data Structure:**
    - `vertices: Float32Array` (Millions of points)
    - `indices: Uint32Array`
    - `biomes: Uint8Array`
    - `heightmap: Float32Array`
- **Output:** A serialized "Planet File" (JSON/Binary).

### 2.3 Region Extraction
Gameplay happens on a "Region" (a subset of the globe).

- **Selection:** User picks a rectangular lat/long bound or a hexagonal cap.
- **Flattening:** The system projects the curve of the region onto the playable Hex Grid.
- **Data Transfer:** Only the selected hexes are copied into `GameStore.worldCache`.

## 3. The Visualization
Uses the **Smooth Spherical Globe** engine (SPEC-036) but in "God View" mode.

- **Controls:** Spin, Zoom, "Heatmap Views" (Temperature, Moisture).
- **Performance:** Rendering static meshes (no game unit updates) allows for much higher vertex counts.

## 4. Implementation Logic

```typescript
// Pseudo-code for Generator
function runGenesis(config: WorldConfig) {
    const mesh = generateIcosahedron(config.subdivisions);
    const deformed = applyTectonics(mesh, config.plates);
    const climate = simulateClimate(deformed);
    return climate;
}
```

## 5. Verification
- **Performance Test:** Generate a "Grand" world (100k hexes) in < 5 seconds.
- **Visual Test:** Poles should look natural (no pinching artifacts).
- **Extraction Test:** Selected region matches the visual representation on the globe.
