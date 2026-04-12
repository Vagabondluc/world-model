# Onboarding Progress & Persistence Contract

This contract defines persistent onboarding state and a UI store shape.

## 1) Progress State

```ts
type StepCompletionState = "locked" | "unlocked" | "completed" | "skipped"

interface OnboardingStepProgress {
  stepId: string
  state: StepCompletionState
  completedAt?: string
  attempts: number
  lastReasonCode?: string
}

interface OnboardingTrackProgress {
  trackId: string
  completionPercentPPM: number   // 0..1_000_000
  steps: OnboardingStepProgress[]
}

interface OnboardingProgressV1 {
  userId: string
  activeTrackId: string
  activeStepId: string
  tracks: OnboardingTrackProgress[]
  unlockedFeatureFlags: string[]
  updatedAt: string
}
```

## 2) Persistence API

```ts
interface OnboardingProgressRepository {
  load(userId: string): OnboardingProgressV1 | null
  save(progress: OnboardingProgressV1): void
  reset(userId: string): void
}
```

## 3) UI Store Contract (Zustand-Compatible Shape)

```ts
interface OnboardingUIStore {
  progress: OnboardingProgressV1 | null
  sessionState: "idle" | "active" | "blocked" | "completed"

  startTrack(trackId: string): void
  openStep(stepId: string): void
  completeStep(stepId: string): void
  failGate(stepId: string, reasonCode: string): void
  skipStep(stepId: string): void
  persist(): void
}
```

## 4) Deterministic Progress Rules

1. `completeStep` must only occur after all required gates pass.
2. `skipStep` cannot unlock dependent steps unless explicitly flagged.
3. Progress timestamps are informative only and must not affect simulation outcomes.
