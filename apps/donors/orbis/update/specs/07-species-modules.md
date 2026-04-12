# 🔒 SPECIES MODULE CATALOG v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

Goal:
Small set of composable genetic capability modules.

Hard rule:
Max 8 modules per species.

---

## 1️⃣ Metabolic Modules

```ts
enum MetabolismModule {
  AnaerobicFerment,
  Chemosynthesis,
  OxygenicPhotosynthesis,
  AerobicRespiration,
  FacultativeSwitch
}
```

Rules:

* `AerobicRespiration` requires O2Rich
* `OxygenicPhotosynthesis` can trigger oxygenation epoch
* `FacultativeSwitch` requires one anaerobic + one aerobic

---

## 2️⃣ Structural Modules

```ts
enum StructureModule {
  Cytoskeleton,
  MulticellularAdhesion,
  MineralizedSupport,     // bone/shell/armor analog
  MycelialNetwork,
  VascularTransport,
  Exoskeleton
}
```

Rules:

* `MulticellularAdhesion` requires EukaryoteLike
* `VascularTransport` requires MulticellularAdhesion
* `MineralizedSupport` requires MulticellularAdhesion

---

## 3️⃣ Sensory / Neural Modules

```ts
enum NeuralModule {
  ChemicalSignaling,
  LightDetection,
  SimpleGanglia,
  CentralizedBrain,
  Echolocation,
  Electroreception
}
```

Rules:

* `CentralizedBrain` requires SimpleGanglia
* `SimpleGanglia` requires MulticellularAdhesion

---

## 4️⃣ Reproductive Modules

```ts
enum ReproductionModule {
  AsexualDivision,
  SexualRecombination,
  SporeRelease,
  AlternatingGenerations,
  Parthenogenesis
}
```

Rules:

* `SexualRecombination` increases adaptability factor
* `SporeRelease` favors fungal/plant analogs

---

## 5️⃣ Environmental Adaptation Modules

```ts
enum AdaptationModule {
  Thermotolerance,
  Cryotolerance,
  RadiationShielding,
  AquaticRespiration,
  TerrestrialRespiration,
  FlightCapability,
  BurrowingCapability
}
```

Rules:

* `RadiationShielding` reduces radiationStress impact
* `AquaticRespiration` requires oceanCoverage > 0
* `FlightCapability` requires MineralizedSupport OR Exoskeleton

---

## 🔒 SPECIES GENOME STRUCTURE

```ts
interface SpeciesGenome {
  trunk: TrunkId
  metabolism: MetabolismModule[]
  structure: StructureModule[]
  neural: NeuralModule[]
  reproduction: ReproductionModule[]
  adaptations: AdaptationModule[]
}
```

Hard cap:
Total modules ≤ 8

---

## 🔒 FANTASY RACE TEMPLATE LAYER

Canonical source: [`docs/09-fantasy-race-templates.md`](./09-fantasy-race-templates.md)

This section provides the deterministic presets built on trunk logic. See the canonical file for Elf, Human, Myconid, and Treant module bundles.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
