# World Engine Architecture
**A Layered Simulation for Procedural World Building**

## 1. System Overview
The **World Engine** is a standalone, pre-runtime simulation designed to generate deep, consistent, and narratively rich worlds. It operates independently of the game client, generating a "World State" that can be consumed by various renderers (Globe, 2D Map) or narrative engines.

### Architectural Philosophy
1.  **Simulation over Noise**: Terrain is not just Simplex noise; it is the result of tectonic and erosive *processes*.
2.  **Layered Dependency**: Biology depends on Climate, which depends on Geology. Lower layers must resolve before higher layers begin.
3.  **Standalone**: The engine runs as a service/worker, outputting a serialized `WorldState.json`.

---

## 2. Layer I: The Geosphere (The Bones)
*Rules derived from Mapping Guide Steps 1-6*

### 2.1 Tectonic Engine
Instead of heightmap noise, we simulate plate dynamics.
*   **Data Structures**: `Plate` (Vector, Type: Oceanic/Continental), `Boundary` (Convergent, Divergent, Transform).
*   **Process**:
    1.  **Voronoi Partitioning**: Divide sphere into 7-15 plates.
    2.  **Vector Assignment**: Assign random drift vectors to plates.
    3.  **Boundary Resolution**:
        *   *Subduction (Ocean/Cont)*: Raise mountain ridges (Andes), lower trenches. Create Volcanic Arcs (Japan).
        *   *Suturing (Cont/Cont)*: Massive uplift (Himalayas). No volcanoes.
        *   *Rifting*: Rift Valleys or Mid-Ocean Ridges.
    4.  **Hot Spots**: Stationary thermal plumes creating linear island chains (Hawaii) as plates move over them.

### 2.2 Climate Engine
Determines the "Energy" available at any given cell.
*   **Axial Tilt Logic**:
    *   Defines hard latitude bands (Tropics @ Tilt, Arctic @ 90-Tilt).
    *   Calculates seasonal variance data (Solar Insolation).
*   **Atmospheric Circulation**:
    *   Generates prevailing wind vectors based on Latitude + Coriolis Effect (Trades, Westerlies).
    *   **Hadley Cells**: Defines high/low pressure zones (Deserts @ 30°, Wet Bands @ 60°/0°).
*   **Hydro-Simulation**:
    *   **Oragraphic Lift**: Wind triggers rain when hitting elevation (Mountain).
    *   **Rain Shadows**: Leeward sides of mountains become deserts.
    *   **Hydraulics**: Rivers flow downhill, eroding terrain and accumulating flux.

---

## 3. Layer II: The Biosphere (The Flesh)
*Rules derived from Mapping Guide Step 6 & Appendix*

### 3.1 Biome Resolution
*   **Whittaker Classification**: Map (Temp + Moisture) -> Biome (e.g., Tundra, Savanna, Rainforest).
*   **Coastal Buffers**: Coastal cells get temperature moderation (lower variance).

### 3.2 Ecology & Food Webs
*   **Energy Flow**:
    *   `Biomass Potential`: Derived from Moisture + Sun.
    *   **Trophic Levels**:
        *   *Producers*: Plant life density.
        *   *Primary Consumers (Herbivores)*: Population cap based on plant density.
        *   *Secondary Consumers (Carnivores)*: Population cap based on herbivore density.
*   **Lethality Index**:
    *   Areas with high energy (Rainforests) support *larger* and *more dangerous* predators (Dragons, Hydras).
    *   Areas with scarcity (Deserts) support specialized, hardy monsters.

### 3.3 Resource Distribution
*   **Geological**: Metals/Gems placed by Tectonic events (e.g., Gold in mountain roots, Obsidian near volcanoes).
*   **Biological**: Rare herbs/beasts placed by Biome + Isolation factors.

---

## 4. Layer III: The Anthroposphere (The Mind)
*Rules derived from Mapping Guide Part III*

### 4.1 Ancestral Races
*   **Origin Generation**:
    *   Valid Origins: River deltas, Coastal estuaries, Fertile valleys.
    *   Never High Altitude or Deep Desert initially.
*   **Race Archetypes**:
    *   Define `AncestorRace` properties (e.g., "River Folk", "Mountain Dwellers").

### 4.2 Migration Simulation
A turn-based expansion cellular automats.
*   **Rules**:
    1.  **Water is Life**: Expansion follows rivers upstream/downstream first.
    2.  **Path of Least Resistance**: East/West expansion (similar climate) > North/South.
    3.  **Barriers**: Mountains and Deserts block early expansion.
    4.  **Conflict**: When two Expanding Fronts meet -> War/Assimilation boundary created.

### 4.3 Divergence & Speciation
*   If a sub-population is isolated (e.g., crosses a sea or mountain range) for $N$ eras, it diverges into a new definition (Sub-Race).

---

## 5. Integration Strategy

### 5.1 The "Side Engine"
The World Engine runs in parallel to the game client, focused on *Pre-Runtime Generation* or *Background Simulation*.

*   **Input**: `WorldSeed` (Guid, Noise Params, Axial Tilt).
*   **Output**: `GlobeData` (Heightmap, BiomeMap, RiverMap, CivMap).
*   **API**:
    *   `WorldEngine.generate(config)` -> Returns UUID of generated world.
    *   `WorldEngine.simulateEra(uuid)` -> Advances Civ/Ecology one step.

### 5.2 Narrative Hooks
*   The generated History (Migration paths, Ancient battlefields at collision points) provides hooks for the Narrative Engine/LLM to write descriptions ("The Bone Fields of Era 2").
