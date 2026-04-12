# Procedural Mapmaker: Technical Architecture

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

The Ensemble Mapmaker is a high-performance, local-first procedural world-building engine. It combines 2D Perlin Noise, hexagonal grid math, and Canvas-based rendering to create immersive, multi-layered game worlds.

## 1. Hexagonal Coordinate System

The system uses **Axial Coordinates** (`q, r`) to represent the hexagonal grid. This system simplifies hexagonal math compared to offset coordinates.

- **Storage**: Hexes are identified by a string key `"q,r"`.
- **Conversions**: 
    - `hexToPixel`: Converts axial coordinates to 2D Cartesian space (relative to map center).
    - `pixelToHex`: Uses a rounding algorithm to find the nearest hex for a given screen pixel.
- **Math**: Distance is calculated as the average of the absolute differences of the three cube coordinates (`q, r, s` where `s = -q-r`).

## 2. Procedural Generation Pipeline

The generation process follows a deterministic pipeline seeded by a user-provided string.

### A. Noise Generation
The engine uses a legacy 2D Perlin Noise implementation (shuffled permutation table) to generate continuous fields.
- **Elevation**: Combines a low-frequency primary octave (continents) with a high-frequency secondary octave (local roughness).
- **Moisture**: A separate noise field, offset by the `moistureOffset` setting, determines aridity.

### B. Biome Mapping
The `getBiome()` function maps the `elevation` and `moisture` values to a specific `BiomeType` based on the active **Theme**.

| Theme | Logic Highlights |
| :--- | :--- |
| **Surface** | Standard terrestrial logic (Arctic -> Tundra -> Forest -> Desert). |
| **Underdark** | Re-interprets elevation as rock density; moisture determines fungal growth. |
| **Feywild** | Extreme moisture values lead to "Planar" or "Jungle" biomes; high color saturation. |
| **Shadowfell** | Elevation usually leads to "Wasteland" or "Swamp"; low-intensity colors. |

### C. Region Clustering
1. **Region Seeds**: Random hexes are chosen as "centers" based on `numRegions`.
2. **Clustering**: All hexes are assigned to the nearest seed via Voronoi-like distance checks.
3. **Naming**: The dominant biome in a cluster determines the region's name (e.g., "The Verdant Weald").

## 3. Location Generation Architecture

The engine automatically populates the world with Points of Interest (POIs) using a weighted, biome-aware probability system.

### A. Classification by Biome
The `getLocationTypeForBiome(biome)` function determines what *kind* of structure makes sense for the terrain:

| Biome | Primary Types (Weighted) |
| :--- | :--- |
| **Civic (Grassland, Urban)** | High chance of **Settlement**; moderate **Battlemap**. |
| **Wild (Forest, Jungle)** | Balanced **Dungeon** and **Special Location**; low **Settlement**. |
| **Harsh (Mountain, Arctic)** | High chance of **Dungeon**; rare **Settlement**. |
| **Liquid (Ocean, Underwater)**| Mostly **Dungeon** (sunken) or **Special Location**. |

### B. Hierarchical Distribution
Locations are distributed at the **Region** level based on the **Civ Level** slider:
1. **Hierarchy**: Normally populated regions target:
    - **1 Capital**: The political and economic hub.
    - **2-3 Cities**: Major secondary hubs.
    - **3-5 Villages**: Small rural outposts.
2. **Stochasticity**: The `settlementDensity` setting scales these probabilities. A low setting results in isolated hamlets; a high setting creates dense imperial provinces.
3. **Collision Avoidance**: The algorithm ensures that only one location can occupy a specific hex coordinate.

### C. The Naming Engine (`namingEngine.ts`)
Names are generated using a **Multi-Stage Grammar** and **Markov Chains**:
- **Proper Names**: A Markov generator trained on fantasy datasets (Human, Elven, Dwarven, Infernal) creates unique, non-dictionary "Proper Names" (e.g., "Alaric", "Keyleth").
- **Table Columns**:
    - **Adjectives**: Theme-based (e.g., "Singing", "Bleak").
    - **Nouns**: Type-based (e.g., "Bastion", "Catacombs").
    - **Suffixes**: Dynamic attribution (e.g., "of the Abyss", "Hamlets").
- **Biome Awareness**: Specific modules handle unique terrain:
    - **Water**: Adds "Isle", "Atoll", or "Reef" for surface water POIs.
    - **Underwater**: Adds "Trench", "Grotto", or "Current" for submerged POIs.

## 4. Rendering Engine

To ensure smooth interaction (panning/zooming) with thousands of hexes, the engine uses a layered approach.

### B. Layer Caching (`LayerCache`)
Static biome layers are pre-rendered into **Offscreen Canvases**. 
- During a pan or zoom, the complex pattern-filling is skipped; the engine instead performs a simple `drawImage` call from the cache.
- Caches are invalidated only when the layer's data or the global zoom level changes.

### C. Biome Patterns (`biomePatterns.ts`)
Instead of flat colors, hexes are filled with reusable `CanvasPattern` objects.
- Each biome includes a procedural motif (e.g., small triangles for mountains, curved lines for waves).
- Palettes (Standard, Psychadelic, Necrotic) shift dynamically based on the Plane/Theme.

## 4. UI/UX Features

- **Fog of War**: A separate overlay layer that prevents the rendering of hexes/locations not in the `revealedHexes` set.
- **Interaction Modes**: The grid supports several tools:
    - **Inspect**: Click to view location/region details.
    - **Paint**: Drag to manually override biomes.
    - **Reveal**: Drag to uncover areas for players.
    - **Draft**: Temporary shapes for region planning.
