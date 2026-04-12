# Mass Extinction Engine v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

Causes • Signatures • Recovery windows • Deterministic

---

## Purpose

Detect planet-scale shocks that cause rapid, uneven biodiversity loss, then:

* apply deterministic mortality by niche/tier
* emit a single extinction event record
* set a recovery window that boosts adaptive radiation

No randomness. No per-individual sim.

---

## 0.1 Anchor Flow (O(1) View)

Use this as the conceptual header flow for implementation and UI:

```text
Planet forcing
-> trigger matched (reason code)
-> severity computed
-> selectivity multipliers applied
-> mortality update
-> refugia handoff
-> recovery lag activated
```

This is a constant-shape decision chain. Per-species work is still O(Nspecies).

---

## 1. Data Types

```ts
enum ExtinctionCause {
  SnowballGlaciation,
  RunawayGreenhouse,
  MagnetosphereCollapse,
  AtmosphereLoss,
  RapidSeaLevelShift,
  OceanAnoxia,
  MegaVolcanism,
  ImpactWinter
}

interface MassExtinctionEvent {
  atTimeMs: AbsTime
  cause: ExtinctionCause
  severity01: number        // 0..1
  selectivity: SelectivityProfile
  recovery: RecoveryProfile
  reasonCode: ExtinctionReasonCode
}

type ExtinctionReasonCode =
  | "EXT_01_THERMAL_COLLAPSE_COLD"
  | "EXT_02_THERMAL_COLLAPSE_HOT"
  | "EXT_03_RADIATION_COLLAPSE"
  | "EXT_04_ATMOSPHERE_COLLAPSE"
  | "EXT_05_SEA_LEVEL_SHOCK"
  | "EXT_06_OCEAN_ANOXIA"
  | "EXT_07_MEGA_VOLCANISM"
  | "EXT_08_IMPACT_WINTER"
```

---

## 2. Inputs (Read-only)

From locked systems:

* `meanTempK`
* `tempDeltaK_100k` (computed trend over last 100k years)
* `precip01`
* `seaLevelDelta01_100k`
* `radiationStress01`
* `atmosphereDensity01`
* `oxygenState` (Anoxic | LowO2 | O2Rich) — you already have ox gates
* `GPP01` (from trophic model)
* `tectonicsActivity01` (optional; if missing, treat as 0.5)
* `impactFlux01` (optional; if missing, 0)

---

## 3. Trigger Conditions (LOCKED)

A mass extinction triggers when **any** condition hits threshold:

### A) Snowball

```
meanTempK < 250  AND  biosphereCapacity01 < 0.25
→ SnowballGlaciation
→ EXT_01_THERMAL_COLLAPSE_COLD
```

### B) Runaway greenhouse

```
meanTempK > 310  AND  precip01 < 0.35
→ RunawayGreenhouse
→ EXT_02_THERMAL_COLLAPSE_HOT
```

### C) Magnetosphere collapse

```
radiationStress01 > 0.7
→ MagnetosphereCollapse
→ EXT_03_RADIATION_COLLAPSE
```

### D) Atmosphere loss (Mars path)

```
atmosphereDensity01 < 0.2
→ AtmosphereLoss
→ EXT_04_ATMOSPHERE_COLLAPSE
```

### E) Rapid sea level shift

```
abs(seaLevelDelta01_100k) > 0.25
→ RapidSeaLevelShift
→ EXT_05_SEA_LEVEL_SHOCK
```

### F) Ocean anoxia (cheap proxy)

```
oxygenState != O2Rich  AND  oceanCoverage01 > 0.5  AND  meanTempK > 295
→ OceanAnoxia
→ EXT_06_OCEAN_ANOXIA
```

### G) Mega-volcanism (optional driver)

```
tectonicsActivity01 > 0.85  AND  tempDeltaK_100k > 3
→ MegaVolcanism
→ EXT_07_MEGA_VOLCANISM
```

### H) Impact winter (optional driver)

```
impactFlux01 > 0.8
→ ImpactWinter
→ EXT_08_IMPACT_WINTER
```

If multiple triggers fire, pick the **highest severity** (see §4), tie-break by this order:
ImpactWinter > MegaVolcanism > AtmosphereLoss > MagnetosphereCollapse > Snowball > Greenhouse > OceanAnoxia > SeaLevelShift

---

## 4. Severity Computation (LOCKED)

Severity is a deterministic mapping from "how far past threshold".

Example for each cause:

### Snowball

```
severity = clamp01((250 - meanTempK) / 30)
```

### Greenhouse

```
severity = clamp01((meanTempK - 310) / 25)
```

### Magnetosphere collapse

```
severity = clamp01((radiationStress01 - 0.7) / 0.3)
```

### Atmosphere loss

```
severity = clamp01((0.2 - atmosphereDensity01) / 0.2)
```

### Sea level shift

```
severity = clamp01((abs(seaLevelDelta01_100k) - 0.25) / 0.5)
```

### Ocean anoxia

```
severity = 0.4 + 0.6 * clamp01((meanTempK - 295) / 20)
```

### Mega-volcanism

```
severity = clamp01((tectonicsActivity01 - 0.85) / 0.15) * clamp01(tempDeltaK_100k / 8)
```

### Impact winter

```
severity = impactFlux01
```

---

## 5. Selectivity Profile (Who dies first)

```ts
interface SelectivityProfile {
  byHabitat: Record<Habitat, number>       // mortality multiplier
  byTrophic: Record<TrophicLevel, number>  // mortality multiplier
  byTier: Record<LifeTier, number>         // mortality multiplier
  byTraits: TraitSelectivityProfile
}

interface TraitSelectivityProfile {
  generalistVsSpecialist: { generalist: number; specialist: number }
  bodySizeClass: { micro: number; small: number; medium: number; large: number; giant: number }
  geographicDispersion: { narrow: number; regional: number; widespread: number }
}
```

Base mortality (LOCKED):

```
baseMortality = 0.15 + 0.70 * severity   // 0.15..0.85
```

Then multipliers apply.

### Cross-cause trait multipliers (LOCKED default)

These reflect survival biases that repeatedly appear in real mass-extinction patterns.

* Generalist: 0.85
* Specialist: 1.20
* Body size class:
  * micro: 0.60
  * small: 0.85
  * medium: 1.00
  * large: 1.15
  * giant: 1.35
* Geographic dispersion:
  * narrow: 1.30
  * regional: 1.00
  * widespread: 0.75

### Default multipliers by cause (LOCKED presets)

**Snowball**

* Habitat: Land 1.4, Coast 1.2, Ocean 0.8, Subsurface 0.6, Sky 1.5
* Trophic: Producer 1.3, Primary 1.2, Secondary 1.1, Apex 1.4, Decomposer 0.7
* Tier: Sophont 1.2, Complex 1.1, Simple 1.0, Microbial 0.4

**Greenhouse**

* Habitat: Ocean 1.2 (warm/anoxia), Land 1.1, Subsurface 0.7
* Producers 1.1, Apex 1.3
* Microbial 0.6

**MagnetosphereCollapse**

* Habitat: Land 1.4, Sky 1.3, Ocean 0.7, Subsurface 0.5
* Tier: Sophont 1.3, Complex 1.2, Microbial 0.6

**AtmosphereLoss**

* Habitat: Sky 2.0, Land 1.6, Coast 1.2, Ocean 0.8, Subsurface 0.6
* Producers 1.3
* Microbial 0.5

**OceanAnoxia**

* Habitat: Ocean 1.8, Coast 1.3, Land 0.9
* Decomposer 0.8
* Microbial 0.7

**ImpactWinter**

* Habitat: Land 1.3, Ocean 1.1, Subsurface 0.7
* Producer 1.6 (light loss), Apex 1.4
* Microbial 0.6

**MegaVolcanism**

* Producer 1.4, Apex 1.3
* Habitat: Land 1.2, Coast 1.2, Ocean 1.0, Subsurface 0.7

**SeaLevelShift**

* Coast 1.6, Ocean 1.2, Land 1.0

---

## 6. Applying Mortality (Deterministic)

For each species cluster:

```
m = baseMortality
  * multHabitat
  * multTrophic
  * multTier
  * multGeneralistSpecialist
  * multBodySize
  * multDispersion
```

Clamp:

```
m = clamp(m, 0, 0.95)
```

Update:

```
population01 *= (1 - m)
```

Then run your existing:

* trophic energy clamp
* extinction rule (3 epochs under 0.01)

---

## 7. Recovery Window (Drives Adaptive Radiation)

```ts
interface RecoveryProfile {
  durationYears: number
  radiationBoost01: number     // increases branching budget
  stabilityPenalty01: number   // reduces population stability temporarily
  lag: RecoveryLagProfile
}

interface RecoveryLagProfile {
  biodiversityRecoveryYears: number
  gppRecoveryYears: number
  gppToBiodiversityLagYears: number
}
```

LOCKED:

```
durationYears = round( 50_000 + 450_000 * severity )   // 50k..500k
radiationBoost01 = 0.2 + 0.6 * severity                // 0.2..0.8
stabilityPenalty01 = 0.1 + 0.4 * severity              // 0.1..0.5
biodiversityRecoveryYears = round(0.35 * durationYears)
gppRecoveryYears = round(0.70 * durationYears)
gppToBiodiversityLagYears = gppRecoveryYears - biodiversityRecoveryYears
```

During recovery:

* Adaptive radiation: `maxNewSpecies += round(12 * radiationBoost01)` (cap 24)
* Population model: reduce `maxPopulationChangePerEpoch` by `stabilityPenalty01` (more fragile)
* Ecosystem-function lag: treat `GPP01` recovery as slower than biodiversity count recovery.
  * Recovery completes only when both biodiversity and GPP lag gates are satisfied.

---

## 8. Output Events (LOCKED)

Emit:

* `MassExtinctionEvent`
* `BiomeInvalidated` (always)
* `HydrologyInvalidated` if cause affects water (Snowball/Greenhouse/SeaLevel/Anoxia)
* `RecoveryLagActivated` with `gppToBiodiversityLagYears`

Store to archive permanently.

---

## 9. Bestiary Presentation Hook

Each extinct species keeps:

* `†` marker
* "Extinction cause"
* "Extinction epoch"
* "Likely refugia" (derived from selectivity: lowest-mortality habitat)

---

## 10. Performance

O(Nspecies) per event.
Events are rare (geologic scale), so negligible.

---

## Result

You now have the full punctuated loop:

**Planet forcing → Mass extinction → Niche gaps → Adaptive radiation → New stable web**

This is exactly the deep-time "Earth feel" but game-simple.

---

## Integration

This system integrates with:

* **Adaptive Radiation** - Recovery window boosts branching budget
* **Refugia & Colonization** - Extinction events trigger refugia formation
* **Population Dynamics** - Mortality application and stability penalties
* **Bestiary** - Extinction records and presentation
* **Trophic Energy Model** - Producer collapse cascades

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
