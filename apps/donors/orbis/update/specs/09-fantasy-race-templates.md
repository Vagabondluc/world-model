# 🔒 FANTASY RACE TEMPLATE LAYER (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/07-species-modules.md`](./07-species-modules.md)
- `Owns`: `[]`
- `Writes`: `[]`

---

Templates are deterministic presets built on real trunk logic.

---

## 🧝 Elf Template

```ts
trunk: Eukarya_Opisthokonta

modules:
  AerobicRespiration
  MulticellularAdhesion
  VascularTransport
  CentralizedBrain
  SexualRecombination
  TerrestrialRespiration
  LightDetection
```

Traits:

* High biosphere dependency
* Sensitive to radiation increase
* Forest synergy if Archaeplastida present

---

## 🧙 Human Template

Same trunk.

Modules:
AerobicRespiration
MulticellularAdhesion
MineralizedSupport
CentralizedBrain
SexualRecombination
TerrestrialRespiration

---

## 🍄 Myconid Template

```ts
trunk: Eukarya_Opisthokonta
```

Modules:
AerobicRespiration
MycelialNetwork
SporeRelease
ChemicalSignaling
RadiationShielding
Cryotolerance

Resilient to extinction events.

---

## 🌳 Treant Template

```ts
trunk: Eukarya_Archaeplastida
```

Modules:
OxygenicPhotosynthesis
MulticellularAdhesion
VascularTransport
AlternatingGenerations
MineralizedSupport
LightDetection

Requires O2Rich world.

---

## 🐙 Aberrant Aquatic Intelligence

```ts
trunk: Eukarya_SAR
```

Modules:
AerobicRespiration
MulticellularAdhesion
SimpleGanglia
Electroreception
AquaticRespiration
SexualRecombination

---

## 🧪 Slime/Ooze Template

```ts
trunk: Eukarya_Amoebozoa
```

Modules:
Chemosynthesis
MulticellularAdhesion
RadiationShielding
AsexualDivision
BurrowingCapability

High survival in harsh worlds.

---

## 🔒 EVOLUTION RULE (LIGHTWEIGHT)

Speciation occurs when:

```
EnvironmentalShiftSeverity01 > 0.3
```

Process:

- Copy parent genome
- Mutate one module slot
- Recalculate fitness

No gene-level simulation.

---

## 🔒 FITNESS MODEL (SPECIES LEVEL)

Each species has:

```ts
fitness01 =
  climateCompatibility *
  radiationTolerance *
  metabolicCompatibility *
  competitionFactor
```

CompetitionFactor derived from niche overlap.

---

## 🔒 LIFE COMPLEXITY TIERS

Based on module count + neural tier:

| Tier                 | Requirement                   |
| -------------------- | ----------------------------- |
| Microbial            | ≤2 modules                    |
| Simple Multicellular | 3–4 modules                   |
| Complex Organism     | 5–6 modules                   |
| Sophont              | CentralizedBrain + ≥6 modules |

Sophont unlocks civilization plugin.

---

## 🔒 INTEGRATION WITH PLANET SYSTEM

Species survival automatically tied to:

* magnetosphere
* atmosphere
* temperature
* precipitation
* ocean coverage

No extra glue code required.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
