# Onboarding Experience Map

This document converts `docs/onboard/*` learning content into an executable UI flow.

## 1) Tracks

```ts
type OnboardingTrackId =
  | "intro"
  | "foundations"
  | "planetary_physics"
  | "biology"
  | "civilization"
  | "technical"
```

## 2) Step Types

```ts
type OnboardingStepType =
  | "read"
  | "visualize"
  | "inspect_metric"
  | "run_scenario"
  | "answer_check"
  | "summary"
```

## 3) Gate Types

```ts
type GateKind =
  | "step_completed"
  | "metric_threshold"
  | "event_seen"
  | "benchmark_passed"
  | "quiz_score"
```

interface OnboardingGate {
  gateId: string
  kind: GateKind
  payload: Record<string, number | string | boolean>
}
```

## 4) Step Contract

```ts
interface OnboardingStepDef {
  stepId: string
  trackId: OnboardingTrackId
  index: number
  type: OnboardingStepType
  title: string
  sourceDocPath: string        // e.g. docs/onboard/02-planetary-physics.md
  requiredGates: OnboardingGate[]
  optionalHints: string[]
  unlocksStepIds: string[]
}
```

## 5) Session Flow State Machine

```ts
type OnboardingSessionState =
  | "idle"
  | "active"
  | "blocked"
  | "completed"

interface OnboardingSession {
  sessionId: string
  userId: string
  state: OnboardingSessionState
  activeTrackId: OnboardingTrackId
  activeStepId: string
  startedAt: string
  updatedAt: string
}
```

Transitions:
1. `idle -> active` when user starts a track.
2. `active -> blocked` when required gate is unmet.
3. `blocked -> active` when gate condition is satisfied.
4. `active -> completed` when all required steps in selected tracks are complete.
