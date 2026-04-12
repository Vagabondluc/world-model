# 🔒 SIMULATOR DASHBOARD & INTERPRETATION CONTRACT (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

This applies to **every domain** (climate, magnetosphere, carbon, tectonics, biosphere).

---

## 1️⃣ Principle: No Raw Stats Exposed

Internal variables:

* `health01`
* `co2Q`
* `eps`
* `meanTempK`
* `radiationStress01`

are never shown directly.

Every simulator must expose:

```ts
interface SimulatorViewModel {
  primaryGauge: number        // 0..1
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
  shortSummary: string
  longExplanation: string
  visualHooks: VisualState
}
```

This is onboarding layer.

---

## 2️⃣ Magnetosphere Dashboard Spec

You already defined:

```ts
health01
radiationStress01
polarity
```

We now define the **player abstraction**:

### View Mapping (LOCKED)

```ts
shieldHP = health01
```

Risk level:

```
if health > 0.6 → Low
if 0.3 < health ≤ 0.6 → Moderate
if 0.15 < health ≤ 0.3 → High
if health ≤ 0.15 → Critical
```

Surface radiation display:

```
surfaceRadiation01 = radiationStress01
```

---

## 3️⃣ Atmosphere Leak Mechanic (Locked)

If:

```
health01 < 0.2
```

Atmospheric erosion begins.

Atmosphere density state:

```ts
type AtmosphereDensity01 = number
```

Erosion rate:

```
erosion = kSolarWind * (0.2 - health01)
```

Defaults:

```
kSolarWind = 0.01 per 10k years
```

If `health01 = 0`:

* steady bleed
* Venus brute-force allowed via volcanic outgassing

This creates:

* Mars outcome naturally.

---

## 4️⃣ Radiation & Life Gate (Locked)

Biosphere receives:

```ts
radiationStress01
```

Rules:

* If `radiationStress01 > 0.4` → surface complex life growth rate negative
* If `radiationStress01 > 0.7` → extinction pressure applied

Aquatic life modifier:

```
aquaticShield = 0.6
effectiveStress = radiationStress01 * (1 - aquaticShield)
```

So oceans become refuge.

Underground refuge later extension.

---

## 5️⃣ Core → Shield → Atmosphere → Life Loop (Formalized)

We freeze the loop explicitly in documentation:

```
CoreHeat + Rotation + Tectonics
        ↓
Magnetosphere Health
        ↓
Radiation Stress + Solar Wind Erosion
        ↓
Atmosphere Density
        ↓
Climate Stability + Surface Radiation
        ↓
Biosphere Capacity
```

No hidden couplings.

---

## 6️⃣ Venus Strategy (Optional but Locked)

If:

```
atmosphereDensity01 > 0.85
```

Solar wind erosion capped at 50%.

This allows:

* thick atmosphere survival
* greenhouse runaway risk

This creates a strategic branch without adding physics complexity.

---

## 7️⃣ Visual Feedback Contract

Each domain must expose a `VisualState`:

```ts
interface MagnetosphereVisualState {
  auroraIntensity01: number
  auroraLatitudeSpread01: number
  skyRadiationTint01: number
}
```

Mapping:

```
auroraIntensity = health01
auroraLatitudeSpread = 1 - health01
skyRadiationTint = radiationStress01
```

No randomness.

Deterministic, aesthetic, explanatory.

---

## 8️⃣ Dashboard Rule for All Domains

Every simulator domain must define:

1. Hidden core state (engine)
2. Derived systemic outputs (for other domains)
3. Dashboard abstraction (for player)

This prevents:

* leaking implementation details
* redesigning core systems when UI changes
* coupling gameplay to internal math

---

## 9️⃣ Onboarding Contract

Each simulator must include:

* "What is this?"
* "Why does it matter?"
* "What controls it?"
* "What happens if it fails?"
* "What can player do?"

This is not fluff — this prevents feature bloat.

---

## 1️⃣0️⃣ Domain Dashboard Interface (Canonical)

Every domain MUST expose this structured contract:

```ts
interface DomainDashboard {
  domainId: DomainId
  meta: MetaPanelV1
  timeline: TimelinePanelV1
  stateView: StateViewPanelV1
  parameterPanel: ParameterPanelV1
  eventTrace: EventTracePanelV1
  validityPanel: ValidityPanelV1
  modePanel: ModePanelV1
  onboarding: OnboardingPanelV1
  modInterface: ModInterfacePanelV1
}
```

```ts
interface MetaPanelV1 {
  domainName: string
  currentMode: DomainMode
  lastAdvancedAbsTime: AbsTime
  nextScheduledAbsTime: AbsTime
  domainVersion: uint32
  rngVersion: uint16
  eventOrderVersion: uint16
}
```

```ts
interface ValidityPanelV1 {
  numericalStabilityOK: boolean
  constraintViolation: boolean
  conservationResidualPPM?: int32
  nonNegativeGuarantee: boolean
  capacityBoundsGuarantee: boolean
  integrityHash64: uint64
}
```

Hard rules:
* timelines use domain tick units
* all displayed values are quantized + unit-labeled
* parameter mutation emits deterministic parameter-change events
* no silent dashboard-only state

---

## 1️⃣1️⃣ Mod Hook Surface

```ts
interface ModHook {
  parameterOverrides?: boolean
  eventInjection?: boolean
  newSpeciesTemplate?: boolean
  newBehaviorTag?: boolean
  newEquationVariant?: boolean
}
```

All mod hooks MUST:
* emit deterministic events
* be versioned
* be visible in EventTrace
