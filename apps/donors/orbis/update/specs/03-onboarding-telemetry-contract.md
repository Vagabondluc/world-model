# Onboarding Telemetry & Explainability Contract

This contract defines observable onboarding events and diagnostic payloads.

## 1) Telemetry Event Types

```ts
type OnboardingTelemetryType =
  | "ONBOARDING_SESSION_STARTED"
  | "ONBOARDING_STEP_OPENED"
  | "ONBOARDING_GATE_EVALUATED"
  | "ONBOARDING_STEP_COMPLETED"
  | "ONBOARDING_STEP_BLOCKED"
  | "ONBOARDING_TRACK_COMPLETED"
  | "ONBOARDING_BENCHMARK_RUN"
```

interface OnboardingTelemetryEventV1 {
  tsUtc: string
  userId: string
  sessionId: string
  type: OnboardingTelemetryType
  stepId?: string
  trackId?: string
  reasonCode?: string
  payload: Record<string, number | string | boolean>
}
```

## 2) Reason Code Contract

```ts
type OnboardingReasonCode =
  | "GATE_METRIC_NOT_REACHED"
  | "GATE_EVENT_NOT_SEEN"
  | "GATE_BENCHMARK_FAILED"
  | "STEP_DEPENDENCY_LOCKED"
  | "STEP_COMPLETED_OK"
  | "TIME_LIMIT_EXCEEDED"
```

interface OnboardingExplainRecord {
  stepId: string
  gateId: string
  passed: boolean
  reasonCode: OnboardingReasonCode
  observedValue?: number
  targetValue?: number
}
```

## 3) Telemetry Sink API

```ts
interface OnboardingTelemetrySink {
  emit(event: OnboardingTelemetryEventV1): void
  emitBatch(events: OnboardingTelemetryEventV1[]): void
}
```

## 4) Privacy/Scope Rules

1. Telemetry must not include raw simulation internals that are not needed for onboarding diagnostics.
2. Event payloads should favor reason codes and scalar summaries over large state dumps.
3. Telemetry is advisory and cannot drive authoritative simulation updates.
