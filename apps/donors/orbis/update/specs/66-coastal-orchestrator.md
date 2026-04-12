# 🔒 COASTAL ORCHESTRATOR v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Long-Term Coastal Evolution • Beach Formation • Delta Dynamics)

---

## 0️⃣ Purpose

Define the long-term coastal feature evolution orchestration system for:

* Beach formation and migration
* Delta and estuary development
* Coastal erosion and deposition
* Sea level change impacts

**Core Goals:**

* Simulate coastal evolution over geological timescales
* Maintain determinism and physical plausibility
* Integrate with hydrology and erosion systems
* Support multi-axial coastal variants (stratum/plane)

---

## 1️⃣ Core Units

| Quantity | Unit | Description |
|-----------|--------|-------------|
| **Distance** | Meters | Arc length on sphere |
| **Elevation** | Meters | Relative to sea level datum |
| **Time** | Simulation Years | For coastal evolution |
| **Sediment** | Abstract Volume Units | `Meters^3` of sediment |

---

## 2️⃣ Coastal State

### 2.1 Coastal Cell Authority

```typescript
interface CoastalCellAuthority {
  // Base authority
  hexId: string;
  elevationM: number;
  biome: BiomeId;
  stratum: StratumId;
  plane: PlaneId;
  
  // Coastal-specific fields
  isCoastal: boolean;
  coastalType: CoastalType;
  beachWidth: number;           // Meters
  deltaProgradation: number;     // Meters per 1000 years
  erosionRate: number;           // Meters per 1000 years
  sedimentBudget: number;        // Abstract volume units
}
```

### 2.2 Coastal Types

```typescript
enum CoastalType {
  // Beach types
  SANDY_BEACH,
  ROCKY_BEACH,
  CLIFF_COAST,
  MANGROVE_COAST,
  
  // Delta types
  RIVER_DELTA,
  ESTUARY,
  TIDAL_FLAT,
  
  // Special
  BARRIER_ISLAND,
  FJORD,
  RIA
}
```

---

## 3️⃣ Coastal Evolution Kernels

### 3.1 Kernel 1: Beach Formation

**Goal:** Determine beach type and width based on wave energy and sediment supply.

**Algorithm:**

```typescript
function determineBeach(
  cell: CoastalCellAuthority,
  waveEnergy: number,
  sedimentSupply: number
): BeachFormation {
  
  // Calculate wave energy from fetch and wind
  const energy = calculateWaveEnergy(cell, waveEnergy);
  
  // Determine beach type
  let beachType: BeachType;
  let beachWidth: number;
  
  if (sedimentSupply > HIGH_THRESHOLD && energy < MODERATE_THRESHOLD) {
    beachType = BeachType.SANDY_BEACH;
    beachWidth = calculateSandyBeachWidth(sedimentSupply, energy);
  } else if (sedimentSupply < LOW_THRESHOLD && energy > HIGH_THRESHOLD) {
    beachType = BeachType.ROCKY_BEACH;
    beachWidth = calculateRockyBeachWidth(energy);
  } else if (energy > VERY_HIGH_THRESHOLD) {
    beachType = BeachType.CLIFF_COAST;
    beachWidth = 0;  // Cliffs have no beach
  } else if (cell.stratum === StratumId.Terra &&
             cell.plane === PlaneId.Material &&
             cell.biome === BiomeId.TropicalForest) {
    beachType = BeachType.MANGROVE_COAST;
    beachWidth = calculateMangroveWidth(sedimentSupply);
  }
  
  return {
    type: beachType,
    width: beachWidth,
    migrationRate: calculateBeachMigration(energy, sedimentSupply)
  };
}
```

**Beach Width Calculations:**
```typescript
function calculateSandyBeachWidth(
  sedimentSupply: number,
  energy: number
): number {
  
  // Wider beaches with high sediment, low energy
  const baseWidth = 50;  // meters
  
  const sedimentFactor = Math.min(sedimentSupply / 1000, 2.0);
  const energyFactor = Math.max(1.0 - energy / 100, 0.5);
  
  return baseWidth * sedimentFactor * energyFactor;
}

function calculateRockyBeachWidth(
  energy: number
): number {
  
  // Narrower rocky beaches with high energy
  const baseWidth = 10;  // meters
  
  const energyFactor = Math.max(1.0 - energy / 200, 0.2);
  
  return baseWidth * energyFactor;
}
```

### 3.2 Kernel 2: Delta Progradation

**Goal:** Simulate river delta growth and estuary formation.

**Algorithm:**

```typescript
function evolveDelta(
  cell: CoastalCellAuthority,
  riverDischarge: number,
  sedimentLoad: number,
  seaLevelTrend: number
): DeltaEvolution {
  
  // Calculate progradation rate (delta growth)
  const progradationRate = calculateProgradation(
    riverDischarge,
    sedimentLoad,
    seaLevelTrend
  );
  
  // Determine delta type
  let deltaType: DeltaType;
  
  if (seaLevelTrend > 0) {
    // Rising sea level - transgressive delta
    deltaType = DeltaType.TRANSGRESSIVE;
  } else if (seaLevelTrend < 0) {
    // Falling sea level - regressive delta
    deltaType = DeltaType.REGRESSIVE;
  } else {
    // Stable sea level - prograding delta
    deltaType = DeltaType.PROGRADING;
  }
  
  // Calculate estuary formation
  const estuaryType = determineEstuaryType(
    riverDischarge,
    cell.tideRange
  );
  
  return {
    progradationRate,           // Meters per 1000 years
    deltaType,
    estuaryType,
    sedimentDeposition: calculateSedimentDeposition(
      sedimentLoad,
      progradationRate
    )
  };
}
```

**Estuary Types:**
```typescript
enum EstuaryType {
  SALT_WEDGE,      // River-dominated, salt wedge intrusion
  TIDAL_MIXED,     // Strong tidal mixing
  WAVE_DOMINATED,   // Wave energy dominates
  FJORD,            // Glacial overdeepening
  RIA                // Drowned river valley
}
```

### 3.3 Kernel 3: Coastal Erosion

**Goal:** Calculate coastal erosion rates based on wave energy and geology.

**Algorithm:**

```typescript
function calculateCoastalErosion(
  cell: CoastalCellAuthority,
  waveEnergy: number,
  seaLevelTrend: number
): CoastalErosion {
  
  // Base erosion rate
  let erosionRate: number;
  
  // Cliff erosion (high energy, hard rock)
  if (cell.coastalType === CoastalType.CLIFF_COAST) {
    erosionRate = calculateCliffErosion(waveEnergy, cell.rockType);
  }
  // Beach erosion (moderate energy, soft sediment)
  else if (cell.beachType === BeachType.SANDY_BEACH) {
    erosionRate = calculateBeachErosion(waveEnergy, seaLevelTrend);
  }
  // Mangrove protection (low erosion)
  else if (cell.coastalType === CoastalType.MANGROVE_COAST) {
    erosionRate = calculateMangroveErosion(waveEnergy);
  }
  
  return {
    erosionRate,              // Meters per 1000 years
    erosionMechanism: determineMechanism(cell, waveEnergy),
    protectionFactor: calculateProtectionFactor(cell)
  };
}
```

**Cliff Erosion:**
```typescript
function calculateCliffErosion(
  waveEnergy: number,
  rockType: RockType
): number {
  
  // Base cliff erosion rate
  const baseRate = 0.5;  // meters per 1000 years
  
  // Rock resistance factor
  const resistanceFactor = getRockResistance(rockType);
  
  // Energy factor
  const energyFactor = Math.min(waveEnergy / 50, 2.0);
  
  return baseRate * energyFactor / resistanceFactor;
}
```

### 3.4 Kernel 4: Sea Level Change Impact

**Goal:** Model coastal response to sea level changes.

**Algorithm:**

```typescript
function applySeaLevelChange(
  cell: CoastalCellAuthority,
  seaLevelChange: number,  // Meters
  timeStep: number            // Years
): CoastalResponse {
  
  // Calculate inundation
  const newElevation = cell.elevationM - seaLevelChange;
  const inundationDepth = Math.max(seaLevelChange - cell.elevationM, 0);
  
  // Determine response
  let response: CoastalResponseType;
  
  if (inundationDepth > 0) {
    // Coastal inundation
    response = CoastalResponseType.INUNDATION;
    
    // Update coastal type
    if (inundationDepth > 5) {
      cell.coastalType = CoastalType.TIDAL_FLAT;
    } else if (inundationDepth > 2) {
      cell.coastalType = CoastalType.ESTUARY;
    }
  } else if (seaLevelChange < 0) {
    // Sea level fall - emergence
    response = CoastalResponseType.EMERGENCE;
    
    // Beach progradation
    cell.beachWidth += calculateBeachProgradation(seaLevelChange);
  } else {
    // Stable sea level
    response = CoastalResponseType.STABLE;
  }
  
  return {
    response,
    newElevation,
    inundationDepth,
    coastalChange: calculateCoastalChange(cell, response)
  };
}
```

---

## 4️⃣ Multi-Axial Coastal Variants

### 4.1 Stratum Coastal Types

| Stratum | Coastal Characteristics | Beach Type | Delta Type |
|---------|----------------------|------------|------------|
| **Aero** | Sky islands, cloud coasts | Cloud beaches | Precipitation deltas |
| **Terra** | Standard terrestrial | Sandy/Rocky/Cliff | River deltas, estuaries |
| **Litho** | Underground coastal features | Cave beaches | Subterranean drainage |
| **Abyssal** | Deep earth coasts | Magma beaches | Thermal vents |

### 4.2 Plane Coastal Types

| Plane | Coastal Characteristics | Erosion Rate | Sediment Behavior |
|-------|----------------------|---------------|-------------------|
| **Material** | Realistic physics | Standard rates | Normal deposition |
| **Feywild** | Vitality-enhanced coasts | Reduced erosion | Magical sediment, crystal beaches |
| **Shadowfell** | Entropy-accelerated coasts | Increased erosion | Corrupted sediment, ash beaches |

---

## 5️⃣ Integration with Existing Specs

### 5.1 Hydrology Integration

**Input:** [`docs/64-depression-filling-flow-routing.md`](docs/64-depression-filling-flow-routing.md)

**Usage:**
```typescript
// Use river discharge for delta formation
const riverDischarge = getRiverDischarge(hexId);

const deltaEvolution = evolveDelta(
  coastalCell,
  riverDischarge,
  getSedimentLoad(hexId),
  getSeaLevelTrend()
);
```

### 5.2 Erosion & Sediment Integration

**Input:** [`docs/26-erosion-sediment.md`](docs/26-erosion-sediment.md)

**Usage:**
```typescript
// Use coastal erosion rates
const coastalErosion = calculateCoastalErosion(
  coastalCell,
  waveEnergy,
  seaLevelTrend
);

// Apply to sediment budget
coastalCell.sedimentBudget -= coastalErosion.erosionRate;
```

### 5.3 Biome System Integration

**Input:** [`docs/62-specialized-biomes.md`](docs/62-specialized-biomes.md)

**Usage:**
```typescript
// Specialized coastal biomes
if (coastalCell.coastalType === CoastalType.MANGROVE_COAST) {
  coastalCell.biome = SpecializedBiomeId.MANGROVE;
} else if (coastalCell.coastalType === CoastalType.SANDY_BEACH) {
  coastalCell.biome = SpecializedBiomeId.BEACH;
}
```

### 5.4 Multi-Axial Integration

**Input:** [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md)

**Usage:**
```typescript
// Apply stratum transforms to coastal features
const stratumTransform = getStratumTransform(coastalCell.stratum);
const planeTransform = getPlaneTransform(coastalCell.plane);

// Modify coastal evolution
const modifiedEvolution = applyMultiAxialTransforms(
  coastalEvolution,
  stratumTransform,
  planeTransform
);
```

---

## 6️⃣ Data Contracts

### 6.1 Coastal State

```typescript
interface CoastalState {
  // Per-cell coastal data
  coastalType: CoastalType[];
  beachWidth: Float32Array;
  deltaProgradation: Float32Array;
  erosionRate: Float32Array;
  sedimentBudget: Float64Array;
  
  // Derived flags
  isCoastal: Uint8Array;
  isInundated: Uint8Array;
}
```

### 6.2 Coastal Configuration

```typescript
interface CoastalConfig {
  // Wave parameters
  waveEnergyBase: number;         // Base wave energy
  fetchDistance: number;           // Meters
  
  // Sediment parameters
  sedimentSupplyRate: number;      // Volume per year
  sedimentCapacity: number;         // Max sediment budget
  
  // Sea level parameters
  seaLevelChangeRate: number;     // Meters per 1000 years
  seaLevelVariability: number;     // Meters standard deviation
  
  // Tidal parameters
  tideRange: number;              // Meters
  tidePeriod: number;              // Hours
}
```

---

## 7️⃣ Determinism Requirements

### 7.1 Deterministic Evolution

**Requirements:**
- Same inputs → identical coastal evolution
- No random number generation
- Stable across multiple runs

### 7.2 Deterministic Beach Formation

**Requirements:**
- Same wave energy + sediment → identical beach type
- Deterministic width calculation
- Stable beach migration rate

### 7.3 Deterministic Delta Evolution

**Requirements:**
- Same river discharge + sediment → identical progradation
- Deterministic estuary type
- Stable sediment deposition

---

## 8️⃣ Performance Considerations

### 8.1 Update Frequency

**Recommended:** Update coastal features every 1,000 simulation years

**Rationale:**
- Coastal evolution operates on geological timescales
- More frequent updates are wasteful
- Less frequent updates miss important transitions

### 8.2 Spatial Resolution

**Recommended:** Calculate coastal features at hex level (L5)

**Rationale:**
- Hex resolution (~5 km) is appropriate for coastal features
- Finer resolution is computationally expensive
- Coarser resolution misses important details

### 8.3 Caching

**Cache Coastal State:**
- Beach formation results
- Delta progradation rates
- Erosion calculations

**Invalidation:**
- Sea level change
- River discharge change
- Tectonic change affecting coast

---

## 9️⃣ API Contracts

### 9.1 Coastal Operations

```typescript
interface CoastalAPI {
  // Calculate beach formation
  calculateBeach(
    hexId: string,
    waveEnergy: number,
    sedimentSupply: number
  ): BeachFormation;
  
  // Evolve delta
  evolveDelta(
    hexId: string,
    riverDischarge: number,
    sedimentLoad: number
  ): DeltaEvolution;
  
  // Calculate coastal erosion
  calculateErosion(
    hexId: string,
    waveEnergy: number
  ): CoastalErosion;
  
  // Apply sea level change
  applySeaLevelChange(
    hexId: string,
    seaLevelChange: number,
    timeStep: number
  ): CoastalResponse;
  
  // Get coastal state
  getCoastalState(hexId: string): CoastalCellAuthority;
}
```

---

## 🔟 Acceptance Criteria

### 10.1 Must-Have

- [x] **AC-1301**: Beach formation is deterministic based on wave energy and sediment
- [x] **AC-1302**: Delta evolution uses river discharge and sediment load
- [x] **AC-1303**: Coastal erosion rates are calculated from wave energy
- [x] **AC-1304**: Sea level changes trigger coastal response
- [x] **AC-1305**: Multi-axial transforms apply to coastal features
- [x] **AC-1306**: Coastal features integrate with hydrology and erosion

### 10.2 Should-Have

- [ ] **AC-1311**: Beach migration rates vary by coastal type
- [ ] **AC-1312**: Delta progradation creates new land over time
- [ ] **AC-1313**: Estuary types vary by tidal range and river discharge
- [ ] **AC-1314**: Coastal erosion respects mangrove protection

### 10.3 Could-Have

- [ ] **AC-1321**: Barrier island formation and migration
- [ ] **AC-1322**: Fjord formation from glacial overdeepening
- [ ] **AC-1323**: Ria formation from drowned river valleys
- [ ] **AC-1324**: Coastal response to rapid sea level change events

---

## 1️⃣1️⃣ Cross-Doc Dependencies

- [`docs/64-depression-filling-flow-routing.md`](docs/64-depression-filling-flow-routing.md) - River discharge
- [`docs/26-erosion-sediment.md`](docs/26-erosion-sediment.md) - Sediment transport
- [`docs/62-specialized-biomes.md`](docs/62-specialized-biomes.md) - Coastal biome types
- [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md) - Stratum and plane transforms

---

## 1️⃣2️⃣ Version History

| Version | Date | Changes |
|---------|--------|---------|
| 1.0 | 2026-02-12 | Initial frozen spec - Coastal evolution orchestration |

---

**Document Version:** 1.0  
**Status:** 🔒 FROZEN  
**Generated:** 2026-02-12

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
