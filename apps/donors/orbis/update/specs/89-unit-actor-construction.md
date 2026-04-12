# 89 Unit & Actor Construction (Extensive Draft)

SpecTier: Brainstorm

## Purpose
Define the deterministic assembly of mobile entities (Units) from biological templates, institutional equipment, and elite leadership.

## Spec Header
- `Version`: `v0.1-brainstorm`
- `DependsOn`: 
    - [`00-data-types.md`](../specs/00-core-foundation/00-data-types.md) (`uint32`, `uint64`)
    - [`68-numerical-stability-fixed-point-math-contract.md`](../specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md) (`mulPPM`)
    - [`08-species-template-procedural-biology.md`](../specs/10-life-ecology/08-species-template-procedural-biology.md) (`SpeciesId`)
    - [`84-institution-elite-layer.md`](./84-institution-elite-layer.md) (Equipment & Training)
    - [`38-unified-tag-system.md`](../specs/30-runtime-determinism/38-unified-tag-system.md) (`TagInstance`, `TagSet`)
    - [`85-elite-actor-character-engine.md`](./85-elite-actor-character-engine.md) (`ActorCompetencePPM`)
- `Owns`: [`UnitBlueprintV1`, `UnitInstanceV1`, `EquipmentProfileV1`]
- `Writes`: [`WorldDelta` (Construction events)]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/89-unit-actor-construction.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## 1. Unit Blueprint Definition
A blueprint is a "Recipe" for a unit type, combining a species with a role.

```ts
interface EquipmentProfileV1 {
  id: string
  complexityPPM: uint32
  requiredInstitutionType: string // e.g. "military"
  modifiers: TagInstance[] // e.g. Armored, LongRange
}

interface UnitBlueprintV1 {
  blueprintId: string
  name: string
  baseSpeciesId: SpeciesId
  role: "worker" | "scout" | "soldier" | "specialist"
  equipment: EquipmentProfileV1[]
  trainingInstitutionId?: string
}
```

## 2. Construction Formulas (PPM)
All costs are calculated in `ProductionPointsPPM` per unit.

### 2.1 Base Biological Cost
```text
BioCost = mulPPM(species.metabolismPPM, species.bodySizePPM)
```
*Note: Large, high-metabolism creatures are exponentially more expensive to "train" or "spawn".*

### 2.2 Equipment & Training Cost
```text
TotalCost = BioCost + sum(equipment.complexityPPM) + trainingMultiplierPPM
```

## 3. Unit Instance State
A unit is a single deterministic entity on the map.

```ts
interface UnitInstanceV1 {
  unitId: uint64 // hash(OwnerId, BlueprintId, BirthTick)
  blueprintId: string
  currentHexId: uint64
  healthPPM: uint32
  energyPPM: uint32
  experiencePPM: uint32
  tags: TagSet // Inherited from Species + Equipment
  commanderActorId?: string // Link to Spec 85
}
```

## 4. Genetic & Institutional Inheritance
Units are "Sum Layers" of their origins:
1.  **Biology**: Inherits `Photosynthetic`, `Nocturnal`, etc. from Spec 08.
2.  **Institution**: Inherits `Militaristic`, `Scholarly`, etc. from Spec 84.
3.  **Elite Actor**: If a unit has a `commanderActorId` (Spec 85), it gains `ActorCompetencePPM` bonuses to its `SuccessProbability`.

## 5. Determinism Rules
- **Stable ID**: Unit ID must be a 64-bit hash. No auto-incrementing integers allowed.
- **Order of Build**: If multiple units finish in one tick, process by `BlueprintId` (ascending), then `UnitId` (ascending).
- **Tie-Breaking**: If construction resources are exactly equal to cost, the build succeeds.

## 6. Event Emission
Upon completion, the construct system emits:
- `UNIT_SPAWNED(unitId, hexId, time)`
- `RESOURCE_DELTA(ownerId, -TotalCost, time)`

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
