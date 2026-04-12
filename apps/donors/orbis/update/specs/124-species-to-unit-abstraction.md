# 124 Species-to-Unit Abstraction Layer (Map Zoom Integration)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/107-cross-scale-information-contract.md`, `docs/brainstorm/108-multi-resolution-data-architecture.md`]
- `Owns`: [`SpeciesEntityMapping`, `zoom-level abstraction contract`, `entity-type mapping rules`]
- `Writes`: [`species->spatial entity abstraction outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/124-species-to-unit-abstraction.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define the deterministic abstraction layer that connects species to their spatial manifestations (units, settlements) as players zoom into the map, bridging the gap between biological species and civilizational entities.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Core Principle
As map zoom level increases, abstract species/population representations resolve into increasingly detailed spatial entities (from regional populations → settlements → individual units).

## Zoom Level Abstraction Contract

### Level 0: Continental (Overview)
- Shows: Species population density as heat maps
- Entities: Regional population clusters
- Detail: Aggregate population by biome/ecoregion
- Unit type: `PopulationCluster` (PPM density values)

### Level 1: Regional (Province-State)
- Shows: Major settlements and population centers
- Entities: Cities, large towns, major encampments
- Detail: Settlement types and approximate populations
- Unit type: `SettlementEntity` (city/town/village/nest types)

### Level 2: Local (County-District) 
- Shows: Individual settlements and nearby facilities
- Entities: Individual buildings, infrastructure, landmarks
- Detail: Settlement composition and nearby resources
- Unit type: `InfrastructureEntity` (buildings, roads, defenses)

### Level 3: Tactical (Village-Block)
- Shows: Individual creatures/units and their activities
- Entities: Individual species members, patrols, workers
- Detail: Unit behaviors, tasks, and interactions
- Unit type: `IndividualUnit` (specific creature/unit instances)

## Species-to-Entity Mapping Contract

### Species Entity Generation Rules
```ts
interface SpeciesEntityMapping {
  speciesId: SpeciesId
  entityTypeId: EntityTypeId
  populationThresholds: {
    minForSettlement: number    // min population to form settlement
    minForCity: number         // min population to upgrade to city
    minForUnit: number         // min population to generate individual units
  }
  habitatPreferences: HabitatTag[]
  settlementPatterns: SettlementPattern[]
  unitComposition: UnitCompositionRule[]
}

type EntityTypeId = 
  | "PopulationCluster"     // Level 0
  | "City"                 // Level 1
  | "Town"                 // Level 1
  | "Village"              // Level 1
  | "Nest"                 // Level 1 (non-humanoid)
  | "Colony"               // Level 1 (microscopic/swarm)
  | "Infrastructure"       // Level 2
  | "IndividualUnit"       // Level 3
  | "PatrolGroup"          // Level 3
  | "WorkGroup"            // Level 3
```

### Settlement Pattern Definitions
```ts
type SettlementPattern = 
  | "UrbanCenter"          // Centralized city
  | "ScatteredVillages"    // Distributed settlements
  | "Linear"              // Along rivers/roads
  | "Fortified"           // Defensive clusters
  | "NestComplex"         // Non-humanoid nesting
  | "ColonyStructure"     // Swarm/microbial patterns

interface UnitCompositionRule {
  unitType: string
  ratioPerThousand: number  // How many per 1000 population
  habitatRequirements: HabitatTag[]
  activityType: "Worker" | "Guard" | "Explorer" | "Breeder" | "Specialist"
}
```

## Deterministic Entity Placement

### Settlement Location Algorithm
```ts
function placeSettlements(
  species: SpeciesTemplate,
  biomeRegion: BiomeRegion,
  population: number
): SettlementEntity[] {
  // Use species habitat preferences to identify suitable locations
  const suitableCells = biomeRegion.cells.filter(cell => 
    matchesHabitatPreference(cell, species.habitatPrefs)
  );
  
  // Apply species-specific settlement patterns
  const settlementLocations = applySettlementPattern(
    suitableCells,
    species.settlementPattern,
    population
  );
  
  return settlementLocations.map(location => ({
    id: generateDeterministicId(species.id, location.cellId, "SETTLEMENT"),
    type: determineSettlementType(population, species),
    location: location,
    population: population,
    speciesId: species.id,
    habitatCompatibility: calculateHabitatFit(location, species.habitatPrefs)
  }));
}

function determineSettlementType(
  population: number, 
  species: SpeciesTemplate
): EntityTypeId {
  if (population >= 50000) return "City";
  if (population >= 5000) return "Town";
  if (population >= 500) return "Village";
  if (species.socialityPPM < 300000) return "Nest"; // Non-social species
  return "Colony"; // Default for other species types
}
```

### Individual Unit Generation
```ts
function generateUnits(
  settlement: SettlementEntity,
  species: SpeciesTemplate
): IndividualUnit[] {
  const unitCount = Math.floor(settlement.population / 1000); // Base ratio
  
  const units: IndividualUnit[] = [];
  for (let i = 0; i < unitCount; i++) {
    const unitType = selectUnitType(species.unitComposition);
    units.push({
      id: generateDeterministicId(settlement.id, i, "UNIT"),
      type: unitType,
      location: getRandomNearbyLocation(settlement.location),
      speciesId: species.id,
      activity: getRandomActivity(unitType),
      health: 1000000, // 1.0 in PPM
      age: getRandomAge(species.lifespanPPM)
    });
  }
  
  return units;
}
```

## Habitat-Based Entity Variants

### Terrestrial Species
- **Cities**: Urban centers with infrastructure
- **Towns**: Smaller settlements with basic services
- **Villages**: Rural communities
- **Units**: Individual creatures with tools/weapons

### Aquatic Species
- **Nests**: Underwater breeding colonies
- **Colonies**: Coral reef or kelp forest communities
- **Units**: Schools or pods of individuals

### Subsurface Species
- **Warrens**: Underground tunnel networks
- **Nests**: Deep cave complexes
- **Units**: Tunneling individuals

### Flying Species
- **Aeries**: Cliff or tall tree roosts
- **Nests**: Elevated communal dwellings
- **Units**: Flying individuals

## Lifecycle and Behavior Contracts

### Population-to-Settlement Transition
```ts
interface PopulationTransitionRule {
  triggerPopulation: number
  transitionTo: EntityTypeId
  constructionTimeTicks: number
  resourceRequirements: ResourceCost[]
}

const DEFAULT_TRANSITIONS: PopulationTransitionRule[] = [
  { triggerPopulation: 500, transitionTo: "Village", constructionTimeTicks: 100, resourceRequirements: [...] },
  { triggerPopulation: 5000, transitionTo: "Town", constructionTimeTicks: 500, resourceRequirements: [...] },
  { triggerPopulation: 50000, transitionTo: "City", constructionTimeTicks: 2000, resourceRequirements: [...] }
];
```

### Unit Behavior Patterns
```ts
type UnitActivity = 
  | "Foraging"           // Gathering resources
  | "Patrolling"         // Defense/security
  | "Constructing"       // Building/maintaining
  | "Resting"            // Recovery/idle
  | "Migrating"          // Moving to new location
  | "Breeding"           // Reproduction activities

interface UnitBehaviorRule {
  activityType: UnitActivity
  triggerConditions: Condition[]
  durationRange: [number, number] // min/max duration in ticks
  resourceConsumption: ResourceCost[]
  movementPattern: MovementPattern
}
```

## Integration with Existing Systems

### Connection to Species Template System
- Uses `SpeciesTemplate.habitatPrefs` for placement
- Applies `SpeciesTemplate.socialityPPM` for settlement patterns
- Respects `SpeciesTemplate.mobilityPPM` for unit movement

### Connection to Settlement Suitability
- Leverages `SettlementSuitability` scores for optimal placement
- Respects biome constraints from habitat preference matching
- Integrates with existing city candidate selection

### Connection to Civilization System
- Settlements become potential civilization centers
- Units can be recruited into civilization forces
- Population growth drives both biological and civilizational development

## Zoom Transition Contracts

### Smooth Abstraction Transitions
```ts
interface ZoomTransitionRule {
  fromLevel: number
  toLevel: number
  transitionType: "Split" | "Aggregate" | "Transform" | "Appear" | "Disappear"
  animationDuration: number
  detailIncreaseFactor: number
}

const ZOOM_TRANSITIONS: ZoomTransitionRule[] = [
  {
    fromLevel: 0,
    toLevel: 1,
    transitionType: "Split",
    animationDuration: 500,
    detailIncreaseFactor: 10
  },
  {
    fromLevel: 1, 
    toLevel: 2,
    transitionType: "Transform",
    animationDuration: 300,
    detailIncreaseFactor: 5
  },
  {
    fromLevel: 2,
    toLevel: 3,
    transitionType: "Appear",
    animationDuration: 200,
    detailIncreaseFactor: 20
  }
];
```

## Validation and Consistency Rules

### Population Conservation
- Total population across all entity levels must equal species population
- No population duplication when transitioning between zoom levels
- Population changes must propagate consistently across abstraction levels

### Spatial Consistency
- Settlement locations must be consistent across zoom levels
- Unit positions must be deterministic and reproducible
- No entity spawning in invalid terrain (e.g., aquatic units on land)

### Performance Requirements
- Entity generation must be fast enough for real-time zooming
- Memory usage must scale reasonably with map size and population
- No computational bottlenecks when transitioning between zoom levels

## Example Implementation Flow

1. **Species Populates Region**: `SpeciesTemplate` placed in biome with population count
2. **Level 0 Display**: Population shown as density heat map
3. **Zoom to Level 1**: Population clusters resolve into settlements based on thresholds
4. **Zoom to Level 2**: Settlements show infrastructure details
5. **Zoom to Level 3**: Individual units appear with specific behaviors
6. **Zoom Out**: Entities aggregate back following reverse transformation rules

This abstraction layer ensures that as players zoom into the map, they see increasingly detailed representations of species, from abstract population densities to individual creatures with specific behaviors, maintaining both biological authenticity and civilizational emergence possibilities.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
