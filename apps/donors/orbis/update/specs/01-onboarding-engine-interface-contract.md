# Onboarding Engine Interface Contract

This file defines how onboarding UI reads simulation state without violating authority boundaries.

## 1) Snapshot Views

```ts
type DomainKey =
  | "time"
  | "climate"
  | "hydrology"
  | "biome"
  | "carbon"
  | "biosphere"
  | "population"
  | "events"

interface OnboardingMetricSnapshot {
  tick: number
  metrics: Record<string, number>
  validityFlags: string[]      // e.g. SATURATED, FALLBACK_USED
}

interface OnboardingDomainSnapshot {
  domain: DomainKey
  atTick: number
  scalarMetrics: Record<string, number>
  tags?: string[]
}
```

## 2) Gate Evaluation Contracts

```ts
interface MetricThresholdGate {
  kind: "metric_threshold"
  metric: string
  operator: ">" | "<" | ">=" | "<=" | "=="
  targetValue: number
  tolerance?: number
}

interface EventSeenGate {
  kind: "event_seen"
  eventType: string
  minCount: number
}

interface BenchmarkPassedGate {
  kind: "benchmark_passed"
  scenarioId: string
}

type OnboardingGateCheck =
  | MetricThresholdGate
  | EventSeenGate
  | BenchmarkPassedGate
```

## 3) Engine Adapter API

```ts
interface OnboardingEngineAdapter {
  // Read-only simulation snapshots for UI.
  getDomainSnapshot(domain: DomainKey, tick?: number): OnboardingDomainSnapshot

  // Stream onboarding-relevant events.
  listRecentEvents(limit: number): Array<{ tick: number; type: string; payload: Record<string, unknown> }>

  // Deterministic gate check.
  evaluateGate(check: OnboardingGateCheck): { passed: boolean; reasonCode?: string; observedValue?: number }

  // Optional scenario execution for teaching.
  runBenchmarkScenario(scenarioId: string): { status: "PASSED" | "FAILED"; failCode?: string; endTick: number }
}
```

## 4) Authority Constraints

1. Adapter methods are read-only relative to simulation authority.
2. No onboarding action may directly mutate domain fields.
3. Sandbox scenario runs must use explicit mode + seed and report both.
