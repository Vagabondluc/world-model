# 🔒 BENCHMARK SCENARIO CONTRACT v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/68-numerical-stability-fixed-point-math-contract.md`]
- `Owns`: [`SpecMode`, `Comparator`, `BenchmarkCondition`, `BenchmarkScenario`]
- `Writes`: `[]`

---

(Deterministic • Testable • Mode-Aware)

## 0️⃣ Purpose

Define a canonical benchmark scenario contract for simulation regression testing.

This contract standardizes:
- scenario metadata
- input presets
- pass/fail conditions
- deterministic diagnostics (`fail_code`)

It supports two runtime modes:
- `strict_science`
- `gameplay_accelerated`

---

## 1️⃣ Uncertainty Standard (Final Defaults)

These ranges are for risk display and diagnostics. Authoritative solver paths continue to use canonical base values.

| Variable Category | Uncertainty Range | Implementation Note |
| :--- | :--- | :--- |
| **Physical Constants** | `+-2%` | Solar output, orbital distance, gravity |
| **Geological Rates** | `+-10%` | Volcanic outgassing, weathering rates |
| **Climate Feedbacks** | `+-25%` | Albedo, cloud forcing, water vapor |
| **Biological Yields** | `+-35%` | Crop harvest, population growth, disease |
| **Economic/Tech** | `+-50%` | Construction costs, research speed |

---

## 2️⃣ Contract Types (TypeScript)

```ts
type SpecMode = 'strict_science' | 'gameplay_accelerated'
type Comparator = '>' | '<' | '>=' | '<=' | '==' | 'stabilizes_within'

interface BenchmarkCondition {
  metric: string             // e.g., "global_temp_k"
  operator: Comparator
  target_value: number
  fail_code: string          // required for deterministic diagnostics
  tolerance?: number         // required for '==' or 'stabilizes_within'
  window_ticks?: number      // required for 'stabilizes_within'
}

interface BenchmarkScenario {
  metadata: {
    id: string               // ^[a-z0-9_]+$
    name: string
    description: string
    spec_mode: SpecMode
    version: string
  }
  input_preset: Record<string, number | boolean>
  contracts: {
    time_limit_ticks: number
    success_conditions: [BenchmarkCondition, ...BenchmarkCondition[]]
    fail_conditions?: BenchmarkCondition[]
  }
}
```

---

## 3️⃣ Validation Rules

1. `success_conditions` must contain at least one condition.
2. Every condition must define `fail_code`.
3. For `operator == 'stabilizes_within'`, both `tolerance` and `window_ticks` are required.
4. `metadata.id` should match `^[a-z0-9_]+$`.
5. Scenario execution must stop at `time_limit_ticks`.

---

## 4️⃣ Minimal Runner Logic (Pseudocode)

```ts
function run_benchmark(scenario: BenchmarkScenario): TestResult {
  const sim = new Simulation()
  sim.apply_preset(scenario.input_preset)
  sim.set_mode(scenario.metadata.spec_mode)

  for (let tick = 0; tick < scenario.contracts.time_limit_ticks; tick++) {
    sim.step()

    if (scenario.contracts.fail_conditions) {
      for (const cond of scenario.contracts.fail_conditions) {
        if (check_condition(sim, cond)) {
          return { status: 'FAILED', reason: cond.fail_code, tick }
        }
      }
    }

    if (scenario.contracts.success_conditions.every(c => check_condition(sim, c))) {
      return { status: 'PASSED', tick }
    }
  }

  return { status: 'FAILED', reason: 'TIME_LIMIT_EXCEEDED' }
}
```

---

## 5️⃣ Seed Scenarios (Starter Pack)

1. Snowball Recovery
2. Runaway Venus
3. Yeasty Boom-Bust

Each scenario must define:
- `input_preset`
- `success_conditions`
- optional `fail_conditions`
- explicit `spec_mode`

---

## 6️⃣ Determinism Notes

- Authoritative simulation path should remain fixed-point where specified by numeric contract.
- Display/UI risk bands may use float transforms derived from canonical base values.
- Benchmark pass/fail checks must run against authoritative state values.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
