# Globe Renderer Integration Analysis: A Magical Society Guide to Mapping

**Source Reference**: `docs/guide_to_mapping/00 - Complete Guide to Mapping.md`
**Target Specification**: `docs/specs/042-pre-runtime-globe-generation.md`

This document provides a comprehensive extraction of world-building concepts from the "Magical Society Guide to Mapping" and proposes specific implementations for the Globe Renderer.

---

## 1. Axial Tilt & Seasonal Dynamics (Step One)

### Guide Concepts
- **Axial Tilt**: Earth's tilt is 23.5°. This defines:
    - **Tropic Circles**: At `±tilt` from equator (23.5°N/S). Sun is directly overhead at least once a year.
    - **Arctic Circles**: At `90° - tilt` from pole (66.5°N/S). At least one 24-hour day/night per year.
- **Seasons**: Caused by the hemisphere tilting toward/away from the sun during orbit.
    - Winter: Tilted away -> shorter days, less direct sunlight, colder.
    - Summer: Tilted toward -> longer days, more direct sunlight, warmer.
- **Deviant Tilts**:
    - **0° Tilt**: No seasons. Equator is always hot, poles always cold. Static climate bands.
    - **90° Tilt**: Extreme seasons. Half the planet in perpetual day, half in night. Equator becomes best for glaciers.
    - **~54° Tilt**: Even heat distribution across the planet surface.
- **Snowmelt & Deserts**: Smaller tilt -> less snowmelt -> wider deserts. Larger tilt -> less snow accumulation -> also potential for wider deserts.

### Implementation Proposal
```typescript
interface AxialTiltConfig {
    tiltDegrees: number; // Default 23.5
}

function calculateClimateBands(tilt: number): ClimateBandLatitudes {
    return {
        tropicNorth: tilt,
        tropicSouth: -tilt,
        arcticNorth: 90 - tilt,
        arcticSouth: -(90 - tilt)
    };
}

function calculateSeasonalIntensity(latitude: number, tilt: number, dayOfYear: number): SeasonData {
    // Returns hours of daylight and solar intensity factor for that location
}
```

---

## 2. Plate Tectonics & Mountain Formation (Steps Two & Three)

### Guide Concepts
- **Proto-Continent (Pangaea)**: Fit current continents together like a puzzle to find ancient collision points.
- **Collision Types**:
    1.  **Oceanic + Continental (Subduction)**:
        - Continental plate rides over oceanic plate.
        - Creates: Coastal mountain range (on continental side), deep ocean trench (offshore), volcanic arc (inland from trench).
        - **Effect**: Shallow AND deep earthquakes, volcanoes.
    2.  **Oceanic + Oceanic**:
        - Either plate can subduct.
        - Creates: Deep oceanic trench, **volcanic island arc** (curved due to sphere).
        - **Effect**: Many small volcanic islands, earthquakes.
    3.  **Continental + Continental (Suturing)**:
        - Neither plate easily subducts.
        - Creates: **Massive inland mountain ranges** (Himalayas, Alps).
        - **Effect**: Shallow earthquakes, NO volcanoes.
- **Divergent Boundaries (Rifts)**:
    - Plates pull apart.
    - Creates: **Rift valley** (on land) or **Mid-ocean ridge** (in ocean). Volcanic activity at the rift.
- **Slip Faults (Transform)**:
    - Plates slide past each other.
    - Creates: **Earthquakes** (e.g., San Andreas Fault). No mountains, no volcanoes.
- **Mountain Types**:
    - **Subduction Mountains**: Rocky, tall, active (growing). ~25-50% of all mountains.
    - **Suture Mountains**: Massive, potentially the tallest.
    - **Volcanic (Dome) Mountains**: Rounded tops, shorter (Black Hills).
    - **Older Mountains**: Rounded, lower, heavily eroded (Appalachians).

### Implementation Proposal
```typescript
enum PlateType { CONTINENTAL, OCEANIC }
enum BoundaryType { CONVERGENT, DIVERGENT, TRANSFORM }

interface TectonicPlate {
    id: string;
    type: PlateType;
    vertices: CellID[]; // Cells belonging to this plate
    velocityVector: Vec2; // Direction and speed of movement
}

interface PlateBoundary {
    plate1: TectonicPlate;
    plate2: TectonicPlate;
    boundaryType: BoundaryType;
    cells: CellID[]; // Cells along this boundary
}

function resolveBoundaryEffects(boundary: PlateBoundary): GeologicalFeatures {
    if (boundary.boundaryType === BoundaryType.CONVERGENT) {
        if (boundary.plate1.type === PlateType.OCEANIC && boundary.plate2.type === PlateType.CONTINENTAL) {
            return { mountainRange: true, trench: true, volcanoArc: true };
        } else if (boundary.plate1.type === PlateType.OCEANIC && boundary.plate2.type === PlateType.OCEANIC) {
            return { islandArc: true, trench: true }; // Volcanic island chain
        } else { // Continental + Continental
            return { massiveMountainRange: true, noVolcanoes: true };
        }
    } else if (boundary.boundaryType === BoundaryType.DIVERGENT) {
        return { riftValley: true, midOceanRidge: true, volcanicActivity: true };
    } else { // TRANSFORM
        return { earthquakeZone: true };
    }
}
```

---

## 3. Islands & Archipelagoes (Step Four)

### Guide Concepts
- **Sea Level Variation Islands**: Part of continental shelf, revealed/submerged by sea level change (e.g., UK, land bridge to France during Ice Age).
- **Rift Islands**: Chunks calved off a continent that drifted away (Madagascar, Greenland, India before it hit Asia). Oldest islands are farthest from parent.
- **Volcanic Islands (Subduction)**:
    - Form **curved island arcs** at oceanic-oceanic or extended continental-oceanic subduction zones.
    - Examples: Japan, Philippines, Aleutians, Caribbean, New Zealand, Indonesia.
    - **Key Insight**: Curvature due to spherical planet geometry.
- **Volcanic Islands (Hot Spots)**:
    - Stationary magma plume under a moving plate.
    - Creates **linear island chains** (Hawaii).
    - Oldest island is farthest from hot spot, youngest is largest and closest.
    - Most (75%) hot spots are oceanic.
- **Archipelago Worlds**: Require magic or special conditions (very young planet, or localized known world in a sea of subduction zones).

### Implementation Proposal
```typescript
interface HotSpot {
    position: LatLong; // Fixed position in planet frame
    magmaStrength: number;
}

function generateHotSpotIslandChain(hotSpot: HotSpot, plateVelocity: Vec2, ageMa: number): Island[] {
    // Trace a line from hotSpot in -plateVelocity direction
    // Generate islands with decreasing size/height as distance increases
}

function generateIslandArc(boundary: PlateBoundary): Island[] {
    // Generate a curved chain of volcanic islands along a subduction zone
    // Curvature derived from great circle math on sphere
}
```

---

## 4. Weather & Atmospheric Circulation (Step Five)

### Guide Concepts
- **Driving Force**: Sun heats equator more than poles. Atmosphere tries to equalize heat.
- **Coriolis Effect**: Planet's rotation deflects air currents.
    - North Hemisphere: Clockwise gyres.
    - South Hemisphere: Counter-clockwise gyres.
- **Global Wind Cells (Hadley Cells)**:
    - **Trade Winds (0°-30°)**: Blow from East (towards West). Hot air rises at equator, flows poleward at altitude, descends at ~30°.
    - **Westerlies (30°-60°)**: Blow from West (towards East).
    - **Easterlies (60°-90°)**: Blow from East (towards West). Polar highs push cold air toward equator.
    - **Intertropical Convergence Zone (ITCZ)**: Low pressure band at equator where trade winds meet.
    - **Subtropical Highs (~30°)**: High pressure bands (descending dry air) -> prone to deserts.
    - **Subpolar Lows (~60°)**: Low pressure bands (ascending air) -> wet.
- **Ocean Currents**:
    - Follow similar gyre patterns as wind.
    - **Warm Currents**: Flow from low latitudes to high latitudes (e.g., Gulf Stream).
    - **Cold Currents**: Flow from high latitudes to low latitudes.
    - Cold currents cool coastal air, reducing moisture capacity, potentially reducing coastal rainfall.
- **Land vs Water Heat Capacity**:
    - Water absorbs/releases heat slowly (moderating temperature). Coastal climates are milder.
    - Land absorbs/releases heat quickly. Continental interiors have extreme temperature swings.
    - Hemisphere with more water has less temperature variance.
- **Mountains & Rain Shadows**:
    - Air forced up mountains cools and releases moisture (rain on windward side).
    - Air descending leeward side is dry -> **Rain Shadow (desert)**.
    - Example: Hawaii - 150 inches/year on windward side, 9 inches/year on leeward side.
    - Large mountain ranges can create vast deserts (Gobi, Sahara).

### Implementation Proposal
```typescript
interface GlobalCirculationConfig {
    rotationDirection: 'PROGRADE' | 'RETROGRADE';
    rotationPeriodHours: number;
}

function generatePrevailingWinds(latitude: number, config: GlobalCirculationConfig): Vec2 {
    const band = getWindBand(latitude); // 0-30, 30-60, 60-90
    const baseDirection = band === 'TRADES' || band === 'EASTERLIES' ? WEST : EAST;
    // Apply Coriolis deflection based on hemisphere
    return deflect(baseDirection, latitude, config);
}

function calculateMoisture(cell: Cell, windVector: Vec2, heightmap: Heightmap): number {
    // Trace wind path backward from cell
    // Accumulate moisture from ocean cells crossed
    // Subtract moisture for each mountain crossed (rain shadow)
    let moisture = 0;
    let currentPos = cell.position;
    for (let i = 0; i < MAX_TRACE_STEPS; i++) {
        currentPos = move(currentPos, -windVector);
        const height = heightmap.get(currentPos);
        if (isOcean(height)) {
            moisture += OCEAN_EVAPORATION_RATE;
        } else if (isMountain(height)) {
            moisture -= OROGRAPHIC_RAIN_LOSS; // Rain shadow
        }
    }
    return moisture;
}
```

---

## 5. Climate Zones (Step Six)

### Guide Concepts
- **Latitudinal Zones (Simplified)**:
    - **Polar (90°-Arctic Circle)**: Very cold, low precipitation.
    - **Wet (Around 60°)**: Subpolar lows bring rain.
    - **Transition Dry-to-Wet**: Between wet and desert zones.
    - **Desert (~30° / Tropics)**: Subtropical highs, descending dry air.
    - **Transition Wet-to-Dry**: Between equator and desert zones.
    - **Very Wet (Equator)**: ITCZ, rising moist air, heavy rain. Rainforests.
- **Modifiers**:
    - **Mountains**: Create rain shadows, extend deserts beyond their latitudinal zone.
    - **Ocean Currents**: Warm currents make coasts warmer/wetter. Cold currents can cool and dry coasts.
    - **Altitude**: High plateaus (Tibet) have colder climates than their latitude suggests.
    - **Continentality**: Interior of large continents is dry (moisture drops out before reaching center).
- **Rivers**:
    - Flow downhill.
    - Originate in wet/mountainous areas.
    - Are the cradles of civilization.
    - A river through a desert (Nile) can have headwaters in wet highlands with seasonal floods.

### Implementation Proposal
```typescript
enum ClimateZone {
    POLAR, WET_COLD, TRANSITION_COLD, DESERT, TRANSITION_WARM, VERY_WET
}

function assignClimateZone(cell: Cell, moisture: number, temperature: number): ClimateZone {
    // Use Whittaker diagram (Temperature x Moisture) -> Biome
}

function generateRivers(heightmap: Heightmap, moisture: MoistureMap): RiverNetwork {
    // Standard hydraulic erosion / flow accumulation
    // Rivers originate in cells with high moisture and flow to lowest adjacent cell
}
```

---

## 6. Intelligent Species Origins & Movement (Steps Seven, Eight, Nine)

### Guide Concepts
- **Ancestor Races**: Create proto-races that later diverge into distinct species.
- **Origin Points**: Near major rivers or within 50 miles of the coast. Low altitudes preferred.
- **Primary Expansion**:
    - Along rivers (water is life).
    - East/West is easier than North/South (consistent climate, food sources).
- **Secondary Expansion**: As rivers fill, jump to adjacent rivers or move North/South (slower, harder).
- **Tertiary Expansion (Sea)**: When crowded, attempt risky ocean voyages. Follow currents and winds.
- **Speciation/Divergence**: Isolation in different environments leads to new races. Races adapted to mountains, forests, deserts, etc.
- **Conflict**: Encountering another race leads to war. Barriers (deserts, mountains) slow expansion.
- **Coastlines**: Up to 70% of population lives within 50 miles of coast.

### Implementation Proposal (For future Civilization layer, not immediate Globe Renderer)
```typescript
interface AncestorRace {
    id: string;
    originCell: CellID;
    preferredTerrain: BiomeType[];
}

function simulateMigration(race: AncestorRace, world: WorldState, years: number): Territory {
    // Priority: Rivers > Coast > East/West > North/South
    // Blocked by: Deserts, Mountains, Other races
}
```

---

## Summary Table: Mapping Guide Feature -> Globe Renderer Component

| Mapping Guide Feature          | Globe Renderer Component / System         | Priority |
|:-------------------------------|:------------------------------------------|:---------|
| Axial Tilt & Seasons           | `GenesisConfig.axialTilt`, `ClimateEngine`| High     |
| Plate Tectonics (Collision)    | `TectonicEngine`, `MountainGenerator`    | High     |
| Subduction Volcanic Arcs       | `IslandArcGenerator`                      | Medium   |
| Hot Spot Island Chains         | `HotSpotSystem`                           | Medium   |
| Coriolis Wind Cells            | `GlobalCirculation.prevailingWinds`       | High     |
| Ocean Gyres (Warm/Cold Currents)| `OceanCurrentGenerator`                   | Medium   |
| Rain Shadows                   | `MoistureAdvection.orographicLoss`        | High     |
| Continental Heat/Water Heat    | `TemperatureCalculator.continentality`    | Medium   |
| Latitudinal Climate Bands      | `ClimateZoneResolver`                     | High     |
| Rivers (Hydraulic Erosion)     | `RiverGenerator`                          | High     |
| Species Migration (East/West)  | Future `CivilizationSimulator`            | Low      |
