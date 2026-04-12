# 🔒 HIERARCHICAL TEMPORAL TIERS SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/01-time-clock-system.md`, `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`]
- `Owns`: [`TemporalTier`, `TemporalTickingContract`, `PoissonPoissonMarkovKernel`, `InterleavedExecutionRules`]
- `Writes`: [`DomainMode`]

---

## 0️⃣ Core Principle

To scale from tactical combat (seconds) to geological epochs (millions of years), the simulation partitions all **Domains** into discrete **Temporal Tiers**. 

Each tier defines a mandatory update cadence and a default simulation mechanism.

---

## 1️⃣ Temporal Tiers (LOCKED)

```ts
enum TemporalTier {
  T0_TACTICAL = 0,      // Real-time / Seconds (Combat, Movement)
  T1_CIVILIZATIONAL = 1, // Historical / Years (Economy, Tech, Social)
  T2_ECOLOGICAL = 2,    // Biological / Centuries (Speciation, Life Cycles)
  T3_GEOLOGICAL = 3     // Planetary / Epochs (Tectonics, Atmosphere)
}
```

### Tier Attributes

| Tier | Cadence Ratio (vs T0) | Default Mode | Primary Driver |
|---|---|---|---|
| **T0** | 1:1 | `HighRes` | Agent Needs / Tactical AI |
| **T1** | 1:100 | `Step` | Pressure Propagation Engine |
| **T2** | 1:1,000 | `Regenerate` | Logistic Growth / Biomass Flux |
| **T3** | 1:10,000+ | `Regenerate` | Poisson-Poisson Markov Kernel |

---

## 2️⃣ Poisson-Poisson Markov (PPM) Kernel

For ultra-cheap time skips (T2/T3), the simulation uses a statistical fast-forward model instead of step-by-step iteration.

### 2.1 The Kernel Definition

```ts
interface PoissonPoissonMarkovKernel {
  lambdaPPM: PpmInt      // Mean event rate per 1M ticks
  impactMeanPPM: PpmInt  // Average impact magnitude
  driftMatrixId: uint32  // Markov transition matrix reference
}

interface TemporalTickingContract {
  tier: TemporalTier
  cadenceRatioVsT0: uint32
  defaultMode: DomainMode
  maxStepBudgetMs: uint16
}

interface InterleavedExecutionRules {
  smearChunkCount: uint16
  maxChunkBudgetUs: uint32
  notifyOnCompleteOnly: boolean
}
```

### 2.2 Execution Formula

Given a time delta `dT` (in ticks of current tier):

1. **Discrete Events**: `count = PoissonSample(lambda * dT)`
2. **Cumulative Shift**: `totalChange = count * impactMeanPPM`
3. **State Transition**: `nextState = MarkovTransition(currentState, driftMatrixId, dT)`

---

## 3️⃣ Interleaved Execution (Smearing) Rules

Heavy T3 updates must not block T0 tactical performance.

### 3.1 Smearing Contract
*   Any `AdvanceTo` call for a T2/T3 domain requiring `> 1ms` must be marked as `Interleaved`.
*   The workload is subdivided into `SmearChunks`.
*   Each T0 tick executes exactly **one** `SmearChunk`.

### 3.2 Thread Synchronization
*   Uses `Atomics.notify` only when the *entire* smearing sequence is complete.
*   T0 systems read-only from the **Last Consistent Buffer** until completion.

---

## 4️⃣ Lifecycle Fast-Forward (Logistic Integration)

Biological systems in T2 bypass agent-looping during fast-forward.

### 4.1 The Logistic Integral
For a population `N` over time `dt`:
`N_final = K / (1 + ((K - N_start) / N_start) * exp(-r * dt))`

*   `K`: Carrying Capacity (Spec 143)
*   `r`: Growth Rate (Fixed-point)

---

## 5️⃣ Compliance Vector (v1)

### Input
- `WorldSeed: 12345`
- `CurrentTick: 0`
- `FastForward: 10,000 T0 Ticks`
- `Target: T2 Ecosystem (λ=0.001, impact=+10k PPM)`

### Expected Output
- `PoissonSample` returns `10` events (deterministic for seed).
- `totalChange = 10 * 10,000 = 100,000 PPM`.
- `BiomassPPM` increases by exactly `100,000`.
- Execution time `< 1ms` (No micro-looping of 10,000 ticks).

---

## Unit Policy
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (`SharedUnitPolicyClauseV1`).

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (`SharedReasonCodeIntegrationClauseV1`); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.
